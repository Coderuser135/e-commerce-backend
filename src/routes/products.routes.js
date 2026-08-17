import express from "express"
import { createProductsController, deleteProductsController, getAllProductsController, getSingleProductsController, updateProductsController } from "../controllers/products.controller.js"
import { isAuthenticated } from "../middlewares/auth.middleware.js"
import upload from "../middlewares/multer.middleware.js"
import { isAdmin } from "../middlewares/isAdmin.middleware.js"

const router = express.Router()
router.get("/", isAuthenticated, getAllProductsController)
router.get("/:id", isAuthenticated, getSingleProductsController)
router.post("/", isAuthenticated, isAdmin, upload.single("image"), createProductsController)
router.put("/:id", isAuthenticated, isAdmin, upload.single("image"), updateProductsController)
router.delete("/:id", isAuthenticated, isAdmin, deleteProductsController)

export default router