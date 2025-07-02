import express from "express";
import { PrismaClient } from "@prisma/client";
import { otpVerification } from "../utils/smsTemplates.js";

const router = express.Router();
const prisma = new PrismaClient();

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
  console.log("req.body",req.body);

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
