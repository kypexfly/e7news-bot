import { Client } from "discord.js";
import { color, sendMessageToChannel } from "../functions";
import { checkArticles } from "../tasks/checkArticles";
import { BotEvent } from "../types";

const event: BotEvent = {
  name: "ready",
  once: true,
  execute: (client: Client) => {
    console.log(color("text", `💪 Logged in as ${color("variable", client.user?.tag)}`));

    // // Tasks
    taskArticleNews(client);
  },
};

async function taskArticleNews(client: Client) {
  const interval = process.env.NEWS_CHECK_INTERVAL;
  setInterval(async () => {
    console.log(`Executing taskArticleNews @ ${new Date().toISOString()}`);
    const { embeds, chestMessages } = await checkArticles();

    // Send embeds to news channels in all guilds
    if (embeds.length) {
      client.guilds.cache.forEach(async (guild) => {
        try {
          await sendMessageToChannel(guild, "newsChannelID", { embeds });
        } catch (error) {
          console.log({ error });
        }
      });
    }

    if (chestMessages.length) {
      client.guilds.cache.forEach(async (guild) => {
        try {
          await sendMessageToChannel(guild, "chestChannelID", { content: chestMessages });
        } catch (error) {
          console.log({ error });
        }
      });
    }
  }, interval);
}

export default event;
