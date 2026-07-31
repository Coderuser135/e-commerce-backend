import mongoose, { Schema } from "mongoose";

const otpSchema = new mongoose.Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    otp: {
        type: String,
        default: null
    },
    otpExp: {
        type: String,
        default: null
    }
})

const OTP = mongoose.model("Otp", otpSchema)
export default OTP