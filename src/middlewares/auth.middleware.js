import jwt from "jsonwebtoken";
import User from "../models/auth.model.js";

export const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.headers.authorization || req.headers.Authorization;
    if (!token || !token.startsWith(`Bearer `)) {
      return res.status(401).json({
        message: "Token is not porvided or start with Bearer",
      });
    }
    const authToken = token.split(" ")[1];
    const verifyToken = jwt.verify(
      authToken,
      process.env.ASSES_TOKEN_SECRET,
      async (error, decoded) => {
        if (error) {
          if (error.name === "TokenExpiredError") {
            return res.status(401).json({
              message:
                "Your token is expire plese provided now token generated",
            });
          }
          return res.status(401).json({
            message: "Asses token missing or invalid",
          });
        }
        const findUser = await User.findById(decoded.id)
        if(!findUser){
            return res.status(404).json({
                message: "This user is not find plees check your token"
            })
        }
        if(authToken === findUser.token){
            return res.status(400).json({
                message: "Plese check your token"
            })
        }
        req.userId = decoded.id;
      },
    );
    next();
  } catch (error) {
    console.log(`isAuthecticated middleware error: ${error.message}`)
    return res.status(500).json({
        message: "Internal Server Error"
    })
  }
};

export const isRefreshToken = async (req, res, next) => {
    try {
        const refreshToken = req.cookies.refreshToken
        if(!refreshToken){
            return res.status(401).json({
                message: "Unauthorized: Refresh token is missing"
            })
        }
        const verifyToken =  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
        req.userId = verifyToken.id
        next()
    } catch (error) {
        return res.status(401).json({
            message: "Unauthorized: Invalid or expire refresh token",
            error: error.message
        })
    }
}
