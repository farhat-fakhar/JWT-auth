import { User } from "../Models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import transporter from "../config/nodeMailer.js";
export const register = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.send({ success: false, message: "missing details" });
  }
  try {
    let existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.send({
        success: false,
        message: "user already registered on this email",
      });
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashPassword });
    await newUser.save();
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "None",
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Welcome to dummy auth webapp",
      text: "you have created auth account successfully",
    };
    await transporter.sendMail(mailOptions);
    res.send({
      success: true,
      message: "User registered successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (error) {
    res.send({
      success: false,
      error: error.message,
      message: "somthing wrong!",
    });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.send({ success: false, message: "details are missing!" });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.send({ success: false, message: "credential not matched! " });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.send({ success: false, message: "password is not correct!" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.send({ success: true });
  } catch (error) {
    res.send({
      success: false,
      error: error.message,
      message: "somthing went wrong",
    });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });
    return res.send({ success: true, message: "Logout successful" });
  } catch (error) {
    return res.status(500).send({ success: false, error: error.message });
  }
};

export const sendVerifyOtp = async (req, res) => {
  const userId = req.user.id;
  try {
    let user = await User.findById(userId);
    if (!user) {
      return res.send({ success: false, message: "user not found" });
    }
    if (user.isAccountVerified) {
      return res.send({ success: false, message: "Account Already Verfied!" });
    }
    const otp = String(Math.floor(100000 + Math.random() * 900000));
    user.verifyOtp = otp;
    user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000;
    await user.save();

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "send verify otp",
      text: `your otp is ${otp}`,
    };
    await transporter.sendMail(mailOptions);
    return res.send({ success: true, message: "otp send successfully" });
  } catch (error) {
    res.send({
      success: false,
      error: error.message,
      message: "internal server error",
    });
  }
};

export const verifyOtp = async (req, res) => {
  const { otp } = req.body;
  const userId = req.user.id;
  try {
    let user = await User.findById(userId);
    if (!user) {
      return res.send({ success: false, message: "user not found!" });
    }
    if (user.isAccountVerified) {
      return res.send({ success: false, message: "account already verified!" });
    }
    if (user.verifyOtp !== otp) {
      return res.send({ success: false, message: "otp does not match!" });
    }
    if (user.verifyOtpExpireAt < Date.now()) {
      return res.send({ success: false, message: "otp is expire" });
    }
    user.isAccountVerified = true;
    user.verifyOtp = null;
    user.verifyOtpExpireAt = null;
    await user.save();
    return res.send({ success: true, message: "account verfied successfully" });
  } catch (error) {
    res.send({ success: false, message: "internal server error!" });
  }
};

export const isAuth = async (req, res) => {
  try {
    return res.send({ success: true, user: req.user });
  } catch (error) {
    res.send({ success: false, error: error.message });
  }
};

export const sendResetOtp = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.send({ success: false, message: "email is required" });
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.send({ success: false, message: "user not found" });
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));
    user.resetOtp = otp;
    user.resetOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000;
    await user.save();
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "send reset password otp",
      text: `your otp is ${otp}`,
    };
    await transporter.sendMail(mailOptions);

    return res.send({ success: true, message: "otp sent to your email" });
  } catch (error) {
    res.send({
      success: false,
      error: error.message,
      message: "internal server error",
    });
  }
};

export const resetPassword = async (req, res) => {
  const { otp, email, newPassword } = req.body;
  if ((!email, !otp, !newPassword)) {
    return res.send({ success: false, message: "details are missing" });
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.send({ success: false, message: "user not found" });
    }

    if (user.resetOtp !== otp) {
      return res.send({ success: false, message: "otp is invalid!" });
    }
    if (user.resetOtpExpireAt < Date.now()) {
      return res.send({ success: false, message: "resent otp is expired" });
    }
    const hashPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashPassword;
    user.resetOtp = "";
    user.resetOtpExpireAt = 0;
    await user.save();
    return res.send({ success: true, message: "password reset successfully!" });
  } catch (error) {
    res.send({ success: false, message: "internal server error" });
  }
};
