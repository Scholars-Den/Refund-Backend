import express from "express";

import { StudentRoute } from "./routes/student.js";
import statusRoutes from "./routes/status.js";
import userRoutes from "./routes/user.js";
import statusLogRoutes from "./routes/statusLog.js";
import authRoutes from "./routes/auth.js";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import cookieParser from 'cookie-parser';


// import helmet from "helmet";

const app = express();
// app.use(helmet());
app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));// app.use(
//   cors({
//     origin: "*",
//   })
// );



app.use(
  cors({
    origin: "http://localhost:5173", // ⚠️ In production, restrict to known client origins
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);



// CORS config
// app.use(cors({
//   origin: "https://refund.scholarsden.in",  // ✅ Use your frontend domain
//   methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//   allowedHeaders: ["Content-Type", "Authorization"],
//   credentials: true
// }));

// This handles preflight (OPTIONS) requests




app.use(express.json()); // to parse JSON bodies

// POST /students - create a new student

app.use("/api/student", StudentRoute);
app.use("/api/status", statusRoutes);
app.use("/api/user", userRoutes);
app.use("/api/statusLog", statusLogRoutes);
app.use("/api/auth", authRoutes);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
