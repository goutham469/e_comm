import React, { useState } from "react";
import { API } from "../utils/API";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { user_slice_login } from "../redux/slices/userSlice";
import { toast } from "react-toastify";

function ForgotPassword() {
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    otp: "",
    isOtpForm: false,
    loading: false,
    error: ""
  });

  async function requestOTP(e) {
    e.preventDefault();
    setForm({ ...form, loading: true, error: "" });

    const res = await API.login_with_otp(form.email);

    if (!res.success) {
      setForm({ ...form, loading: false, error: res.error });
      return;
    }

    setForm({ ...form, loading: false, isOtpForm: true, hashedOTP:res.data.hashedOTP });
  }

  async function validateOTP(e) {
    e.preventDefault();
    setForm({ ...form, loading: true, error: "" });

    // call verify OTP API here
    const res = await API.verify_otp(form);
    if(res.success){
      console.log(res.data);

      const user = res.data.user_details;
      
      dispatch(
        user_slice_login({
          email: user.email,
          name: user.name,
          user_id: user._id,
          profile_pic: user.profile_pic,
          role: user.role,
          userDetails: user
        })
      );

      localStorage.setItem("token", res.data.token);

      toast.success("Login successful");
      navigate("/");
      return;
    }

    setForm({ ...form, loading: false });
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-sm bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold text-center mb-4">
          {form.isOtpForm ? "Enter OTP" : "Forgot Password"}
        </h2>

        {form.error && (
          <p className="text-red-600 text-sm text-center mb-3">
            {form.error}
          </p>
        )}

        {!form.isOtpForm && (
          <form onSubmit={requestOTP} className="space-y-4">
            <input
              type="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
              required
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button
              disabled={form.loading}
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {form.loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </form>
        )}

        {form.isOtpForm && (
          <form onSubmit={validateOTP} className="space-y-4">
            <input
              type="text"
              inputMode="numeric"
              placeholder="6-digit OTP"
              value={form.otp}
              onChange={(e) =>
                setForm({ ...form, otp: e.target.value })
              }
              required
              className="w-full px-4 py-2 text-center tracking-widest border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />

            <button
              disabled={form.loading}
              className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 disabled:opacity-50"
            >
              {form.loading ? "Verifying..." : "Verify OTP"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default ForgotPassword;
