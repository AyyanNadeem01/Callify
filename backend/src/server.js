import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import { connectDB } from "./lib/db.js";
import chatRoutes from "./routes/chat.route.js";
import cookieParser from "cookie-parser";
import cors from "cors";
//password mongodb: eWLKe1oIKBynJFBa
dotenv.config();

const app =express();
const PORT=process.env.PORT || 3000;
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:5173", // Replace with your frontend URL
  credentials: true, // Allow cookies to be sent with requests
}));
app.use(express.urlencoded({ extended: true }));
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chat", chatRoutes);

app.get("/", (req, res) => {
    res.send("Hello!");
  });
  
app.listen(PORT, () => {
  console.log("Server is running on port 5001");
  connectDB()
    .then(() => console.log("Server.js :Database connected successfully"))
    .catch((error) => console.error("Database connection failed:", error));
});