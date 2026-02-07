import React, { useEffect, useState } from "react";
import { ShoppingCart, User, Search, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { API } from "../utils/API";
import SearchBar from "./SearchBar";
import { useDispatch, useSelector } from "react-redux";
import { cart_slice_toggle } from "../redux/slices/cartSlice";

function Header() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const count = useSelector(state => state.cart?.cartItems?.length);

    return (
        <header className="w-full bg-white shadow-md sticky top-0 z-50">
            {/* Flash Text Banner */}
            {/* <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-200">
                <div className="max-w-7xl mx-auto px-4 py-2">
                    <FlashText />
                </div>
            </div> */}

            {/* Main Header */}
            <div className="max-w-7xl mx-auto p-1">
                {/* Desktop Layout */}
                <div className="hidden md:flex items-center justify-between gap-6">
                    {/* Logo */}
                    <div 
                        className="flex items-center gap-2 cursor-pointer flex-shrink-0 hover:opacity-80 transition-opacity"
                        onClick={() => window.location.href = "/"}
                    >
                        <img
                            src="/logo.png"
                            alt="Logo"
                            className="h-10 w-10"
                        />
                        <div className="flex items-baseline">
                            <span className="text-3xl font-bold text-yellow-500">AMAZON</span>
                            <span className="text-3xl font-bold text-red-500">.in</span>
                        </div>
                    </div>

                    {/* Search Bar */}
                    <div className="flex-1 max-w-2xl">
                        <SearchBar />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-3">
                        {/* Cart Button */}
                        <button 
                            className="relative flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer group"
                            onClick={() => dispatch(cart_slice_toggle())}
                        >
                            <div className="relative">
                                <ShoppingCart size={24} className="text-gray-700 group-hover:text-green-600 transition-colors" />
                                {count > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-green-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-md">
                                        {count > 9 ? '9+' : count}
                                    </span>
                                )}
                            </div>
                            <span className="text-sm font-medium text-gray-700 group-hover:text-green-600 transition-colors">
                                Cart
                            </span>
                        </button>

                        {/* Profile Button */}
                        <button 
                            className="flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer group"
                            onClick={(e) => {
                                e.preventDefault();
                                navigate("/dashboard");
                            }}
                        >
                            <User size={24} className="text-gray-700 group-hover:text-blue-600 transition-colors" />
                            <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors">
                                Account
                            </span>
                        </button>
                    </div>
                </div>

                {/* Mobile Layout */}
                <div className="flex md:hidden flex-col gap-3">
                    {/* Top Row: Logo + Icons */}
                    <div className="flex items-center justify-between">
                        {/* Logo */}
                        <div 
                            className="flex items-center gap-2 cursor-pointer"
                            onClick={() => window.location.href = "/"}
                        >
                            <img
                                src="/logo.png"
                                alt="Logo"
                                className="h-8 w-8"
                            />
                            <div className="flex items-baseline">
                                <span className="text-xl font-bold text-yellow-500">AMAZON</span>
                                <span className="text-xl font-bold text-red-500">.in</span>
                            </div>
                        </div>

                        {/* Mobile Action Icons */}
                        <div className="flex items-center gap-2">
                            {/* Cart Button */}
                            <button 
                                className="relative p-2 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
                                onClick={() => dispatch(cart_slice_toggle())}
                            >
                                <ShoppingCart size={22} className="text-gray-700" />
                                {count > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-green-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-md">
                                        {count > 9 ? '9+' : count}
                                    </span>
                                )}
                            </button>

                            {/* Profile Button */}
                            <button 
                                className="p-2 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
                                onClick={(e) => {
                                    e.preventDefault();
                                    navigate("/dashboard");
                                }}
                            >
                                <User size={22} className="text-gray-700" />
                            </button>
                        </div>
                    </div>

                    {/* Bottom Row: Search Bar */}
                    <div className="w-full">
                        <SearchBar />
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header;

/* ================= Flash Text ================= */

function FlashText() {
    const [text, setText] = useState("");

    async function getData() {
        try {
            const response = await API.website_data();
            if (response.success) {
                setText(response.data.websiteData.flash_title.text);
            }
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        getData();
    }, []);

    if (!text) return null;

    return (
        <div className="flex items-center justify-center">
            <div className="flex items-center gap-2 text-sm font-medium text-amber-900">
                <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                </span>
                <span className="animate-pulse">{text}</span>
            </div>
        </div>
    );
}