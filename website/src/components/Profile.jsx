import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { user_slice_logout } from "../redux/slices/userSlice";
import { Mail, Calendar, LogOut, Phone, KeyRound, X } from "lucide-react";
import { API } from "../utils/API";
import { toast } from "react-toastify";
import SectionIndicatorCard from "./SectionIndicator";
import UpdatePhone from "./UpdatePhone";

function Profile()
{
  const user = useSelector(state => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isPasswordUpdateOpen, setIsPasswordUpdateOpen] = useState(false);
  const [isPhoneUpdateOpen, setIsPhoneUpdateOpen] = useState(false);

  const handleLogout = () =>
  {
    dispatch(user_slice_logout());
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <SectionIndicatorCard text={"USER / Profile"} />

      <div className="max-w-4xl mx-auto mt-6">
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">

          <div className="h-32 bg-gradient-to-r from-blue-500 to-indigo-600"></div>

          <div className="px-8 pb-8">
            <div className="flex items-end justify-between -mt-16 mb-6">
              <div className="flex items-end gap-6">
                <img
                  src={user?.profile_pic}
                  alt={user?.name}
                  className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
                />
                <div>
                  <h1 className="text-2xl font-bold">{user?.name}</h1>
                  <span className="inline-block mt-2 px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-700">
                    {user?.role}
                  </span>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-5 py-2.5 rounded-lg"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mt-8">

              {/* Email */}
              <InfoCard icon={<Mail />} label="Email" value={user?.email} />


              {/*Phone */}
              <div className="flex gap-4 p-4 bg-gray-50 rounded-lg items-center">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Phone className="text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-500">Phone</p>
                  <p>{user?.userDetails?.phoneNumber || "Not updated"}</p>
                </div>
                <button
                  onClick={() => setIsPhoneUpdateOpen(true)}
                  className="text-blue-600 text-sm font-medium"
                >
                  Update
                </button>
              </div>

              {/* Account Created */}
              <InfoCard
                icon={<Calendar />}
                label="Account Created"
                value={
                  user?.userDetails?.ac_created_on
                    ? API.TOOLS.formatDate(user.userDetails.ac_created_on)
                    : "N/A"
                }
              />

              {/* Password */}
              <div className="flex gap-4 p-4 bg-gray-50 rounded-lg items-center">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <KeyRound className="text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-500">Password last updated</p>
                  <p className="text-gray-900">
                    {API.TOOLS.formatDate(
                      user?.userDetails?.passwordLastUpdatedOn ||
                      user?.userDetails?.ac_created_on
                    )}
                  </p>
                </div>
                <button
                  onClick={() => setIsPasswordUpdateOpen(true)}
                  className="text-blue-600 text-sm font-medium"
                >
                  Update
                </button>
              </div>


            </div>
          </div>
        </div>
      </div>

      {isPasswordUpdateOpen && (
        <PasswordUpdateForm
          user={user}
          closeForm={() => setIsPasswordUpdateOpen(false)}
        />
      )}

      {
        isPhoneUpdateOpen && <UpdatePhone closeForm={setIsPhoneUpdateOpen} />
      }

    </div>
  );
}

export default Profile;

function InfoCard({ icon, label, value })
{
  return (
    <div className="flex gap-4 p-4 bg-gray-50 rounded-lg">
      <div className="p-3 bg-blue-100 rounded-lg text-blue-600">
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-gray-900 mt-1">{value}</p>
      </div>
    </div>
  );
}


function PasswordUpdateForm({ user, closeForm })
{
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function updatePassword(e)
  {
    e.preventDefault();

    if (password.length < 8)
    {
      toast.error("Password must be at least 8 characters");
      return;
    }

    try
    {
      setLoading(true);
      const response = await API.USER.update_password({
        email: user.email,
        new_password:password
      });

      if (response.success)
      {
        toast.success("Password updated successfully");
        closeForm();
      }
      else
      {
        toast.error(response.error);
      }
    }
    finally
    {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <form
        onSubmit={updatePassword}
        className="bg-white p-6 rounded-lg w-full max-w-sm relative"
      >
        <button
          type="button"
          onClick={closeForm}
          className="absolute top-3 right-3 text-gray-500"
        >
          <X />
        </button>

        <h2 className="text-lg font-semibold mb-4">Update Password</h2>

        <input
          type="password"
          placeholder="New password"
          className="w-full border px-3 py-2 rounded-md mb-4"
          onChange={e => setPassword(e.target.value)}
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-md"
        >
          {loading ? "Updating..." : "Update Password"}
        </button>
      </form>
    </div>
  );
}

