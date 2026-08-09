import mongoose from "mongoose"

const userSehema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    refreshToken: {
        type: String,
        default: null
    },
    otp: {
        type: Number,
        default: null
    },
    otpExp: {
        type: String,
        default: null
    },
    isVerify: {
        type: Boolean,
        default: false
    },
    isLogin: {
        type: Boolean,
        default: false
    },
    isChangePassword: {
        type: Boolean,
        default: false
    },
    role: {
        type: String,
        default: "user"
    }
}, {
    timestamps: true
})
const User = mongoose.model("User", userSehema)
export default User