import express from "express";
import axios from "axios";

const router = express.Router();
const SANDBOX_BASE = "http://127.0.0.1:8000";

// Create session
router.post("/create", async (req, res) => {
  try {
    const response = await axios.post(`${SANDBOX_BASE}/sessions/create`, req.body);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// List sessions
router.get("/", async (req, res) => {
  try {
    const response = await axios.get(`${SANDBOX_BASE}/sessions`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete session
router.delete("/:sessionId", async (req, res) => {
  try {
    const { sessionId } = req.params;
    const response = await axios.delete(`${SANDBOX_BASE}/sessions/${sessionId}`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
