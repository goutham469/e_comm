import React from "react";

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
                            Uppinuri Stores<br />
                            Village Road, Telangana<br />
                            India
                        </p>

                        <p className="mt-3 text-sm">
                            📞 +91 98765 43210
                        </p>
                        <p className="text-sm">
                            ✉️ support@uppinuristores.com
                        </p>
                    </div>

                    {/* 2️⃣ Quick Links */}
                    <div>
                        <h3 className="text-white font-semibold text-lg mb-3">
                            Quick Links
                        </h3>
                        <ul className="space-y-2 text-sm">
                            <li className="hover:text-white cursor-pointer">
                                Home
                            </li>
                            <li className="hover:text-white cursor-pointer">
                                Categories
                            </li>
                            <li className="hover:text-white cursor-pointer">
                                Orders
                            </li>
                            <li className="hover:text-white cursor-pointer">
                                Contact
                            </li>
                        </ul>
                    </div>

                    {/* 3️⃣ Policies */}
                    <div>
                        <h3 className="text-white font-semibold text-lg mb-3">
                            Policies
                        </h3>
                        <ul className="space-y-2 text-sm">
                            <li className="hover:text-white cursor-pointer">
                                Privacy Policy
                            </li>
                            <li className="hover:text-white cursor-pointer">
                                Terms & Conditions
                            </li>
                            <li className="hover:text-white cursor-pointer">
                                Refund Policy
                            </li>
                        </ul>
                    </div>

                    {/* 4️⃣ About / Newsletter */}
                    <div>
                        <h3 className="text-white font-semibold text-lg mb-3">
                            About
                        </h3>
                        <p className="text-sm mb-4">
                            We provide quality products directly from trusted
                            sellers at affordable prices.
                        </p>

                        <input
                            type="email"
                            placeholder="Your email"
                            className="w-full p-2 rounded bg-gray-800 border border-gray-700 text-sm focus:outline-none"
                        />
                        <button className="mt-2 w-full bg-cyan-600 hover:bg-cyan-700 text-white p-2 rounded text-sm">
                            Subscribe
                        </button>
                    </div>

                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-700 mt-8 pt-4 text-center text-sm">
                    © {new Date().getFullYear()} Uppinuri Stores. All rights reserved.
                </div>
            </div>
        </footer>
    );
}

export default Footer;
