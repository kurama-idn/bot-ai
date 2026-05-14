require("dotenv").config();
const express = require("express");
const { Telegraf } = require("telegraf");
const axios = require("axios");

const app = express();
const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start((ctx) => ctx.reply("Bot aktif bro 🤖"));

bot.on("text", async (ctx) => {
  try {
    const res = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "deepseek/deepseek-chat-v3.1:free",
        messages: [{ role: "user", content: ctx.message.text }],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.AI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    ctx.reply(res.data.choices[0].message.content);
  } catch (err) {
    console.log("ERROR:", err.response?.data || err.message);
    ctx.reply("Error bro: " + (err.response?.data?.error?.message || err.message));
  }
});

app.get("/", (req, res) => res.send("Bot hidup bro"));

app.use(bot.webhookCallback("/bot"));

const PORT = process.env.PORT || 3000;
const WEBHOOK_URL = `https://${process.env.RAILWAY_STATIC_URL}/bot`;

bot.telegram.setWebhook(WEBHOOK_URL).then(() => {
  console.log("Webhook aktif:", WEBHOOK_URL);
});

app.listen(PORT, () => {
  console.log("Server jalan di port", PORT);
});
