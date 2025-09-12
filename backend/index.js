const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { GoogleGenAI } = require("@google/genai");
const serverless = require("serverless-http");

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const ai = new GoogleGenAI({});

app.post("/api/jarvis", async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: "prompt required" });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: { thinkingConfig: { thinkingBudget: 0 } },
    });

    return res.json({ reply: response.text });
  } catch (err) {
    res.status(500).json({ error: "server error", details: err.message });
  }
});

app.get("/", (req, res) => {
  res.status(200).json({ msg: "server is running" });
});

// Export the serverless handler for Vercel
module.exports.handler = serverless(app);
