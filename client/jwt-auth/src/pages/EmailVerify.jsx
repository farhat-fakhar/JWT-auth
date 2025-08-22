import axios from "axios";
import React, { useContext, useEffect, useRef } from "react";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const EmailVerify = () => {
  const { setIsLoggedIn, userData, backendUrl, getUser } =
    useContext(AppContext);
  const navigate = useNavigate();
  const inputRefs = useRef([]);

  const handleChange = (e, index) => {
    const value = e.target.value.replace(/[^0-9]/g, ""); // only numbers
    e.target.value = value;

    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !e.target.value && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };
  const handleOnSubmit = async (e) => {
    e.preventDefault();
    try {
      const otpArray = inputRefs.current.map((e) => e.value);
      const otp = otpArray.join("");
      const { data } = await axios.post(`${backendUrl}/api/auth/verify-otp`, {
        otp,
      });
      if (data.success) {
        toast.success(data.message);
        getUser();
        navigate("/dashboard");
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleResendOtp = async () => {
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
  useEffect(() => {
    if (userData?.isAccountVerified) {
      setIsLoggedIn(true);
      navigate("/dashboard");
    }
  }, [userData, navigate, setIsLoggedIn]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md w-full text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Verify Your Email
        </h1>
        <p className="text-gray-600 mb-6 text-sm">
          Enter the 6-digit code we sent to your registered email address
        </p>

        <div className="flex justify-center gap-3 mb-6">
          <form onSubmit={handleOnSubmit}>
            {Array(6)
              .fill(0)
              .map((_, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength="1"
                  ref={(el) => (inputRefs.current[index] = el)}
                  onChange={(e) => handleChange(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  className="w-12 me-1 h-12 text-center text-lg font-semibold border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ))}
            <div className="mt-3">
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-xl font-medium hover:bg-blue-700 transition"
              >
                Verify Email
              </button>
            </div>
          </form>
        </div>

        <p className="text-sm text-gray-500 mt-4">
          Didn’t receive the code?
          <button
            onClick={handleResendOtp}
            className="text-blue-600 hover:underline"
          >
            Resend
          </button>
        </p>
      </div>
    </div>
  );
};

export default EmailVerify;
