import React, { useState } from "react";
import { useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import {
    FiUser,
    FiShoppingCart,
    FiPackage,
    FiStar,
    FiCreditCard,
    FiMapPin,
    FiActivity,
    FiGrid,
    FiSettings,
    FiUsers,
    FiLayers,
    FiBox,
    FiAlertCircle,
    FiMenu,
    FiHome,
    FiChevronLeft
} from "react-icons/fi";
import { FaMobileAlt } from "react-icons/fa";

const userRoles = [
    { text: "Profile", ref: "", icon: <FiUser /> },
    { text: "Cart", ref: "cart", icon: <FiShoppingCart /> },
    { text: "My Purchases", ref: "purchases", icon: <FiPackage /> },
    { text: "Reviews", ref: "reviews", icon: <FiStar /> },
    { text: "Payments", ref: "payments", icon: <FiCreditCard /> },
    { text: "Saved Locations", ref: "saved-locations", icon: <FiMapPin /> },
    { text: "My Activity", ref: "activity", icon: <FiActivity /> }
];

const adminRoles = [
    { text: "Overview", ref: "overview", icon: <FiGrid /> },
    { text: "Settings", ref: "settings", icon: <FiSettings /> },
    { text: "Users", ref: "users", icon: <FiUsers /> },
    { text: "Categories", ref: "categories", icon: <FiLayers /> },
    { text: "Sub Categories", ref: "sub-categories", icon: <FiLayers /> },
    { text: "Products", ref: "products", icon: <FiBox /> },
    { text: "Payments", ref: "payments-glance", icon: <FiCreditCard /> },
    { text: "Mobile Messages", ref: "mobile-messages", icon: <FaMobileAlt /> },
    { text: "User Complaints", ref: "user-complaints", icon: <FiAlertCircle /> }
];

function Sidebar() {
    const user = useSelector(state => state.user);
    const navigate = useNavigate();
    const [collapsed, setCollapsed] = useState(false);

    const renderLinks = (roles) =>
        roles.map(role => (
            <NavLink
                key={role.ref}
                to={`./${role.ref}`}
                className={({ isActive }) =>
                    `group flex items-center gap-3 px-4 py-1 rounded-lg text-sm font-medium transition-all
                    ${
                        isActive
                            ? "bg-cyan-50 text-cyan-700 border-l-4 border-cyan-600"
                            : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    }`
                }
            >
                <span className="text-lg">
                    {role.icon}
                </span>
                {!collapsed && role.text}
            </NavLink>
        ));

    return (
        <aside
            className={`${
                collapsed ? "w-16" : "w-48"
            } bg-white border-r min-h-screen p-2 transition-all duration-300`}
        >
            {/* Top Section */}
            <div className="flex items-center justify-between mb-2 px-2">
                {!collapsed && (
                    <div
                        onClick={() => navigate("/")}
                        className="flex items-center gap-2 cursor-pointer text-gray-700 hover:text-cyan-600"
                    >
                        <FiHome />
                        <span className="text-sm font-semibold">Home</span>
                    </div>
                )}

                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="p-1 rounded hover:bg-gray-100 text-gray-600"
                >
                    {collapsed ? <FiMenu /> : <FiChevronLeft />}
                </button>
            </div>

            {/* Brand */}
            {!collapsed && (
                <div className="mb-6 text-center">
                    <h2 className="text-lg font-semibold text-gray-800">
                        { user?.name ? user.name : 'Dashboard' }
                    </h2>
                    <p className="text-xs text-gray-400">
                        Welcome back 👋
                    </p>
                </div>
            )}

            {/* User Section */}
            <div className="mb-6">
                {!collapsed && (
                    <p className="px-4 mb-2 text-xs font-semibold uppercase text-gray-400">
                        User
                    </p>
                )}
                <div className="space-y-1">
                    {renderLinks(userRoles)}
                </div>
            </div>

            {/* Admin Section */}
            {user?.role === "ADMIN" && (
                <div>
                    {!collapsed && (
                        <p className="px-4 mb-2 text-xs font-semibold uppercase text-red-400">
                            Admin
                        </p>
                    )}
                    <div className="space-y-1">
                        {renderLinks(adminRoles)}
                    </div>
                </div>
            )}
        </aside>
    );
}

export default Sidebar;
