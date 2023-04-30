import chalk from "chalk";
import {
  BaseMessageOptions,
  Guild,
  GuildMember,
  PermissionFlagsBits,
  PermissionResolvable,
  PermissionsBitField,
  TextChannel,
} from "discord.js";
import GuildDB from "./schemas/Guild";
import PersistanceDB from "./schemas/Persistance";
import { GuildOption } from "./types";
import mongoose from "mongoose";
import { PersistanceOption } from "./types";

type colorType = "text" | "variable" | "error";

const themeColors = {
  text: "#ff8e4d",
  variable: "#ff624d",
  error: "#f5426c",
};

export const getThemeColor = (color: colorType) => Number(`0x${themeColors[color].substring(1)}`);

export const color = (color: colorType, message: any) => {
  return chalk.hex(themeColors[color])(message);
};

export const shorten = (text: string, width: number, placeholder: string = "..."): string => {
  if (text.length <= width) {
    return text;
  }
  return text.substring(0, width - placeholder.length) + placeholder;
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
  foundGuild.save();
};

export const getPersistanceOption = async (option: PersistanceOption) => {
  if (mongoose.connection.readyState === 0) throw new Error("Database not connected.");
  let foundPersistance = await PersistanceDB.find();
  if (!foundPersistance) return null;
  return foundPersistance[0][option];
};

export const setPersistanceOption = async (option: PersistanceOption, value: never) => {
  if (mongoose.connection.readyState === 0) throw new Error("Database not connected.");
  let foundPersistance = await PersistanceDB.find();
  if (!foundPersistance) return null;
  foundPersistance[0][option] = value;
  foundPersistance[0].save();
};

// Define a reusable function to send messages to a channel
export const sendMessageToChannel = async (
  guild: Guild,
  channelOptionName: GuildOption,
  messages: BaseMessageOptions
) => {
  const channelID = await getGuildOption(guild, channelOptionName);
  if (!channelID) return;
  const channel = guild.channels.cache.get(channelID) as TextChannel;
  if (!channel) return;
  await channel.send(messages);
};
