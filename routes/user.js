import express from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

router.post("/", async (req, res) => {
  const { name, phoneNumber, role } = req.body;

  try {
    const newUser = await prisma.user.create({
      data: {
        name,
        phoneNumber,
        role,
      },
    });
    res.status(201).json({ message: "user created", user: newUser });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Failed to create user" });
  }
});

router.get("/", async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching useres:", error);
    res.status(500).json({ error: "Failed to get users" });
  }
});

router.get("/:id", async (req, res) => {
  const id = parseInt(req.params.id);

  try {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return res.status(404).json({ error: "user not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Failed to get user" });
  }
});

router.patch("/:id", async (req, res) => {
  const userId = parseInt(req.params.id, 10);
  const { name, phoneNumber, role } = req.body;

  if (!name && !phoneNumber && !role) {
    return res.status(400).json({ error: "No update fields provided." });
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(name && { name }),
        ...(phoneNumber && { phoneNumber }),
        ...(role && { role }),
      },
    });

    res.status(200).json({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Failed to update user" });
  }
});

router.delete("/:id", async (req, res) => {
  const id = parseInt(req.params.id);

  try {
    await prisma.user.delete({ where: { id } });
    res.status(200).json({ message: "user deleted" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Failed to delete user" });
  }
});

export default router;
