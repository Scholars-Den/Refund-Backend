import express from "express";
import { PrismaClient } from "@prisma/client";

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
router.get("/", async (req, res) => {
  try {
    const logs = await prisma.statusLog.findMany({
      include: {
        student: true,
        user: true,
      },
    });
    res.status(200).json(logs);
  } catch (error) {
    console.error("Error fetching status logs:", error);
    res.status(500).json({ error: "Failed to fetch status logs" });
  }
});

// READ ONE
router.get("/:id", async (req, res) => {
  try {
    const log = await prisma.statusLog.findUnique({
      where: { id: parseInt(req.params.id, 10) },
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
router.patch("/:id", async (req, res) => {
  try {
    const { status, remarks, updatedBy } = req.body;
    const updatedLog = await prisma.statusLog.update({
      where: { id: parseInt(req.params.id, 10) },
      data: {
        ...(status && { status }),
        ...(remarks && { remarks }),
        ...(updatedBy && { updatedBy }),
      },
    });
    res.status(200).json(updatedLog);
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
    res.status(200).json({message : "StatusLog deleted"});
  } catch (error) {
    console.error("Error deleting status log:", error);
    res.status(500).json({ error: "Failed to delete status log" });
  }
});

export default router;
