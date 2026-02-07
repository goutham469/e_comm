import { useState } from "react";
import { toast } from "react-toastify";
import { API } from "../utils/API";
import { useDispatch } from "react-redux";
import { user_slice_login } from "../redux/slices/userSlice";
import { Link, useNavigate } from "react-router-dom";

export default function ManualLogin()
{
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [data, setData] = useState({
    email: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);

  async function handleLogin(e)
  {
    e.preventDefault();

    if (!data.email || !data.password)
    {
      toast.error("Please fill out all fields");
      return;
    }

    try
    {
      setLoading(true);

      const response = await API.login_with_email(data);

      if (response.success)
      {
        const user = response.data.user_details;

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

        localStorage.setItem("token", response.data.token);

        toast.success("Login successful");
        navigate("/");
        return;
      }

      // ❌ Login failed handling
      if (response.code === "INVALID_CREDENTIALS")
      {
        if (typeof response.data?.attemptsLeft === "number")
        {
          toast.error(
            `Invalid credentials. ${response.data.attemptsLeft} attempts left`
          );
        }
        else
        {
          toast.error("Invalid credentials");
        }
        return;
      }

      if (response.code === "ACCOUNT_BLOCKED")
      {
        toast.error("Your account has been blocked. Contact support.");
        return;
      }

      toast.error(response.error || "Login failed");

    }
    catch (err)
    {
      toast.error("Server error. Please try again later.");
    }
    finally
    {
      setLoading(false);
    }
  }

  return (
   <form
  onSubmit={handleLogin}
  className="flex flex-col gap-4"
>
  <input
    type="email"
    required
    placeholder="Email"
    value={data.email}
    onChange={e =>
      setData(prev => ({ ...prev, email: e.target.value }))
    }
    className="
      w-full
      px-4 py-2
      rounded-md
      bg-stone-100
      text-gray-900
      placeholder-gray-500
      border border-stone-300
      focus:outline-none
      focus:ring-2
      focus:ring-blue-500
      focus:border-blue-500
      transition
    "
  />

  <input
    type="password"
    required
    placeholder="Password"
    value={data.password}
    onChange={e =>
      setData(prev => ({ ...prev, password: e.target.value }))
    }
    className="
      w-full
      px-4 py-2
      rounded-md
      bg-stone-100
      text-gray-900
      placeholder-gray-500
      border border-stone-300
      focus:outline-none
      focus:ring-2
      focus:ring-blue-500
      focus:border-blue-500
      transition
    "
  />

  <button
    type="submit"
    disabled={loading}
    className="
      w-full
      py-2
      rounded-md
      bg-blue-600
      text-white
      font-semibold
      hover:bg-blue-700
      focus:outline-none
      focus:ring-2
      focus:ring-blue-500
      focus:ring-offset-2
      disabled:bg-blue-400
      disabled:cursor-not-allowed
      transition
    "
  >
    {loading ? "Logging in..." : "Login"}
  </button>

  <Link
    to="/forgot-password"
    className="
      block
      text-center
      text-sm
      text-blue-600
      hover:text-blue-700
      hover:underline
      transition
    "
  >
    Forgot password?
  </Link>

</form>

  );
}
