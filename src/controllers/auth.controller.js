import User from "../models/auth.model.js";
import bcrypt from "bcryptjs";
import { generatedHtml, generatedOtp } from "../utils/gmail.util.js";
import { sendMail } from "../services/email.service.js";
import OTP from "../models/authOtp.model.js";
import {
  gerenateAssesToken,
  gerenateRefreshToken,
} from "../utils/token.util.js";

export const registerController = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    if (!req.body) {
      return res.status(400).json({
        message: "All fields are required plese all fields is provided",
      });
    }
    if (!fullName || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }
    const findUser = await User.findOne({ email: email });
    console.log(findUser);
    if (findUser) {
      return res.status(400).json({
        message: "This user is already exists",
      });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    // Send Gamil
    const otp = generatedOtp();
    const html = generatedHtml(otp);
    sendMail(email, "OTP Verification", `Your OTP Code: ${otp}`, html);
    // Register User
    const createUser = await User.create({
      fullName,
      email,
      password: passwordHash,
    });
    // otp hash
    const otpHash = await bcrypt.hash(otp, 10);
    const otpExpAt = Date.now() + 10 * 60 * 1000;
    const createOpt = await OTP.create({
      userId: createUser._id,
      otp: otpHash,
      otpExp: otpExpAt,
    });
    return res.status(201).json({
      created: "User is register",
      message: "Check Your email and verify your email",
      email: createUser.email,
    });
  } catch (error) {
    console.log(`register route error: ${error.message}`);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// isLogin Authentication controller
export const emailVerifyController = async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).json({
        message: "Otp is not provided plese otp is provided",
      });
    }
    const email = req.params.email;
    const { otp } = req.body;
    const findUser = await User.findOne({ email: email });
    if (!findUser) {
      return res.status(404).json({
        message: "This user is not found plese check your email",
      });
    }
    if (!email) {
      return res.status(400).json({
        message: "email is required plese send your email using params",
      });
    }
    if (!otp) {
      return res.status(400).json({
        message: "OTP is required",
      });
    }
    if (otp.length > 6) {
      return res.status(400).json({
        message: "Plese check otp length 6 digit lenth otp is valid",
      });
    }
    const findOtp = await OTP.findOne({ userId: findUser._id });
    if (!findOtp.otp) {
      return res.status(404).json({
        message: "OTP is not found plese register your email and generated otp",
      });
    }
    const verifyOtp = await bcrypt.compare(otp, findOtp.otp);
    if (!verifyOtp) {
      return res.status(400).json({
        message: "This otp is wrong otp plese check your otp",
      });
    }
    if (Date.now() > findOtp.otpExp) {
      return res.status(400).json({
        message: "this otp is expire plese resend and create new otp",
      });
    }
    const updateUser = await User.findByIdAndUpdate(
      findUser._id,
      {
        isVerify: true,
      },
      { new: true },
    );
    if (updateUser.isVerify === true) {
      const deleteOtp = await OTP.findByIdAndDelete(findOtp._id);
    }
    return res.status(200).json({
      message: "Your email is verify login now",
    });
  } catch (error) {
    console.log(`verify email route error: ${error.message}`);
    return res.status(500).json({
      message: "Interval Server Error",
    });
  }
};

export const loginController = async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).json({
        message:
          "email or password is required plese email or password is provided",
      });
    }
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        message: "email or password is required",
      });
    }
    const findUser = await User.findOne({ email: email });
    if (!findUser) {
      return res.status(400).json({
        message:
          "This user is not exists plese register now or check your email",
      });
    }
    if (findUser.isVerify !== true) {
      return res.status(400).json({
        message: "This user email is not verify plese verify your email",
      });
    }
    const verifyEmail = await bcrypt.compare(password, findUser.password);
    if (!verifyEmail) {
      return res.status(400).json({
        message: "Check your passwrod your password is wrong",
      });
    }
    const assesToken = await gerenateAssesToken(findUser._id, "20d");
    const refreshToken = await gerenateRefreshToken(findUser._id, "15d");
    const optionalCookie = {
      httpOnly: true,
      secure: "",
      strict: "sameSite",
      maxAge: 15 * 24 * 60 * 60 * 1000,
    };
    res.cookie("refreshToken", refreshToken, optionalCookie);
    const updateUser = await User.findByIdAndUpdate(
      findUser._id,
      {
        token: assesToken,
        isLogin: true,
      },
      { new: true },
    );
    return res.status(200).json({
      message: "this user is login",
      data: {
        fullName: updateUser.fullName,
        email: updateUser.email,
        token: updateUser.token,
        isVerify: updateUser.isVerify,
        isLogin: updateUser.isLogin,
      },
    });
  } catch (error) {
    console.log(`login route error: ${error.message}`);
    return res.status(500).json({
      message: "Interval Server Error",
    });
  }
};

export const logoutController = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({
        message: "You are unAuthenticated plese login now",
      });
    }
    const findUser = await User.findOne({ _id: userId });
    console.log(findUser);
    if (!findUser) {
      return res.status(404).json({
        message: "This user is not exists",
      });
    }
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: "sctict"
    });
    const updateUser = await User.findByIdAndUpdate(
      findUser._id,
      {
        isLogin: false,
        token: null,
      },
      { new: true },
    );
    return res.status(200).json({
      message: "This user is logout",
    });
  } catch (error) {
    console.log(`logout routes error: ${error.message}`);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const emailOtpController = async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).json({
        message: "Gmail is not provided plese gmail is provided",
      });
    }
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({
        message: "email is required",
      });
    }
    const findUser = await User.findOne({ email: email });
    if (!findUser) {
      return res.status(400).json({
        message: "This user is not exists plese check your email",
      });
    }
    const otp = generatedOtp();
    const html = generatedHtml(otp);
    const hashOtp = await bcrypt.hash(otp, 10);
    const otpExpAt = Date.now() + 10 * 60 * 1000;
    sendMail(
      findUser.email,
      "Reset Password OTP Verification",
      `Reset Passwrod OTP (${otp}) Verification`,
      html,
    );
    const updateUser = await User.findByIdAndUpdate(findUser._id, {
      otp: hashOtp,
      otpExp: otpExpAt,
    });
    return res.status(200).json({
      message: "Send otp your email and check your email and verify now",
    });
  } catch (error) {
    console.log(`emailotp routes error: ${error.message}`);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

// isChangePassword controller
export const verifyOtpController = async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).json({
        message: "Otp is not provided plese otp is provided",
      });
    }
    const email = req.params.email;
    const { otp } = req.body;
    if (!email) {
      return res.status(400).json({
        message: "email is required",
      });
    }
    if (!otp) {
      return res.status(400).json({
        message: "OTP is required",
      });
    }
    const findUser = await User.findOne({ email: email });
    if (!findUser) {
      return res.status(400).json({
        message: "This user is not exists plese check your email",
      });
    }
    if (Date.now() > findUser.otpExp) {
      return res.status(400).json({
        message:
          "Your Otp is expire plese resend your email and otp generated now",
      });
    }
    const verifyOtp = await bcrypt.compare(otp, findUser.otp);
    if (!verifyOtp) {
      return res.status(400).json({
        message: "Your otp is wrong plese check your otp",
      });
    }
    const updateUser = await User.findByIdAndUpdate(
      findUser._id,
      {
        otp: null,
        otpExp: null,
        isChangePassword: true,
      },
      { new: true },
    );
    return res.status(200).json({
      message: "Your reset password otp is verify plese create password",
    });
  } catch (error) {
    console.log(`reset verify otp routes error: ${error.message}`);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const resetPasswrodController = async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).json({
        message:
          "newPassword or confirmPassword is not provided plese newPassword or confirmPassword is provided",
      });
    }
    const email = req.params.email;
    const { newPassword, confirmPassword } = req.body;
    if (!email) {
      return res.status(400).jons({
        message: "Email is required",
      });
    }
    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        message: "newPassword and confirmPassword is not match",
      });
    }
    const findUser = await User.findOne({ email: email });
    if (!findUser) {
      return res.status(404).json({
        message: "This User is not find plese check your email",
      });
    }
    if (findUser.isChangePassword !== true) {
      return res.status(400).json({
        message:
          "Reset password verification plese verify your reset password otp verify",
      });
    }
    const hashPassword = await bcrypt.hash(newPassword, 10);
    const updateUser = await User.findByIdAndUpdate(findUser._id, {
      isChangePassword: false,
      password: hashPassword,
    });
    return res.status(200).json({
      message: "Your password is changed",
    });
  } catch (error) {
    console.log(`Reset password routes error: ${error.message}`);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const getUserDataController = async (req, res) => {
  try {
    const id = req.userId;
    if (!id) {
      return res.status(400).json({
        message: "user id is not provided plese provided refresh token",
      });
    }
    const findUser = await User.findById(id);
    if (!findUser) {
      return res.status(400).json({
        message: "this your is not found plese check your user id",
      });
    }
    return res.status(200).json({
      findUser,
    });
  } catch (error) {
    console.log(`getUserDataController routes error: ${error.message}`);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const getRefreshTokenController = async (req, res) => {
  try {
    const userId = req.userId;
    const findUser = await User.findById(userId);
    if (!findUser) {
      return res.status(401).json({
        message: "check your refresh token and provided valid refresh token",
      });
    }
    const assesToken = await gerenateAssesToken(findUser._id, "20d");
    const updateAssesToken = await User.findByIdAndUpdate(
      { _id: findUser._id },
      {
        token: assesToken,
      },
      { new: true },
    );
    console.log(updateAssesToken)
    return res.status(200).json({
      message: "gerenated asses token",
      data: {
        fullName: updateAssesToken.fullName,
        email: updateAssesToken.email,
        assesToken: updateAssesToken.token,
        isLogin: updateAssesToken.isLogin,
        isVerify: updateAssesToken.isVerify,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const userDataController = async (req, res) => {
  try {
    const userId = req.userId;
    const findUserData = await User.findById(userId);
    if (!findUserData) {
      return res.status(401).json({
        message: "this user is not found plese check your asses token",
      });
    }
    return res.status(200).json({
      message: "this login user data",
      data: {
        fullName: findUserData.fullName,
        email: findUserData.email,
        token: findUserData.token,
        isLogin: findUserData.isLogin,
        isVerify: findUserData.isVerify,
      },
    });
  } catch (error) {
    console.log(`getUserDataController routes error: ${error.message}`);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const getDataController = async (req, res) => {
  try {
    return res.status(200).json({
      message: "backend server is live"
    })
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message
    })
  }
}
