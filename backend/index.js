import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
dotenv.config();

const PORT = process.env.PORT || 5679 ;
const app = express();
app.use(express.json());
app.use(cors());

// Initialize AI client (uses GEMINI_API_KEY from .env automatically)
const ai = new GoogleGenAI({});

app.post("/api/jarvis", async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
       res.status(400).json({ error: "prompt required" });
      return;
      
    }

    // Use Gemini 2.5 Flash
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        thinkingConfig: {
          thinkingBudget: 0, // disable "thinking" for faster, cheaper responses
        },
      },
    });

    return res.json({ reply: response.text });
  } catch (err) {
   // console.error("Error in /api/jarvis:", err);
    res.status(500).json({ error: "server error", details: err.message });
  }
});

app.get("/", (req, res) => {
  res.status(200).json({ msg: "server is running" });
});

app.listen(PORT, () =>
  console.log(`🚀 Jarvis backend running on http://localhost:${PORT}`)
);
