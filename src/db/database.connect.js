import mongoose from "mongoose";

export const dbConnect = async () => {
    try {
       await mongoose.connect(`${process.env.MONGO_DB}/E-Commerce-Store`)
        console.log("MongoDB Connected")
    } catch (error) {
        console.log(`mongodb error: ${error.message}`)
    }
}