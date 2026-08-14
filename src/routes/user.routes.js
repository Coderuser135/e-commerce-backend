import express from "express"
import { isAuthenticated } from "../middlewares/auth.middleware.js"
import upload from "../middlewares/multer.middleware.js"
import { updatePasswordController, updateUserInfoController } from "../controllers/user.controller.js"

const router = express.Router()

router.post("/update-info/:email", isAuthenticated, upload.single("userImage"),  updateUserInfoController)
router.post("/update-password/:email", isAuthenticated, updatePasswordController)

export default router