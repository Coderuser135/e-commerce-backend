import express from "express"

const router = express.Router()

router.get("/:email", getEmailUserController)

export default router