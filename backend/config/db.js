import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const DB_NAME="gdghackathon";
const connectDB = async () => {
  try {
    console.log("ENV CHECK:", process.env.MONGODB_URL ? "LOADED" : "NOT LOADED");

    const conn = await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    process.exit(1); // stop app if DB fails
  }
};

export default connectDB;

//dotenv.config({ path: "../.env" });
