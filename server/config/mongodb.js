import mongoose from "mongoose";

const connectDB = async () => {
  try {
    mongoose.connection.on("connected", () => {
      console.log("mongodb connected successfully!");
    });
    mongoose.connection.on("error", (error) => {
      console.log("mongodb connection error", error);
    });
    await mongoose.connect(process.env.MONGODB_URL);
  } catch (error) {
    console.log("mongodb connection failed! ", error.message);
  }
};
export default connectDB;
