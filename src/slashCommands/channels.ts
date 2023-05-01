import { SlashCommandBuilder, ChannelType, TextChannel, EmbedBuilder, ColorResolvable, ApplicationCommandChoicesData } from "discord.js"
import { SlashCommand } from "../types";

const command: SlashCommand = {
  command: new SlashCommandBuilder()
    .setName("channels")
    .setDescription("Set channel IDs for the bot.")
    .addStringOption(option => {
      return option
        .setName("news")
        .setDescription("ID of the news channel.")
    })
    .addStringOption(option => {
      return option
        .setName("timeline")
        .setDescription("ID of the hero timeline channel.")
    })
    .addStringOption(option => {
      return option
        .setName("chest")
        .setDescription("ID of the chest channel.")
    })
  ,
  autocomplete: async (interaction) => {
    try {
      const focusedValue = interaction.options.getFocused();
      const choices = [
        { name: "White", value: "White" },
        { name: "Aqua", value: "Aqua" },
        { name: "Green", value: "Green" },
        { name: "Blue", value: "Blue" },
        { name: "Yellow", value: "Yellow" },
        { name: "Purple", value: "Purple" },
        { name: "LuminousVividPink", value: "LuminousVividPink" },
        { name: "Fuchsia", value: "Fuchsia" },
        { name: "Gold", value: "Gold" },
        { name: "Orange", value: "Orange" },
        { name: "Red", value: "Red" },
        { name: "Grey", value: "Grey" },
        { name: "Navy", value: "Navy" },
        { name: "DarkAqua", value: "DarkAqua" },
        { name: "DarkGreen", value: "DarkGreen" },
        { name: "DarkBlue", value: "DarkBlue" },
        { name: "DarkPurple", value: "DarkPurple" },
        { name: "DarkVividPink", value: "DarkVividPink" },
        { name: "DarkGold", value: "DarkGold" },
        { name: "DarkOrange", value: "DarkOrange" },
        { name: "DarkRed", value: "DarkRed" },
        { name: "DarkGrey", value: "DarkGrey" },
        { name: "DarkerGrey", value: "DarkerGrey" },
        { name: "LightGrey", value: "LightGrey" },
        { name: "DarkNavy", value: "DarkNavy" }
      ];
      let filtered: { name: string, value: string }[] = []
      for (let i = 0; i < choices.length; i++) {
        const choice = choices[i];
        if (choice.name.includes(focusedValue)) filtered.push(choice);
      }
      await interaction.respond(
        filtered
      );
    } catch (error) {
      console.log(`Error: ${error.message}`)
    }
  },
  execute: async (interaction) => {
    try {
      await interaction.deferReply({ ephemeral: true });
      const options: { [key: string]: string | number | boolean } = {};
      if (!interaction.options) return interaction.editReply({ content: "Something went wrong..." });
      for (let i = 0; i < interaction.options.data.length; i++) {
        const element = interaction.options.data[i];
        if (element.name && element.value) options[element.name] = element.value;
      }
      const embed = new EmbedBuilder()
        .setColor(options.color.toString() as ColorResolvable)
        .setTitle(options.title.toString())
        .setDescription(options.description.toString())
        .setAuthor({ name: interaction.client.user?.username || 'Default Name', iconURL: interaction.client.user?.avatarURL() || undefined })
        .setThumbnail(interaction.client.user?.avatarURL() || null)
        .setTimestamp()
        .setFooter({ text: "Sent by " + interaction.user?.username || "*", iconURL: interaction.user?.avatarURL() || undefined });
      let selectedTextChannel = interaction.channel?.client.channels.cache.get(options.channel.toString()) as TextChannel
      selectedTextChannel.send({ embeds: [embed] });
      return interaction.editReply({ content: "Embed message successfully sent." })
    } catch (error) {
      interaction.editReply({ content: "Something went wrong..." });
    }

  },
  cooldown: 10
}

export default command