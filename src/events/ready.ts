import { Client } from "discord.js";
import { color } from "../functions";
import { BotEvent } from "../types";
import { checkTimeline } from "../tasks/checkTimeline";
import { checkNews } from "../tasks/checkNews";

const event: BotEvent = {
  name: "ready",
  once: true,
  execute: async (client: Client) => {
    console.log(color("text", `💪 Logged in as ${color("variable", client.user?.tag)}`));

    // Run tasks on startup
    await checkNews(client);
    await checkTimeline(client);
  },
};

export default event;
