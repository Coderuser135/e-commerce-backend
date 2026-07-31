import express from "express"
import dotenv from "dotenv"
import authRouter from "./routes/auth.routes.js"
import cors from "cors"
import cookieParser from "cookie-parser"
import productsRouter from "./routes/products.routes.js"
import orderRouter from "./routes/order.routes.js"
import { dbConnect } from "./db/database.connect.js"
dotenv.config()

const app = express()
const PORT = process.env.PORT
app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))
app.use("/api/auth", authRouter)
app.use("/api/products", productsRouter)
app.use("/api/order", orderRouter)
app.listen(PORT, () => {
    dbConnect()
    console.log(`server is started port: ${PORT}`)
})