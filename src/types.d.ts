import {
  SlashCommandBuilder,
  CommandInteraction,
  Collection,
  PermissionResolvable,
  Message,
  AutocompleteInteraction,
} from "discord.js";
import mongoose from "mongoose";

export interface SlashCommand {
  command: SlashCommandBuilder | any;
  execute: (interaction: CommandInteraction) => void;
  autocomplete?: (interaction: AutocompleteInteraction) => void;
  cooldown?: number; // in seconds
}

export interface Command {
  name: string;
  execute: (message: Message, args: Array<string>) => void;
  permissions: Array<PermissionResolvable>;
  aliases: Array<string>;
  cooldown?: number;
}

interface GuildOptions {
  prefix: string;
  newsChannelID: string;
  chestChannelID: string;
  timelineChannelID: string;
}

export interface IGuild extends mongoose.Document {
  guildID: string;
  options: GuildOptions;
  joinedAt: Date;
}

export interface IPersistance extends mongoose.Document {
  articleIDs: string[];
  lastCovenant: number;
  lastMystic: number;
}

export type PersistanceOption = keyof IPersistance;

export type GuildOption = keyof GuildOptions;
export interface BotEvent {
  name: string;
  once?: boolean | false;
  execute: (...args) => void;
}

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      TOKEN: string;
      CLIENT_ID: string;
      PREFIX: string;
      NEWS_CHECK_CRON: string;
      TIMELINE_CHECK_CRON: string;
      MONGO_URI: string;
      MONGO_DATABASE_NAME: string;
    }
  }
}

declare module "discord.js" {
  export interface Client {
    slashCommands: Collection<string, SlashCommand>;
    commands: Collection<string, Command>;
    cooldowns: Collection<string, number>;
  }
}
