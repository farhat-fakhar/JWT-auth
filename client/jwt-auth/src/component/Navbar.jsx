import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const Navbar = () => {
  const navigate = useNavigate();
  const { isLoggedIn, setIsLoggedIn, userData, setUserData, backendUrl } =
    useContext(AppContext);

  const sendVerificationOtp = async () => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/auth/send-verify-otp`
      );
      if (data.success) {
        navigate("/dashboard/email-verify");
        toast.success(data.message);
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  const handleLogout = async () => {
    try {
      let { data } = await axios.post(`${backendUrl}/api/auth/logout`);
      if (data.success) {
        setIsLoggedIn(false);
        setUserData({});
        navigate("/");
        toast.success("logOut successfully");
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <nav className="border-b border-gray-200 bg-white shadow-sm sticky top-0">
      <div className="container mx-auto flex justify-between items-center py-3">
        {/* Logo */}
        <div
          onClick={() => navigate("/")}
          className="flex items-center space-x-2 cursor-pointer"
        >
          <img
            src="/assets/images.jpeg"
            alt="Logo"
            className="h-10 w-10 object-cover rounded-full"
          />
          <span className="text-xl font-semibold text-gray-800">JWT-Auth</span>
        </div>

        {/* Right Side */}
        <div className="flex items-center space-x-4">
          {!isLoggedIn ? (
            <>
              <button
                onClick={() => navigate("/login")}
                className="px-5 py-2 cursor-pointer bg-blue-900 text-white font-medium rounded-lg hover:bg-blue-700 transition duration-300 shadow-md"
              >
                Login
              </button>
            </>
          ) : (
            <div className="flex items-center space-x-4">
              {/* Avatar Circle with Initial */}
              <div className="bg-blue-900 text-white w-10 h-10 flex items-center justify-center rounded-full font-bold uppercase shadow-md">
                {userData?.name ? userData.name[0].toUpperCase() : "U"}
              </div>

              {/* Verify Email Button */}
              {!userData.isAccountVerfied ? (
                <button
                  onClick={sendVerificationOtp}
                  className="px-3 cursor-pointer py-1 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-300"
                >
                  Verify Email
                </button>
              ) : (
                <></>
              )}

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="px-3 cursor-pointer py-1 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-300"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
