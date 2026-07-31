import express from "express"
import { emailOtpController, emailVerifyController, getDataController, getRefreshTokenController, getUserDataController, loginController, logoutController, registerController, resetPasswrodController, userDataController, verifyOtpController } from "../controllers/auth.controller.js"
import { isAuthenticated, isRefreshToken } from "../middlewares/auth.middleware.js"

const router = express.Router()
router.post("/register", registerController)

// isLogin Authentication controller
router.post("/email-verify/:email", emailVerifyController)
router.post("/login", loginController)
router.get("/logout", isRefreshToken, logoutController)
router.post("/email-otp", emailOtpController)

// isChangePassword controller
router.post("/verify-otp/:email", isAuthenticated, verifyOtpController)
router.post("/reset-password/:email", isAuthenticated, resetPasswrodController)
router.get("/refresh-token", isRefreshToken, getRefreshTokenController)
router.get("/user", isAuthenticated, userDataController)
router.get("/", getDataController)
export default router