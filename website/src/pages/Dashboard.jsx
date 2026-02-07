import React, { useEffect, useRef } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { API } from "../utils/API";

function Dashboard() {
    const navigate = useNavigate();

    async function verifyAuthorization()
    {
        const token = localStorage.getItem("token");

        if (!token)
        {
            navigate("/login");
            return;
        }

        const response = await API.refresh_token();

        if (!response.success)
        {
            localStorage.clear();
            navigate("/login");
            return;
        }

        localStorage.setItem("token", response.data.token);
        // dispatch( user_slice_login(response.data.userDetails ) )
    }

    useEffect(()=>{
        verifyAuthorization();
    },[])


    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar />
            <main className="flex-1 overflow-y-auto">
                <Outlet />
            </main>
        </div>
    );
}

export default Dashboard;
