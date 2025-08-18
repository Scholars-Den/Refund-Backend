import express from "express";
import { PrismaClient } from "@prisma/client";
import { otpVerification } from "../utils/smsTemplates.js";
import jwt from "jsonwebtoken";

const router = express.Router();
const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET;

// router.post("/login", async (req, res) => {
//   try {
//     const { mobileNumber } = req.body;

//     const data = await prisma.user.findFirst({
//       where: { mobileNumber },
//     });

//     if (!data) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     const tokenForExistingStudent = jwt.sign(
//       { role: data.role, mobileNumber: data.mobileNumber },
//       JWT_SECRET,
//       { expiresIn: "1d" }
//     );

//     // ✅ Set cookie securely for Safari/Chrome
//     // res.cookie("token", tokenForExistingStudent, {
//     //   httpOnly: true,
//     //   sameSite: "None",
//     //   secure: true,
//     //   maxAge: 24 * 60 * 60 * 1000,
//     // });

//     console.log("Data from login", data);
//     console.log("Data from login", data.role);

//     res.cookie("token", tokenForExistingStudent, {
//       httpOnly: true,
//       sameSite: "none",
//       secure: false,
//       maxAge: 24 * 60 * 60 * 1000,
//     });
//     res.cookie("role", data.role, {
//       httpOnly: true,
//       sameSite: "none",
//       secure: false,
//       maxAge: 24 * 60 * 60 * 1000,
//     });

//     return res.status(200).json({ message: "Login successful" });
//   } catch (error) {
//     console.error("Error", error);
//     return res.status(500).json({ error: "Internal server error" });
//   }
// });

// router.post("/login", async (req, res) => {
//   try {
//     const { mobileNumber } = req.body;

//     if (!mobileNumber) {
//       return res.status(400).json({ error: "Mobile number is required" });
//     }

//     const user = await prisma.user.findFirst({
//       where: { mobileNumber },
//     });

//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     const token = jwt.sign(
//       {
//         role: user.role,
//         mobileNumber: user.mobileNumber,
//       },
//       JWT_SECRET,
//       { expiresIn: "1d" }
//     );

//     // 🌐 Set cookies securely
//     const cookieOptions = {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production", // true on prod (HTTPS), false in dev
//       sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
//       maxAge: 24 * 60 * 60 * 1000, // 1 day
//     };

//     res.cookie("token", token, cookieOptions);
//     res.cookie("role", user.role, cookieOptions);

//     return res.status(200).json({ message: "Login successful" });
//   } catch (error) {
//     console.error("Login error:", error);
//     return res.status(500).json({ error: "Internal server error" });
//   }
// });









router.post("/login", async (req, res) => {
  try {
    const { mobileNumber } = req.body;

    if (!mobileNumber) {
      return res.status(400).json({ error: "Mobile number is required" });
    }

    const user = await prisma.user.findFirst({
      where: { mobileNumber },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const token = jwt.sign(
      {
        role: user.role,
        mobileNumber: user.mobileNumber,
      },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    const isProduction = process.env.NODE_ENV === "production";

    // 🔐 Token: HttpOnly, secure
    res.cookie("token", token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "None" : "Lax",
      maxAge: 24 * 60 * 60 * 1000,
      path: "/",
    });

    // 🌐 Role: readable by frontend
    res.cookie("role", user.role, {
      httpOnly: false, // ✅ allow JS to read it
      secure: isProduction,
      sameSite: isProduction ? "None" : "Lax",
      maxAge: 24 * 60 * 60 * 1000,
      path: "/",
    });

    return res.status(200).json({ message: "Login successful" });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});














router.post("/logout", async (req, res) => {
  try {
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      path: "/", // important to match the path used during setting
    };

    res.clearCookie("token", cookieOptions);
    res.clearCookie("role", cookieOptions);

    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});



// Generate & send OTP
router.post("/sendVerification", async (req, res) => {
  const { mobileNumber } = req.body;

  if (!mobileNumber) {
    return res.status(400).json({
      success: false,
      message: "Mobile number is required.",
    });
  }

  const otp = Math.floor(1000 + Math.random() * 9000); // 4-digit OTP

  try {
    const response = await otpVerification(otp, mobileNumber);

    await prisma.otpStore.upsert({
      where: { mobileNumber }, // Now mobileNumber is @unique
      update: {
        otp: otp.toString(),
        createdAt: new Date(),
      },
      create: {
        mobileNumber,
        otp: otp.toString(),
        createdAt: new Date(),
      },
    });

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully",
      smsResponse: response.data,
      otp,
    });
  } catch (error) {
    console.log("Error sending OTP:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to send OTP.",
      error: error.message,
    });
  }
});

// Verify OTP
router.post("/verifyNumber", async (req, res) => {
  const { mobileNumber, otp } = req.body;
  console.log("req.body", req.body);

  if (!mobileNumber || !otp) {
    return res.status(400).json({
      success: false,
      message: "Mobile number and OTP are required.",
    });
  }

  try {
    const existingOtp = await prisma.otpStore.findUnique({
      where: { mobileNumber },
    });

    if (!existingOtp) {
      return res.status(400).json({
        success: false,
        message: "Invalid mobile number.",
      });
    }

    if (existingOtp.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP.",
      });
    }

    const currentTime = new Date();
    const expiryTime = new Date(
      existingOtp.createdAt.getTime() + 5 * 60 * 1000
    ); // 5 min expiry

    if (currentTime > expiryTime) {
      return res.status(400).json({
        success: false,
        message: "OTP has expired.",
      });
    }

    await prisma.otpStore.delete({
      where: { mobileNumber },
    });

    return res.status(200).json({
      success: true,
      message: "OTP verification successful.",
    });
  } catch (error) {
    console.error("OTP verification failed:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to verify OTP.",
      error: error.message,
    });
  }
});

export default router;
