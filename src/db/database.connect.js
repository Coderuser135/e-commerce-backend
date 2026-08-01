import mongoose from "mongoose";

const connectDB = async () => {
  // Agar Mongoose pehle se connected hai, toh dobara connect mat karo
  if (mongoose.connection.readyState >= 1) {
    return;
  }
  try {
    await mongoose.connect(process.env.MONGO_DB, {
      serverSelectionTimeoutMS: 5000, // 5 sec me quick timeout
    });
    console.log("MongoDB Atlas Connected Successfully!");
  } catch (error) {
    console.error("MongoDB Connection Failed:", error.message);
    throw error;
  }
};

export default connectDB;