import express from "express";
import axios from "axios";

const router = express.Router();
const SANDBOX_BASE = "http://127.0.0.1:8000";

// Execute code
router.post("/:sessionId/execute", async (req, res) => {
  try {
    const { sessionId } = req.params;
    const response = await axios.post(
      `${SANDBOX_BASE}/sessions/${sessionId}/execute`,
      req.body
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new session
router.post("/sessions/create", async (req, res) => {
  try {
    const response = await axios.post(`${SANDBOX_BASE}/sessions/create`, req.body);
    res.json(response.data);
  } catch (error) {
    console.error("🔥 Error creating session:");
    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Data:", error.response.data);
    } else {
      console.error(error.message);
    }
    res.status(500).json({ error: "Failed to create session" });
  }
});

// Read file
router.post("/:sessionId/file/read", async (req, res) => {
  try {
    const { sessionId } = req.params;
    const response = await axios.post(
      `${SANDBOX_BASE}/sessions/${sessionId}/file/read`,
      req.body
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Write file
router.post("/:sessionId/file/write", async (req, res) => {
  try {
    const { sessionId } = req.params;
    const response = await axios.post(
      `${SANDBOX_BASE}/sessions/${sessionId}/file/write`,
      req.body
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
