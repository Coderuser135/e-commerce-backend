import cloudinary from "../configs/cloudinary.config.js";
import User from "../models/auth.model.js";
import fs from "fs";
import bcrypt from "bcryptjs";

export const updateUserInfoController = async (req, res) => {
  try {
    const fullName = req.body.fullName;
    const imageUrl = req.file.path;
    const email = req.params.email;
    const uploadUserImage = await cloudinary.uploader.upload(imageUrl, {
      folder: "E-Commere-Store UserImage",
    });
    fs.unlinkSync(imageUrl);
    const findUser = await User.findOne({ email: email });
    if (!findUser) {
      return res.status(400).json({
        message: "This user is not found",
      });
    }
    const updateUser = await User.findByIdAndUpdate(
      findUser._id,
      {
        fullName,
        userImage: uploadUserImage.secure_url,
      },
      { new: true },
    );
    return res.status(200).json({
      message: "update user info details",
    });
  } catch (error) {
    console.log(`updateUserInfo controller error: ${error.messag}`);
    return res.status(500).json({
      error: "Internal Servr Error",
      message: error.message,
    });
  }
};

export const updatePasswordController = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    const email = req.params.email;
    if (!req.body) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }
    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }
    if (!email) {
      return res.status(400).json({
        message: "email not privided plese email provided",
      });
    }
    if (!email.includes("@gmail.com")) {
      return res.status(400).json({
        message: "Check your email formate",
      });
    }
    if (
      currentPassword.length < 8 ||
      newPassword.length < 8 ||
      confirmPassword.length < 8
    ) {
      return res.status(400).json({
        message: "Password length must be 8 digit required",
      });
    }
    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        messag: "newPassword or confirmPassword is not match",
      });
    }
    const findUser = await User.findOne({ email: email });
    if (!findUser) {
      return res.status(400).json({
        message: "This user is not found",
      });
    }
    const comparePassword = await bcrypt.compare(
      currentPassword,
      findUser.password,
    );
    if (!comparePassword) {
      return res.status(400).json({
        message: "Incorrect Password",
      });
    }
    const hashPassword = await bcrypt.hash(newPassword, 10);
    const updatePassword = await User.findByIdAndUpdate(
      findUser._id,
      {
        password: hashPassword,
      },
      {
        new: true,
      },
    );
    return res.status(200).json({
      messag: "Password Updated",
    });
  } catch (error) {
    console.log(`update password route controller error: ${error.message}`);
    return res.status(500).json({
      error: "Internal Server Error",
    });
  }
};
