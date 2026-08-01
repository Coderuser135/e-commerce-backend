import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB);
    console.log("MongoDB Atlas Connected Successfully!");
  } catch (error) {
    console.log(`MongoDB url: ${process.env.MONGO_DB}`)
    console.error("MongoDB Connection Failed:", "MongoDB:", process.env.MONGO_DB, error.message);
    throw error;
  }
};

export default connectDB;