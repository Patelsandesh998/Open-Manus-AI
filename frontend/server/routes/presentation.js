import fetch from "node-fetch";
import express from "express";

const router = express.Router();

router.post("/generate-ppt", async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: "Prompt is required" });

  try {
    const response = await fetch("https://api.slidesgpt.com/v1/presentations/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.SLIDESGPT_API_KEY}`,
      },
      body: JSON.stringify({ prompt }),
    });

    const data = await response.json();
    if (!response.ok) return res.status(response.status).json(data);

    res.json({
      embedUrl: data.embed,
      downloadUrl: data.download,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate presentation" });
  }
});

export default router;