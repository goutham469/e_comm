import React, { useState, useEffect } from "react";
import { API } from "../utils/API";
import { toast } from "react-toastify";

function UpdatePhone({ closeForm })
{
    const [phone, setPhone] = useState("");
    const [countryCode, setCountryCode] = useState("+91");
    const [otp, setOtp] = useState("");
    const [serverOtp, setServerOtp] = useState("")
    const [otpSent, setOtpSent] = useState(false);
    const [timer, setTimer] = useState(0);
    const [error, setError] = useState("");

    // OTP resend timer
    useEffect(() =>
    {
        if (timer === 0) return;

        const interval = setInterval(() =>
        {
            setTimer(prev => prev - 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [timer]);

    const handleSendOtp = async () =>
    {
        setError("");
        if (!phone || phone.length < 10)
        {
            setError("Enter a valid phone number");
            return;
        }
        // 🔥 API CALL HERE (send OTP)
        console.log("Send OTP to:", `${countryCode}${phone}`);
        const response = await API.USER.update_phone_number_call_otp(`${countryCode}${phone}`);
        console.log(response)
        
        if(response.success){
            setServerOtp(response.data.otp);

            setOtpSent(true);
            setTimer(30); // 30 sec resend cooldown
        }else{
            toast.error(response.error);
        }
    };

    const handleVerifyOtp = async () =>
    {
        setError("");
        if (!otp || otp.length !== 6)
        {
            setError("Enter valid 6-digit OTP");
            return;
        }
        console.log(otp, otpSent);

        if( otp != serverOtp ){
            setError("Incorrect OTP");
            return;
        }else{
            const response = await API.USER.update_phone_number(phone);
            toast.success("OTP verificed");
            if(response.success){
                toast.success("Phone number updated");
            }
        }
        closeForm(false);
    };

    const handleResendOtp = () =>
    {
        if (timer > 0) return;

        // 🔥 API CALL HERE (resend OTP)
        console.log("Resend OTP");

        setTimer(30);
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white w-full max-w-sm rounded-xl p-6 space-y-5">

                {/* Header */}
                <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold">
                        Update Phone Number
                    </h2>
                    <button
                        onClick={() => closeForm(false)}
                        className="text-gray-400 hover:text-gray-700"
                    >
                        ✕
                    </button>
                </div>

                {/* Phone Input */}
                {!otpSent && (
                    <div className="space-y-2">
                        <label className="text-sm text-gray-600">
                            Phone Number
                        </label>

                        <div className="flex gap-2">
                            <select
                                value={countryCode}
                                onChange={e => setCountryCode(e.target.value)}
                                className="border rounded-lg px-2 py-2 text-sm"
                            >
                                <option value="+91">+91 (IN)</option>
                                <option value="+1">+1 (US)</option>
                                <option value="+44">+44 (UK)</option>
                            </select>

                            <input
                                type="tel"
                                placeholder="Enter phone number"
                                value={phone}
                                onChange={e => setPhone(e.target.value)}
                                className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                            />
                        </div>
                    </div>
                )}

                {/* OTP Input */}
                {otpSent && (
                    <div className="space-y-2">
                        <label className="text-sm text-gray-600">
                            Enter OTP
                        </label>

                        <input
                            type="text"
                            maxLength={6}
                            placeholder="6-digit OTP"
                            value={otp}
                            onChange={e => setOtp(e.target.value)}
                            className="w-full border rounded-lg px-3 py-2 text-sm text-center tracking-widest focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        />

                        <div className="text-xs text-gray-500 text-center">
                            {timer > 0
                                ? `Resend OTP in ${timer}s`
                                : (
                                    <button
                                        onClick={handleResendOtp}
                                        className="text-cyan-600 hover:underline"
                                    >
                                        Resend OTP
                                    </button>
                                )
                            }
                        </div>
                    </div>
                )}

                {/* Error */}
                {error && (
                    <p className="text-sm text-red-500">
                        {error}
                    </p>
                )}

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                    {!otpSent ? (
                        <button
                            onClick={handleSendOtp}
                            className="flex-1 bg-cyan-600 text-white py-2 rounded-lg text-sm hover:bg-cyan-700"
                        >
                            Send OTP
                        </button>
                    ) : (
                        <button
                            onClick={handleVerifyOtp}
                            className="flex-1 bg-green-600 text-white py-2 rounded-lg text-sm hover:bg-green-700"
                        >
                            Verify & Update
                        </button>
                    )}

                    <button
                        onClick={() => closeForm(false)}
                        className="flex-1 border py-2 rounded-lg text-sm hover:bg-gray-100"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}

export default UpdatePhone;
