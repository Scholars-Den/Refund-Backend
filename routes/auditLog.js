import express from "express";
import { PrismaClient } from "@prisma/client";
import { verifyAdminToken } from "../middlewares/authMiddleware.js";

const prisma = new PrismaClient();
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const {
      source,
      action,
      level = "error",
      message,
      mobileNumber,
      fileName,
      fileType,
      fileSize,
      userAgent,
      meta,
    } = req.body || {};

    if (!source || !action || !message) {
      return res.status(400).json({
        error: "source, action and message are required",
      });
    }

    const log = await prisma.auditLog.create({
      data: {
        source,
        action,
        level,
        message,
        mobileNumber: mobileNumber || null,
        fileName: fileName || null,
        fileType: fileType || null,
        fileSize: Number.isFinite(fileSize) ? fileSize : null,
        userAgent: userAgent || null,
        meta: meta || null,
      },
    });

    return res.status(201).json({ success: true, id: log.id });
  } catch (error) {
    console.error("Error creating audit log:", error);
    return res.status(500).json({ error: "Failed to create audit log" });
  }
});

router.get("/", verifyAdminToken, async (req, res) => {
  try {
    const { page = 1, limit = 20, level, source, action, startDate, endDate } = req.query;

    const pageNum = Math.max(parseInt(page, 10) || 1, 1);
    const limitNum = Math.min(Math.max(parseInt(limit, 10) || 20, 1), 100);

    const where = {
      ...(level ? { level: String(level) } : {}),
      ...(source ? { source: String(source) } : {}),
      ...(action ? { action: String(action) } : {}),
      ...((startDate || endDate)
        ? {
            createdAt: {
              ...(startDate ? { gte: new Date(String(startDate)) } : {}),
              ...(endDate ? { lte: new Date(String(endDate)) } : {}),
            },
          }
        : {}),
    };

    const [data, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        skip: (pageNum - 1) * limitNum,
        take: limitNum,
        orderBy: { createdAt: "desc" },
      }),
      prisma.auditLog.count({ where }),
    ]);

    return res.status(200).json({
      data,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
    });
  } catch (error) {
    console.error("Error fetching audit logs:", error);
    return res.status(500).json({ error: "Failed to fetch audit logs" });
  }
});

export default router;
