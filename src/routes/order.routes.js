import express from "express";
import { isAuthenticated } from "../middlewares/auth.middleware.js";
import {
  createOrderController,
  deleteOrderController,
  getAllOrderController,
  getSingleOrderController,
  updateOrderStatusController,
} from "../controllers/order.controller.js";
import { getUserDataController } from "../controllers/auth.controller.js";
import { isAdmin } from "../middlewares/isAdmin.middleware.js";
const router = express.Router();
router.get("/", isAuthenticated, isAdmin, getAllOrderController);
router.get("/myOrder", isAuthenticated, getSingleOrderController);
router.post("/", isAuthenticated, createOrderController);
router.put("/:id/status", isAuthenticated, isAdmin, updateOrderStatusController);
router.delete("/:id", isAuthenticated, isAdmin, deleteOrderController);

export default router;
