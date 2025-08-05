import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const SECRET_KEY = process.env.JWT_SECRET || "your-secret-key";
const prisma = new PrismaClient();

export const verifyStudentToken = (req, res, next) => {
  const token = req.cookies.token;

  console.log("token", token);

  if (!token) {
    return res.status(401).json({ message: "Authorization header missing" });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);


    console.log("decoded", decoded);
    req.student = decoded; // attach student info to the request
    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};
export const verifyAdminToken = async (req, res, next) => {
  const token = req.cookies.token;


  if (!token) {
    return res.status(401).json({ message: "Authorization header missing" });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);


    const isAvailable = await prisma.user.findUnique({
      where: { mobileNumber: decoded.mobileNumber },
    });
    if (!isAvailable) {
      return res.status(404).json({ message: "Admin Not Found" });
    }

    req.admin = isAvailable; // attach student info to the request
    next();
  } catch (error) {
    console.log("error", error);
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};
