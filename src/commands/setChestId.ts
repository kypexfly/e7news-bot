import { setGuildOption } from "../functions";
import { Command } from "../types";

const command: Command = {
  name: "setChestId",
  execute: (message, args) => {
    let chestId = args[1];
    if (!chestId) return message.channel.send("No id provided");
    if (!message.guild) return;
    setGuildOption(message.guild, "chestChannelID", chestId);
    message.channel.send("Chest channel id successfully changed!");
  },
  permissions: ["Administrator"],
  aliases: [],
};

export default command;
