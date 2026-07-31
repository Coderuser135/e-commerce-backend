import express from "express"
import { isAuthenticated } from "../middlewares/auth.middleware.js"
import { createOrderController, deleteOrderController, getAllOrderController, getSingleOrderController, updateOrderStatusController } from "../controllers/order.controller.js"
import { getUserDataController } from "../controllers/auth.controller.js"
const router = express.Router()
router.get("/", isAuthenticated, getAllOrderController)
router.get("/myOrder", isAuthenticated, getSingleOrderController)
router.post("/", isAuthenticated, createOrderController)
router.put("/:id/status", isAuthenticated, updateOrderStatusController)
router.delete("/:id", isAuthenticated, deleteOrderController)

export default router