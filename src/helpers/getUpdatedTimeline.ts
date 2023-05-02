import axios from "axios";
import { ColorResolvable, EmbedBuilder } from "discord.js";
import {
  getColorFromAttribute,
  getPersistance,
  getUnixTimestamp,
  setPersistanceOption,
  toTitleCase,
} from "../functions";
import { Hero, HeroDatabase, HeroTimeline } from "./types";
import { IPersistance } from "../types";

// last convenant and mystic dont need to be cached because it runs one time every 24 hours
export async function getUpdatedTimeline() {
  let { lastCovenant, lastMystic } = (await getPersistance()) as IPersistance;

  const embeds: EmbedBuilder[] = [];
  const getHeroById = (id: string) => {
    return heroes[id];
  };

  const { data: heroes } = await axios.get<HeroDatabase>(
    "https://raw.githubusercontent.com/CeciliaBot/CeciliaBot.github.io/master/data/HeroDatabase.json"
  );
  const { data: covenants } = await axios.get<HeroTimeline[]>(
    "https://raw.githubusercontent.com/CeciliaBot/CeciliaBot.github.io/master/data/timeline/covenant.json"
  );
  const { data: mystics } = await axios.get<HeroTimeline[]>(
    "https://raw.githubusercontent.com/CeciliaBot/CeciliaBot.github.io/master/data/timeline/mystic.json"
  );

  if (!(lastCovenant === covenants.length - 1)) {
    for (let i = lastCovenant + 1; i < covenants.length; i++) {
      if (covenants[i].c) {
        covenants[i].c.forEach((hero) => {
          const heroData = getHeroById(hero.id);
          embeds.push(createHeroEmbed(heroData, covenants[i]));
        });
      } else {
        embeds.push(createHeroEmbed(null, covenants[i]));
      }
      ++lastCovenant;
    }
    setPersistanceOption("lastCovenant", lastCovenant as never);
  }

  if (!(lastMystic === mystics.length - 1)) {
    for (let i = lastMystic + 1; i < mystics.length; i++) {
      if (mystics[i].c) {
        mystics[i].c.forEach((hero) => {
          const heroData = getHeroById(hero.id);
          embeds.push(createHeroEmbed(heroData, mystics[i]));
        });
      } else {
        embeds.push(createHeroEmbed(null, mystics[i]));
      }
      ++lastMystic;
    }
    setPersistanceOption("lastMystic", lastMystic as never);
  }

  return { embeds };
}

const createHeroEmbed = (hero: Hero | null, timeline: HeroTimeline) => {
  /**
   * There are two types of banners:
   * With heroes
   * Without heroes: these are Custom Banners which don't have a hero or thumbnail
   */
  const { name: nameBanner, dt, type } = timeline;
  const isCustomBanner = !timeline.c || !hero;
  const embed = new EmbedBuilder()
    .setTitle(isCustomBanner ? nameBanner ?? null : hero.name)
    .setDescription(
      (isCustomBanner ? "" : `${hero.rarity} ★ `) +
        (isCustomBanner ? "" : `${toTitleCase(hero.role)}\n`) +
        `${toTitleCase(type)} Summons\n` +
        `<t:${getUnixTimestamp(dt[0].toString())}:f>\n` +
        `<t:${getUnixTimestamp(dt[1].toString())}:f>\n`
    )
    .setColor(isCustomBanner ? "#C3C3C3" : (getColorFromAttribute(hero.attribute) as ColorResolvable))
    .setThumbnail(
      isCustomBanner ? null : `https://res.cloudinary.com/ceciliabot/image/upload/epic-seven/face/${hero.id}_s.png`
    );

  return embed;
};
