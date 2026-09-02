import express from "express";
import { isAuthenticated } from "../middlewares/auth.middleware.js";
import {
  createPaymentOrderController,
  deleteOrderController,
  getAllOrderController,
  getSingleOrderController,
  paymentVerifyController,
  updateOrderStatusController,
} from "../controllers/order.controller.js";
import { isAdmin } from "../middlewares/isAdmin.middleware.js";
import { calculateProductsItemAmount } from "../middlewares/productsItemAmountCalculate.middleware.js";
const router = express.Router();
router.get("/", isAuthenticated, isAdmin, getAllOrderController);
router.post("/payment/createOrder", isAuthenticated, calculateProductsItemAmount, createPaymentOrderController)
router.post("/payment/verify", isAuthenticated, calculateProductsItemAmount, paymentVerifyController)
router.get("/myOrder", isAuthenticated, getSingleOrderController)
router.put("/:id/status", isAuthenticated, isAdmin, updateOrderStatusController);
router.delete("/:id", isAuthenticated, isAdmin, deleteOrderController);

export default router;
