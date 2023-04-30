import { Client, TextChannel } from "discord.js";
import { getGuildOption } from "../functions";

async function discordTest(client: Client) {
  const interval = 1 * 60 * 1000; // 5 minutes in millisecond
  setInterval(() => {
    client.guilds.cache.forEach(async (guild) => {
      const newsChannelID = await getGuildOption(guild, "newsChannelID");
      if (!newsChannelID) return;
      const channel = guild.channels.cache.get(newsChannelID) as TextChannel;
      if (!channel) return;

      try {
        await channel.send("Yess!");
      } catch (error) {
        console.log(error);
      }
    });
  }, interval);
}
