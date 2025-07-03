import express from "express";

const router = express();
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import jwt from "jsonwebtoken";
import { verifyStudentToken } from "../middlewares/authMiddleware.js";
const SECRET_KEY = process.env.JWT_SECRET;

import multer from "multer";
import fs from "fs";
import path from "path";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

router.get("/", async (req, res) => {
  try {
    // const allStudent = await prisma.student.findMany({
    //   where: { name: "Alice" },
    // });
    const allStudent = await prisma.student.findMany();
    res.status(200).json({ allStudent });
  } catch (error) {
    console.error("error from student get", error);
    res.status(500).json({ message: "Server error" });
  }
});

// router.post("/createInitialStudent", async (req, res) => {
//   console.log("mobileNumber", req.body);

//   const { mobileNumber } = req.body;

//   try {
//     const student = await prisma.student.create({
//       data: {
//         mobileNumber,
//       },
//     });
//     console.log("Student created:", student);
//     return student;
//   } catch (error) {
//     console.error("Error creating student:", error);
//     throw error;
//   }
// });

router.post("/createInitialStudent", async (req, res) => {
  const { mobileNumber } = req.body;

  try {
    if (!mobileNumber) {
      return res.status(400).json({ message: "Mobile number is required" });
    }

    // Check if student already exists
    const existingStudent = await prisma.student.findFirst({
      where: { mobileNumber },
    });

    // If student exists, return the same + token
    if (existingStudent) {
      const token = jwt.sign(
        {
          id: existingStudent.id,
          mobileNumber: existingStudent.mobileNumber,
          role: "student",
        },
        SECRET_KEY,
        { expiresIn: "1h" }
      );

      return res.status(200).json({
        message: "Student already exists",
        student: existingStudent,
        token,
      });
    }

    // Else create a new student
    const student = await prisma.student.create({
      data: {
        mobileNumber,
      },
    });

    const token = jwt.sign(
      {
        id: student.id,
        mobileNumber: student.mobileNumber,
        role: "student",
      },
      SECRET_KEY,
      { expiresIn: "1h" }
    );

    return res.status(201).json({
      message: "Student created successfully",
      student,
      token,
    });
  } catch (error) {
    console.error("Error creating or finding student:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/studentByForm", verifyStudentToken, async (req, res) => {
  try {
    const { mobileNumber } = req.student;

    const result = await prisma.student.findFirst({
      where: {
        mobileNumber,
      },
    });
    res.status(200).json({ result });
  } catch (error) {
    console.error("error from student get", error);
    res.status(500).json({ message: "Server error" });
  }
});

// router.post("/create", async (req, res) => {
//   try {
//     const {
//       name,
//       fatherName,
//       rollNumber,
//       dateOfAdmission,
//       session,
//       accountHolderName,
//       accountNumber,
//       ifsc,
//       bankName,
//       relationWithStudent,
//       amountDeposit,
//       remark,
//     } = req.body;

//     const newStudent = await prisma.student.create({
//       data: {
//         name,
//         fatherName,
//         rollNumber,
//         dateOfAdmission: new Date(dateOfAdmission),
//         session: new Date(session),
//         accountHolderName,
//         accountNumber,
//         ifsc,
//         bankName,
//         relationWithStudent,
//         amountDeposit,
//         remark,
//       },
//     });

//    return res.status(201).json(newStudent);
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ error: "Failed to create student" });
//   }
//   console.log("mobileNumber", req.body);
// });

const upload = multer({ dest: "uploads/" });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const safeUnlink = (path) => {
  fs.unlink(path, (err) => {
    if (err) console.warn("File cleanup failed:", err);
  });
};

router.post(
  "/create",
  verifyStudentToken,
  upload.single("image"),
  async (req, res) => {
    const mobileNumber = req.student.mobileNumber;

    try {
      if (!req.file) {
        return res.status(400).json({ message: "No image file uploaded" });
      }

      const filePath = path.resolve(req.file.path);

      const {
        name,
        fatherName,
        rollNumber,
        dateOfAdmission,
        session,
        batch,
        accountHolderName,
        accountNumber,
        ifsc,
        bankName,
        relationWithStudent,
        amountDeposit,
        remark,
      } = JSON.parse(req.body.studentDetails);

      const requiredFields = [
        name,
        fatherName,
        rollNumber,
        dateOfAdmission,
        session,
        batch,
        accountHolderName,
        accountNumber,
        ifsc,
        bankName,
      ];
      const emptyField = requiredFields.find((f) => !f);
      if (emptyField) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      let result;
      try {
        result = await cloudinary.uploader.upload(filePath, {
          folder: "Refund Form",
        });
      } catch (cloudErr) {
        safeUnlink(filePath);
        return res.status(500).json({ error: "Cloudinary upload failed" });
      } finally {
        safeUnlink(filePath); // Always delete temp file
      }

      const existingStudent = await prisma.student.findFirst({
        where: { mobileNumber },
      });

      if (!existingStudent) {
        await prisma.statusLog.create({
          data: {
            formId: null,
            status: "Student Not Found",
            remarks: `No student found with mobile number ${mobileNumber}`,
          },
        });
        return res.status(404).json({ message: "Student not found" });
      }

      try {
        const [updatedStudent, addStudentLog] = await prisma.$transaction([
          prisma.student.update({
            where: { id: existingStudent.id },
            data: {
              name,
              fatherName,
              rollNumber,
              dateOfAdmission: new Date(dateOfAdmission),
              session,
              batch,
              accountHolderName,
              accountNumber,
              ifsc,
              bankName,
              relationWithStudent,
              amountDeposit,
              remark,
              document: result.secure_url,
            },
          }),
          prisma.statusLog.create({
            data: {
              formId: existingStudent.id,
              status: "Form Submitted Successfully",
              remarks: "Form Submitted Successfully",
            },
          }),
        ]);

        return res.status(200).json({
          message: "Student updated successfully",
          student: updatedStudent,
        });
      } catch (txError) {
        // ❗ Log transaction failure
        await prisma.statusLog.create({
          data: {
            formId: existingStudent.id,
            status: "Student Update Failed",
            remarks: `Update failed: ${txError.message}`,
          },
        });

        return res.status(500).json({ error: "Failed to update student" });
      }
    } catch (error) {
      console.error("Unhandled Error:", error);

      // Log general failure
      try {
        await prisma.statusLog.create({
          data: {
            formId: null,
            status: "Unhandled Error",
            remarks: error.message || "Unknown error",
          },
        });
      } catch (logErr) {
        console.error("Failed to log error to statusLog:", logErr);
      }

      if (error.code === "P2025") {
        return res.status(404).json({ error: "Student not found in database" });
      }

      return res.status(500).json({ error: "Unexpected server error" });
    }
  }
);

router.patch("/update/:id", async (req, res) => {
  const studentId = parseInt(req.params.id, 10);
  const data = req.body;

  try {
    // Optional: convert dates only if present
    if (data.dateOfAdmission) {
      data.dateOfAdmission = new Date(data.dateOfAdmission);
    }
    if (data.session) {
      data.session = new Date(data.session);
    }
    if (data.accountNumber) {
      data.accountNumber = BigInt(data.accountNumber);
    }

    const updatedStudent = await prisma.student.update({
      where: {
        id: studentId,
      },
      data,
    });

    res.status(200).json({
      message: "Student updated successfully",
      student: updatedStudent,
    });
  } catch (error) {
    console.error("Error updating student:", error);
    res.status(500).json({ error: "Failed to update student" });
  }
});

router.delete("/delete/:id", async (req, res) => {
  try {
    const studentId = parseInt(req.params.id, 10);

    const deleteStudentById = await prisma.student.delete({
      where: {
        id: studentId,
      },
    });

    console.log("deleteStudentById", deleteStudentById);
    res.status(200).json({ deleteStudentById });
  } catch (error) {
    console.log("error from student delete", error);
    res.status(500).json({ message: "Servewr error" });
  }
});

export const StudentRoute = router;
