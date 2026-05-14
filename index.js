const express = require("express");
const app = express();

app.get("/", (req, res) => res.send("Bot hidup bro"));

app.listen(process.env.PORT || 3000, () => {
  console.log("Web server aktif");
});
require("dotenv").config();
const { Telegraf } = require("telegraf");
const axios = require("axios");

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.on("text", async (ctx) => {
  try {
    const res = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: ctx.message.text,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.AI_API_KEY}`,
        },
      }
    );

    ctx.reply(res.data.choices[0].message.content);
  } catch {
    ctx.reply("Error bro");
  }
});

bot.telegram.deleteWebhook({ drop_pending_updates: true })
  .then(() => {
    bot.launch({
      dropPendingUpdates: true
    });
    console.log("Bot jalan bro");
  })
  .catch((err) => {
    console.log("Launch error:", err);
  });
