import React, { useContext, useState } from "react";
import { Mail, Lock, User } from "lucide-react"; // lightweight icons
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
const AuthForm = () => {
  const [mode, setMode] = useState("Login");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const { backendUrl, setIsLoggedIn, getUser } = useContext(AppContext);

  const navigate = useNavigate();
  const handleOnSubmit = async (e) => {
    e.preventDefault();
    try {
      // handle sign up form
      if (mode === "Sign Up") {
        let res = await axios.post(`${backendUrl}/api/auth/register`, formData);
        if (res.data.success) {
          toast.success("User Registered Successfully!");
          setIsLoggedIn(true);
          getUser();

          navigate("/dashboard");
        } else {
          console.log(res.data.message);
        }
      } else {
        //  handle login form
        const { email, password } = formData;
        const { data } = await axios.post(`${backendUrl}/api/auth/login`, {
          email,
          password,
        });
        if (data.success) {
          setIsLoggedIn(true);
          getUser();

          toast.success("Your are log in successfully");
          navigate("/dashboard");
        } else {
          console.log(data.message);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            {mode === "Sign Up" ? "Create your account" : "Welcome back"}
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            {mode === "Sign Up"
              ? "Fill in your details to get started."
              : "Login to continue to your workspace."}
          </p>
        </div>

        {/* Form */}
        <form className="mt-8 space-y-5" onSubmit={handleOnSubmit}>
          {mode === "Sign Up" && (
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 w-5 h-5" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleOnChange}
                placeholder="Enter Full Name"
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none"
              />
            </div>
          )}
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 w-5 h-5" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleOnChange}
              placeholder="Enter Email Address"
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none"
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 w-5 h-5" />
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleOnChange}
              placeholder="Enter Password"
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          {mode === "Login" && (
            <div className="flex justify-end">
              <button
                onClick={() => navigate("/reset-password")}
                type="button"
                className="text-sm font-medium text-indigo-600 hover:underline"
              >
                Forgot password?
              </button>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full cursor-pointer py-2.5 bg-indigo-900 text-white font-medium rounded-lg hover:bg-indigo-700 transition duration-300 shadow-md"
          >
            {mode}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-grow h-px bg-gray-200"></div>
          <span className="px-3 text-sm text-gray-400">or</span>
          <div className="flex-grow h-px bg-gray-200"></div>
        </div>

        {/* Footer Toggle */}
        <p className="mt-6 text-center text-sm text-gray-600">
          {mode === "Sign Up"
            ? "Already have an account?"
            : "Don’t have an account?"}{" "}
          <span
            onClick={() => setMode(mode === "Sign Up" ? "Login" : "Sign Up")}
            className="text-indigo-600 font-medium cursor-pointer hover:underline"
          >
            {mode === "Sign Up" ? "Log in here" : "Sign up here"}
          </span>
        </p>
      </div>
    </div>
  );
};

export default AuthForm;
