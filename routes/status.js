import express from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();



router.post("/", async (req, res) => {
  const { formId, remark } = req.body;

  try {
    const newStatus = await prisma.status.create({
      data: {
        formId,
        remark,
      },
    });
    res.status(201).json({ message: "Status created", status: newStatus });
  } catch (error) {
    console.error("Error creating status:", error);
    res.status(500).json({ error: "Failed to create status" });
  }
});





router.get("/", async (req, res) => {
  try {
    const statuses = await prisma.status.findMany({
      include: {
        student: true,
      },
    });
    res.status(200).json(statuses);
  } catch (error) {
    console.error("Error fetching statuses:", error);
    res.status(500).json({ error: "Failed to get statuses" });
  }
});






router.get("/:id", async (req, res) => {
  const id = parseInt(req.params.id);

  try {
    const status = await prisma.status.findUnique({
      where: { id },    
      include: {
        student: true,
      },
    });

    if (!status) {
      return res.status(404).json({ error: "Status not found" });
    }

    res.status(200).json(status);
  } catch (error) {
    console.error("Error fetching status:", error);
    res.status(500).json({ error: "Failed to get status" });
  }
});






router.patch("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const { remark } = req.body;

  try {
    const updatedStatus = await prisma.status.update({
      where: { id },
      data: { remark },
    });

    res.status(200).json({ message: "Status updated", status: updatedStatus });
  } catch (error) {
    console.error("Error updating status:", error);
    res.status(500).json({ error: "Failed to update status" });
  }
});





router.delete("/:id", async (req, res) => {
  const id = parseInt(req.params.id);

  try {
    await prisma.status.delete({ where: { id } });
    res.status(200).json({ message: "Status deleted" });
  } catch (error) {
    console.error("Error deleting status:", error);
    res.status(500).json({ error: "Failed to delete status" });
  }
});




export default router;
