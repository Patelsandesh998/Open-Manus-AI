import express from "express";
import axios from "axios";

const router = express.Router();
const SANDBOX_BASE_URL = process.env.SANDBOX_BASE_URL || "http://127.0.0.1:8000";

/* ---------------- SESSION MANAGEMENT ---------------- */

// 1️⃣ Create new sandbox session
router.post("/sessions/create", async (req, res) => {
  try {
    const response = await axios.post(`${SANDBOX_BASE_URL}/sessions/create`, {}, {
      headers: { "Content-Type": "application/json" },
    });
    res.json(response.data);
  } catch (error) {
    console.error("Error creating session:", error.message);
    res.status(500).json({ error: "Failed to create sandbox session" });
  }
});

// 2️⃣ List active sessions
router.get("/sessions", async (req, res) => {
  try {
    const response = await axios.get(`${SANDBOX_BASE_URL}/sessions`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch sessions" });
  }
});

// 3️⃣ Delete a session
router.delete("/sessions/:id", async (req, res) => {
  try {
    const response = await axios.delete(`${SANDBOX_BASE_URL}/sessions/${req.params.id}`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Failed to delete session" });
  }
});

/* ---------------- SANDBOX OPERATIONS ---------------- */

// Execute code inside a sandbox
router.post("/sessions/:id/execute", async (req, res) => {
  try {
    const { language, code } = req.body;
    const response = await axios.post(`${SANDBOX_BASE_URL}/sessions/${req.params.id}/execute`, 
      { language, code },
      { headers: { "Content-Type": "application/json" } }
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Code execution failed" });
  }
});

// Read a file
router.post("/sessions/:id/file/read", async (req, res) => {
  try {
    const response = await axios.post(
      `${SANDBOX_BASE_URL}/sessions/${req.params.id}/file/read`,
      req.body
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Failed to read file" });
  }
});

// Write a file
router.post("/sessions/:id/file/write", async (req, res) => {
  try {
    const response = await axios.post(
      `${SANDBOX_BASE_URL}/sessions/${req.params.id}/file/write`,
      req.body
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Failed to write file" });
  }
});

// Get browser info
router.get("/sessions/:id/browser/info", async (req, res) => {
  try {
    const response = await axios.get(`${SANDBOX_BASE_URL}/sessions/${req.params.id}/browser/info`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch browser info" });
  }
});

// Get VNC URL
router.get("/sessions/:id/vnc/url", async (req, res) => {
  try {
    const response = await axios.get(`${SANDBOX_BASE_URL}/sessions/${req.params.id}/vnc/url`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Failed to get VNC URL" });
  }
});

export default router;
