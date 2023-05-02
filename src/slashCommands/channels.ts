import { ChannelType, SlashCommandBuilder } from "discord.js";
import { updateGuildOptions } from "../functions";
import { SlashCommand } from "../types";

const command: SlashCommand = {
  command: new SlashCommandBuilder()
    .setName("channels")
    .setDescription("Set channel IDs for the bot.")
    .addStringOption((option) => {
      return option
        .setName("news")
        .setDescription("ID of the news channel.");
    })
    .addStringOption((option) => {
      return option
        .setName("timeline")
        .setDescription("ID of the hero timeline channel.");
    })
    .addStringOption((option) => {
      return option
        .setName("chest")
        .setDescription("ID of the chest channel.");
    }),
  execute: async (interaction) => {
    try {
      if (interaction.channel?.type === ChannelType.DM) return;
      if (!interaction.options.data.length) return interaction.reply({ content: "No options were provided." });
      const update: any = {};
      for (let i = 0; i < interaction.options.data.length; i++) {
        const element = interaction.options.data[i];
        if (element.name && element.value) update[`options.${element.name}ChannelID`] = element.value;
      }
      await updateGuildOptions(interaction.guild, update);
      return interaction.reply({ content: "Channel IDs were updated." });
    } catch (error) {
      interaction.reply({ content: "Something went wrong..." });
    }
  },
  cooldown: 10,
};

export default command;
