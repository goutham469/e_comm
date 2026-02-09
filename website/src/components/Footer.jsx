import React from "react";
import { Link } from "react-router-dom";

function Footer() {
    return (
        <footer className="bg-gray-900 text-gray-300 mt-10">
            <div className="max-w-7xl mx-auto px-6 py-10">

                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

                    {/* 1️⃣ Contact Details */}
                    <div>
                        <h3 className="text-white font-semibold text-lg mb-3">
                            Contact Us
                        </h3>
                        <p className="text-sm">
                            Goutham Stores<br />
                            Madhapuram, Khammam, Telangana<br />
                            India
                        </p>

                        <p className="mt-3 text-sm">
                            📞 +91 9398141936
                        </p>
                        <p className="text-sm">
                            ✉️ gouthamreddy9398@gmail.com
                        </p>
                    </div>

                    {/* 2️⃣ Quick Links */}
                    <div>
                        <h3 className="text-white font-semibold text-lg mb-3">
                            Quick Links
                        </h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link to="/" className="hover:text-white">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link to="/contact-us" className="hover:text-white">
                                    Contact Us
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* 3️⃣ Policies */}
                    <div>
                        <h3 className="text-white font-semibold text-lg mb-3">
                            Policies
                        </h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link
                                    to="/terms-and-conditions"
                                    className="hover:text-white"
                                >
                                    Terms & Conditions
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/refund-and-cancellation"
                                    className="hover:text-white"
                                >
                                    Refund & Cancellation
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/contact-us"
                                    className="hover:text-white"
                                >
                                    Contact
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* 4️⃣ About */}
                    <div>
                        <h3 className="text-white font-semibold text-lg mb-3">
                            About
                        </h3>
                        <p className="text-sm">
                            Goutham Stores is an independent online store
                            providing quality products at affordable prices.
                        </p>
                    </div>

                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-700 mt-8 pt-4 text-center text-sm">
                    © {new Date().getFullYear()} Goutham Stores. All rights reserved.
                </div>
            </div>
        </footer>
    );
}

export default Footer;
