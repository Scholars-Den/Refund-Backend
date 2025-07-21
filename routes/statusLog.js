import express from "express";
import { PrismaClient } from "@prisma/client";
import { verifyAdminToken } from "../middlewares/authMiddleware.js";
import { messageForApprovalStatus, messageForDisbursedStatus, messageForRejectedStatus } from "../utils/smsTemplates.js";

const prisma = new PrismaClient();
const router = express.Router();

// CREATE
router.post("/", async (req, res) => {
  try {
    console.log("req.body", req.body);
    const { formId, status, remarks, updatedBy } = req.body;
    const newLog = await prisma.statusLog.create({
      data: { formId, status, remarks, updatedBy },
    });
    res.status(201).json(newLog);
  } catch (error) {
    console.error("Error creating status log:", error);
    res.status(500).json({ error: "Failed to create status log" });
  }
});

// READ ALL
router.get("/pending", async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const whereClause = status
      ? { status: status } // Filter by status if provided
      : {};

    // Fetch paginated records
    const logs = await prisma.statusLog.findMany({
      where: whereClause,
      skip: skip,
      take: limitNum,
      include: {
        student: true,
        user: true,
      },
      orderBy: {
        createdAt: "desc", // optional: sort newest first
      },
    });

    // Get total count (without pagination) for frontend use
    const total = await prisma.statusLog.count({ where: whereClause });

    res.status(200).json({
      data: logs,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
    });
  } catch (error) {
    console.error("Error fetching status logs:", error);
    res.status(500).json({ error: "Failed to fetch status logs" });
  }
});

// router.get("/", async (req, res) => {
//   try {
//     const logs = await prisma.statusLog.findMany({
//       include: {
//         student: true,
//         user: true,
//       },
//     });
//     res.status(200).json(logs);
//   } catch (error) {
//     console.error("Error fetching status logs:", error);
//     res.status(500).json({ error: "Failed to fetch status logs" });
//   }
// });

// READ ONE
router.get("/:id", async (req, res) => {
  try {
    const log = await prisma.statusLog.findUnique({
      where: { formId: parseInt(req.params.id, 10) },
      include: {
        student: true,
        user: true,
      },
    });
    res.status(200).json(log);
  } catch (error) {
    console.error("Error fetching status log:", error);
    res.status(500).json({ error: "Failed to fetch status log" });
  }
});

// UPDATE
router.patch("/", verifyAdminToken, async (req, res) => {
  try {
    const { id: adminId } = req.admin;
    const { logId: formId, status, remarks } = req.body;

    if (!formId) {
      return res.status(400).json({ error: "formId (logId) is required" });
    }

    console.log("req.body", formId, status, remarks);

    const updatedLog = await prisma.statusLog.update({
      where: { id: formId }, // ✅ Now allowed because formId is unique
      data: {
        ...(status && { status }),
        ...(remarks && { remarks }),
        updatedBy: adminId,
      },
      include: {
        student: {
          select: {
            rollNumber: true,
            name: true,
          },
        },
      },
    });

    console.log(" send message", updatedLog);
    if (updatedLog.status === "Approved") {
      messageForApprovalStatus({name : updatedLog.student.name, rollNumber: updatedLog.student.rollNumber, mobileNumber : updatedLog.mobileNumber});
    }
    else if(updatedLog.status === "Disburse" ){
      messageForDisbursedStatus({name : updatedLog.student.name, rollNumber: updatedLog.student.rollNumber, mobileNumber : updatedLog.mobileNumber})
    }else if(updatedLog.status === "Rejected"){
      messageForRejectedStatus({name : updatedLog.student.name, rollNumber: updatedLog.student.rollNumber, reason: updatedLog.remarks, mobileNumber : updatedLog.mobileNumber})
    }

    return res.status(200).json(updatedLog);
  } catch (error) {
    console.error("Error updating status log:", error);
    res.status(500).json({ error: "Failed to update status log" });
  }
});

// DELETE
router.delete("/:id", async (req, res) => {
  try {
    await prisma.statusLog.delete({
      where: { id: parseInt(req.params.id, 10) },
    });
    res.status(200).json({ message: "StatusLog deleted" });
  } catch (error) {
    console.error("Error deleting status log:", error);
    res.status(500).json({ error: "Failed to delete status log" });
  }
});

export default router;
