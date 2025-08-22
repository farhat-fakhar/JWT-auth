import React, { useContext, useState } from "react";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const [step, setStep] = useState(1); // 0=button, 1=email, 2=otp, 3=newPassword
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
 
  const {backendUrl}=useContext(AppContext)
  const navigate = useNavigate();
  // Step 1: Send OTP
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
     try {
      const res = await axios.post(`${backendUrl}/api/auth/send-reset-otp`, { email });
      if (res.data.success) {
        setStep(2);
      }
     } catch (err) {
      console.log("Something went wrong!", err.message);
    }
    setLoading(false);
  };

  // Step 2: Verify OTP
  const handleResetPasword = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Optional verify route
      const res = await axios.post(`${backendUrl}/api/auth/reset-password`, { email, otp, newPassword });
      if (res.data.success) {
        navigate("/login")
        setStep(3);
      }
      console.log(res.data.message);
    } catch (err) {
      console.log("Something went wrong!");
    }
    setLoading(false);
  };
 

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white shadow-md rounded-2xl p-6">
    
        {/* Step 1 - Email Form */}
        {step === 1 && (
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
              Send OTP to Email
            </h2>
            <input
              type="email"
              className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </form>
        )}

        {/* Step 2 - OTP Form */}
        {step === 2 && (
          <form onSubmit={handleResetPasword} className="space-y-4">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
              Enter Email
            </h2>
            <input
              type="email"
              className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
              Enter OTP
            </h2>
            <input
              type="text"
              className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
              Enter New Password
            </h2>
            <input
              type="password"
              className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
         
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white py-2 rounded-xl hover:bg-green-700 transition disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </form>
        )}
 
      </div>
    </div>
  );
};

export default ResetPassword;
