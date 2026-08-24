import express from "express"
import { isAuthenticated } from "../middlewares/auth.middleware.js"
import { addToCardController, addToCardDecreaseQuentityController, addToCardIncreaseQuentityController, deleteAddToCardController, getAddToCardController } from "../controllers/addToCard.controller.js"

const router = express.Router()
router.post("/:id", isAuthenticated, addToCardController)
router.get("/", isAuthenticated, getAddToCardController)
router.delete("/:id", isAuthenticated, deleteAddToCardController)
router.post("/increase-quentity/:id", isAuthenticated, addToCardIncreaseQuentityController)
router.post("/decrease-quentity/:id", isAuthenticated, addToCardDecreaseQuentityController)
export default router