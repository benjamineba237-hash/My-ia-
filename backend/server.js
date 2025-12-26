import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(express.json());

// ✅ Autoriser toutes les origines (pour tester)
app.use(cors());

// Route principale
app.post("/chat", async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message manquant dans la requête" });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: message }],
        max_tokens: 500,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({ error: errorText });
    }

    const data = await response.json();
    res.json(data);

  } catch (err) {
    console.error("Erreur backend:", err);
    res.status(500).json({ error: "Erreur interne du serveur" });
  }
});

export default app;

