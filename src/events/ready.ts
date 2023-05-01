import { Client } from "discord.js";
import { color, sendMessageToChannel } from "../functions";
import { checkArticles } from "../tasks/checkArticles";
import { BotEvent } from "../types";
import { checkTimeline } from "../tasks/timeline";
import cron from "node-cron";

const event: BotEvent = {
  name: "ready",
  once: true,
  execute: (client: Client) => {
    console.log(color("text", `💪 Logged in as ${color("variable", client.user?.tag)}`));

    // // Run programmed tasks
    taskArticleNews(client);
    taskGetNewBanners(client);
  },
};

async function taskArticleNews(client: Client) {
  console.log(`Init taskArticleNews @ ${new Date().toISOString()}`);

  const CRON_TIME = process.env.NEWS_CHECK_CRON;

  cron.schedule(CRON_TIME, async () => {
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
  });
}

async function taskGetNewBanners(client: Client) {
  console.log(`Init taskGetNewBanners @ ${new Date().toISOString()}`);

  const CRON_TIME = process.env.TIMELINE_CHECK_CRON;

  cron.schedule(CRON_TIME, async () => {
    console.log(`Executing taskGetNewBanners @ ${new Date().toISOString()}`);

    const { embeds } = await checkTimeline();
    // Send embeds to timeline channels in all guilds
    if (embeds.length) {
      client.guilds.cache.forEach(async (guild) => {
        try {
          await sendMessageToChannel(guild, "timelineChannelID", { embeds });
        } catch (error) {
          console.log({ error });
        }
      });
    }
  });
}

export default event;
