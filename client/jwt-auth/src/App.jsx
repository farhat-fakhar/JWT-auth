import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import EmailVerify from "./pages/EmailVerify";
import ResetPassword from "./pages/ResetPassword";
import Navbar from "./component/Navbar";
import { ToastContainer } from "react-toastify";
import axios from "axios";
import Hero from "./component/Hero";
import Welcome from "./component/Welcom";
const App = () => {
  axios.defaults.withCredentials = true;

  return (
    <>
      <Router>
        <ToastContainer />
        <Navbar />
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/dashboard" element={<Hero />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard/email-verify" element={<EmailVerify />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Routes>
      </Router>
    </>
  );
};

export default App;
