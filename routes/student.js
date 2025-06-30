import express from "express";

const router = express();
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

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
router.get("/:id", async (req, res) => {
  try {
    const studentId = parseInt(req.params.id, 10);

    const result = await prisma.student.findUnique({
      where: {
        id: studentId,
      },
    });
    res.status(200).json({ result });
  } catch (error) {
    console.error("error from student get", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/create", async (req, res) => {
  try {
    const {
      name,
      fatherName,
      rollNumber,
      dateOfAdmission,
      session,
      accountHolderName,
      accountNumber,
      ifsc,
      bankName,
      relationWithStudent,
      amountDeposit,
      remark,
    } = req.body;

    const newStudent = await prisma.student.create({
      data: {
        name,
        fatherName,
        rollNumber,
        dateOfAdmission: new Date(dateOfAdmission),
        session: new Date(session),
        accountHolderName,
        accountNumber,
        ifsc,
        bankName,
        relationWithStudent,
        amountDeposit,
        remark,
      },
    });

    res.status(201).json(newStudent);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create student" });
  }
});

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
