import chalk from "chalk";
import {
  BaseMessageOptions,
  Guild,
  GuildMember,
  PermissionFlagsBits,
  PermissionResolvable,
  TextChannel,
} from "discord.js";
import mongoose from "mongoose";
import { Attribute } from "./helpers/types";
import GuildDB from "./schemas/Guild";
import PersistanceDB from "./schemas/Persistance";
import { GuildOption, PersistanceOption } from "./types";
type colorType = "text" | "variable" | "error";

const themeColors = {
  text: "#ff8e4d",
  variable: "#ff624d",
  error: "#f5426c",
};

const attributeColors = {
  dark: "#BA43B7",
  fire: "#E74933",
  ice: "#27B8FF",
  light: "#FFCE45",
  wind: "#95D02E",
};

export const getThemeColor = (color: colorType) => Number(`0x${themeColors[color].substring(1)}`);

export const getColorFromAttribute = (attribute: Attribute): string => {
  return attributeColors[attribute];
};

export const color = (color: colorType, message: any) => {
  return chalk.hex(themeColors[color])(message);
};

export const toTitleCase = (text: string): string => {
  return text.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
};

export const getUnixTimestamp = (date: Date | string) => {
  const inputDate = typeof date === "string" ? new Date(date) : date;
  return inputDate.getTime() / 1000;
};

export const checkPermissions = (member: GuildMember, permissions: Array<PermissionResolvable>) => {
  let neededPermissions: PermissionResolvable[] = [];
  permissions.forEach((permission) => {
    if (!member.permissions.has(permission)) neededPermissions.push(permission);
  });
  if (neededPermissions.length === 0) return null;
  return neededPermissions.map((p) => {
    if (typeof p === "string") return p.split(/(?=[A-Z])/).join(" ");
    else
      return Object.keys(PermissionFlagsBits)
        .find((k) => Object(PermissionFlagsBits)[k] === p)
        ?.split(/(?=[A-Z])/)
        .join(" ");
  });
};

export const sendTimedMessage = (message: string, channel: TextChannel, duration: number) => {
  channel.send(message).then((m) => setTimeout(async () => (await channel.messages.fetch(m)).delete(), duration));
  return;
};

export const getGuildOption = async (guild: Guild, option: GuildOption) => {
  if (mongoose.connection.readyState === 0) throw new Error("Database not connected.");
  let foundGuild = await GuildDB.findOne({ guildID: guild.id });
  if (!foundGuild) return null;
  return foundGuild.options[option];
};

export const setGuildOption = async (guild: Guild, option: GuildOption, value: any) => {
  if (mongoose.connection.readyState === 0) throw new Error("Database not connected.");
  let foundGuild = await GuildDB.findOne({ guildID: guild.id });
  if (!foundGuild) return null;
  foundGuild.options[option] = value;
  await foundGuild.save();
};

export const getPersistance = async () => {
  if (mongoose.connection.readyState === 0) throw new Error("Database not connected.");
  console.log("ℹ️ Accesing Database: for persistance options");
  let foundPersistance = await PersistanceDB.find().exec();
  if (!foundPersistance) return null;
  return foundPersistance[0];
};

export const setPersistanceOption = async (option: PersistanceOption, value: any) => {
  if (mongoose.connection.readyState === 0) throw new Error("Database not connected.");
  let foundPersistance = await PersistanceDB.find().exec();
  if (!foundPersistance) return null;
   // @ts-ignore
  foundPersistance[0][option] = value;
  await foundPersistance[0].save();
};

export const updateGuildOptions = async (guild: Guild | null, fieldsToUpdate: any) => {
  if (mongoose.connection.readyState === 0) throw new Error("Database not connected.");
  if (!guild) return null;
  return await GuildDB.findOneAndUpdate({ guildID: guild.id }, { $set: fieldsToUpdate }, { new: true });
};

// Define a reusable function to send messages to a channel
export const sendMessageToChannel = async (
  guild: Guild,
  channelOptionName: GuildOption,
  message: BaseMessageOptions
) => {
  const channelID = await getGuildOption(guild, channelOptionName);
  if (!channelID) return;
  const channel = guild.channels.cache.get(channelID) as TextChannel;
  if (!channel) return;

  if (message.embeds) {
    const chunkedEmbeds = chunkArray(message.embeds, 10);
    for (const chunk of chunkedEmbeds) {
      await channel.send({ ...message, embeds: chunk }); // send each chunk in a separate message
    }
  } else {
    await channel.send(message);
  }
};

// Helper function to split an array into chunks
function chunkArray<T>(array: T[], size: number) {
  return Array.from({ length: Math.ceil(array.length / size) }, (_, i) => array.slice(i * size, i * size + size));
}
