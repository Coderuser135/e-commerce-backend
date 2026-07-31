import express from "express"
import { createProductsController, deleteProductsController, getAllProductsController, getSingleProductsController, updateProductsController } from "../controllers/products.controller.js"
import { isAuthenticated } from "../middlewares/auth.middleware.js"
import upload from "../middlewares/multer.middleware.js"

const router = express.Router()
router.get("/", isAuthenticated, getAllProductsController)
router.get("/:id", isAuthenticated, getSingleProductsController)
router.post("/", isAuthenticated, upload.single("image"), createProductsController)
router.put("/:id", isAuthenticated, updateProductsController)
router.delete("/:id", isAuthenticated, deleteProductsController)

export default router