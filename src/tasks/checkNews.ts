import { Client } from "discord.js";
import cron from "node-cron";
import { sendMessageToChannel } from "../functions";
import { getUpdatedNews } from "../helpers/getUpdatedNews";

const CRON_TIME = process.env.NEWS_CHECK_CRON;

export async function checkNews(client: Client) {
  console.log(`Init checkNews @ ${new Date().toUTCString()}`);

  cron.schedule(CRON_TIME, async () => {
    console.log(`Executing checkNews @ ${new Date().toUTCString()}`);
    const { embeds, chestMessages } = await getUpdatedNews();

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
  });
}
