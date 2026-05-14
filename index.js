require("dotenv").config();

const express = require("express");
const { Telegraf } = require("telegraf");
const axios = require("axios");

const app = express();
const bot = new Telegraf(process.env.BOT_TOKEN);

const MODEL = "meta-llama/llama-3-8b-instruct:free";

app.get("/", (req, res) => {
  res.send("Bot hidup bro 🤖");
});

bot.start((ctx) => {
  ctx.reply("Halo bro 👋 Bot AI aktif.");
});

bot.on("text", async (ctx) => {
  try {
    console.log("Pakai model:", MODEL);

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: MODEL,
        messages: [
          {
            role: "system",
            content:
              "Kamu adalah bot AI Telegram yang ramah, santai, dan menjawab dalam bahasa Indonesia.",
          },
          {
            role: "user",
            content: ctx.message.text,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.AI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const reply = response.data.choices?.[0]?.message?.content || "AI tidak kasih jawaban bro.";
    ctx.reply(reply);
  } catch (err) {
    console.log("ERROR FULL:", err.response?.data || err.message);

    ctx.reply(
      "Error bro: " +
        (err.response?.data?.error?.message || err.message)
    );
  }
});

app.use(bot.webhookCallback("/bot"));

const PORT = process.env.PORT || 3000;
const WEBHOOK_URL = `https://${process.env.RAILWAY_STATIC_URL}/bot`;

bot.telegram
  .setWebhook(WEBHOOK_URL)
  .then(() => {
    console.log("Webhook aktif:", WEBHOOK_URL);
    console.log("Model aktif:", MODEL);
  })
  .catch((err) => {
    console.log("Webhook error:", err.message);
  });

app.listen(PORT, () => {
  console.log("Server jalan di port", PORT);
});
