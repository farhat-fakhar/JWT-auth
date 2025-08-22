import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
import connectDB from "./config/mongodb.js";
import userRouter from "./routes/userRoute.js";
import authRouter from "./routes/authRoutes.js";

const app = express();
const allowOrigin = [
  "http://localhost:5173",
  "https://jwt-auth-frontend-five.vercel.app",
];
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: allowOrigin,
    credentials: true,
  })
);
app.use(express.urlencoded({ extended: true }));
const port = process.env.PORT || 4000;

app.get("/", (req, res) => {
  res.send("API active!");
});

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

(async () => {
  try {
    await connectDB();
    app.listen(port, () => {
      console.log(`✅ Server started at port ${port}`);
    });
  } catch (error) {
    console.log("❌ Server not connected! ", error);
  }
})();
