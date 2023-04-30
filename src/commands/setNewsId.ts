import { setGuildOption } from "../functions";
import { Command } from "../types";

const command: Command = {
    name: "setNewsId",
    execute: (message, args) => {
        let newsId = args[1]
        if (!newsId) return message.channel.send("No id provided")
        if (!message.guild) return;
        setGuildOption(message.guild, "newsChannelID", newsId)
        message.channel.send("News channel id successfully changed!")
    },
    permissions: ["Administrator"],
    aliases: []
}

export default command