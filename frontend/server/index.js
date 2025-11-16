import express from "express";
import cors from "cors";
import "dotenv/config";
import session from "express-session";
import passport from "./config/passport.js";
import connectDB from "./config/db.js";
import i18next, { middleware } from "./config/i18n.js";

// Routes
import sessionsRoutes from "./routes/sessions.js";
import sandboxRoutes from "./routes/sandboxRoutes.js";
import authRoutes from "./routes/auth.js";
import googleAuthRoutes from "./routes/googleAuth.js";
import presentationRouter from "./routes/presentation.js";

const app = express();

// ========================
// 1. CONNECT DATABASE
// ========================
connectDB();

// ========================
// 2. MIDDLEWARE
// ========================
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://smart-agents.vercel.app",
      "https://open-manus.onrender.com",
    ],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// presentation route
app.use("/api/presentation", presentationRouter);

// Express session
app.use(
  session({
    secret: process.env.SESSION_SECRET || "supersecret",
    resave: false,
    saveUninitialized: false,
  })
);

// Passport
app.use(passport.initialize());
app.use(passport.session());

// i18n
app.use(middleware.handle(i18next));

// Request logger
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  next();
});

// ========================
// 3. ROUTES
// ========================
app.use("/api/auth", authRoutes);
app.use("/api/sessions", sessionsRoutes);
app.use("/api/sandbox", sandboxRoutes);
app.use("/auth", googleAuthRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: req.t("api.welcome"),
    timestamp: new Date().toISOString(),
  });
});

// Root route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "✅ Nava AI API Server is running",
    version: "1.0.0",
  });
});

// ========================
// 4. ERROR HANDLING
// ========================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

app.use((err, req, res, next) => {
  console.error("🔥 Server Error:", err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// ========================
// 5. START SERVER (FIXED PORT 5000)
// ========================
const DEFAULT_PORT = parseInt(process.env.PORT, 10) || 5000;
const HOST = process.env.HOST || "0.0.0.0";

function startServer(port) {
  const server = app.listen(port, HOST, () => {
    const actualPort = server.address().port;
    console.log(`\n🚀 Server is running on port ${actualPort}`);
    console.log(`🌐 URL: http://localhost:${actualPort}`);
    console.log(`🔗 Client: ${process.env.CLIENT_URL || "http://localhost:5173"}`);
    console.log(`📝 Environment: ${process.env.NODE_ENV || "development"}\n`);
  });

  server.on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      console.error(`❌ Port ${port} is already in use. Trying another port...`);
      startServer(0); // retry with random available port
    } else {
      console.error("🔥 Server error:", err);
      process.exit(1);
    }
  });
}

startServer(DEFAULT_PORT);
