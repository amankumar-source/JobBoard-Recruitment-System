import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import userRoute from "./routes/user.route.js";
import companyRoute from "./routes/company.route.js";
import jobRoute from "./routes/job.route.js";
import applicationRoute from "./routes/application.route.js";
import aiRoutes from "./routes/aiRoutes.js";

dotenv.config({});

const app = express();

// ─── Middleware ───────────────────────────────────────────────
app.use(express.json({ limit: "1mb" }));          // Limit body size to prevent abuse
app.use(express.urlencoded({ extended: true, limit: "1mb" }));
app.use(cookieParser());

const corsOptions = {
  origin: [
    "http://localhost:5173",
    "http://localhost:5174",
    "https://job-board-recruitment-system.vercel.app",
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

// ─── Routes ───────────────────────────────────────────────────
app.use("/api/v1/user", userRoute);
app.use("/api/v1/company", companyRoute);
app.use("/api/v1/job", jobRoute);
app.use("/api/v1/application", applicationRoute);
app.use("/api/ai", aiRoutes);

// ─── Health check ─────────────────────────────────────────────
app.get("/health", (_req, res) => res.status(200).json({ status: "ok" }));

// ─── Global error handler ─────────────────────────────────────
// Catches any unhandled errors from route handlers
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error("[Global Error]", err.message);
  res.status(err.status || 500).json({
    message: err.message || "Internal server error",
    success: false,
  });
});

const PORT = process.env.PORT || 3000;

// ─── Start: connect DB first, then listen ────────────────────
// Previously connectDB() was called inside the listen callback — but the server
// could receive requests before the DB connection was established.
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running at port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to database:", err.message);
    process.exit(1);
  });
