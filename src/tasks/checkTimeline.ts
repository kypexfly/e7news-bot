import { Client } from "discord.js";
import cron from "node-cron";
import { sendMessageToChannel } from "../functions";
import { getUpdatedTimeline } from "../helpers/getUpdatedTimeline";

const CRON_TIME = process.env.TIMELINE_CHECK_CRON;

export async function checkTimeline(client: Client) {
  console.log(`🕑 Init checkTimeline @ ${new Date().toUTCString()}`);

  cron.schedule(CRON_TIME, async () => {
    console.log(`🕑 Executing checkTimeline @ ${new Date().toUTCString()}`);
    const { embeds } = await getUpdatedTimeline();
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
