import React, { useEffect } from 'react';
import GoogleAuth from '../components/GoogleAuth';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ManualLogin from '../components/ManualLogin';

function Login()
{
  const navigate = useNavigate();
  const user = useSelector(state => state.user);

  useEffect(() =>
  {
    if (user.user_id)
    {
      navigate("/", { replace: true });
    }
  }, [user.user_id, navigate]);

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="bg-stone-50 p-6 rounded-md w-full max-w-sm shadow-md">

        <h2 className="text-xl font-semibold mb-4 text-center">
          Login
        </h2>

        <ManualLogin />

        
        <div className="flex items-center my-4">
          <div className="flex-grow h-px bg-gray-300"></div>
          <span className="px-3 text-gray-500 text-sm">OR</span>
          <div className="flex-grow h-px bg-gray-300"></div>
        </div>

        <GoogleAuth />
      </div>
    </div>
  );
}

export default Login;
