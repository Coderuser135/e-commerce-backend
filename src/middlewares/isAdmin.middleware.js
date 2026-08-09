import User from "../models/auth.model.js"

export const isAdmin = async (req, res, next) => {
    try {
        const userId = req.userId
        const findUser = await User.findById(userId)
        if(!findUser){
            return res.status(404).json({
                message: "This user not found"
            })
        }
        if(findUser.role !== "admin"){
            return res.status(403).json({
                message: "This data access only admin"
            })
        }
        next()
    } catch (error) {
        console.log(`isAdmin meddleware controller error: ${error.message}`)
        return res.status(500).json({
            message: "Internal Server Error"
        })
    }
}