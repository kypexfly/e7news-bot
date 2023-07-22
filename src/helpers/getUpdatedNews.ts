import axios from "axios";
import { EmbedBuilder } from "discord.js";
import { getPersistance, setPersistanceOption } from "../functions";
import { IPersistance } from "../types";
import type { ArticleInfoResponse } from "./types";

interface Article {
  title: string;
  id: string;
  previewImg: string;
}

const DEFAULT_THUMBNAIL = "https://cdn.discordapp.com/embed/avatars/1.png";
const BASE_API_URL = "https://api.onstove.com/cwms/v1.0/channel/144/article_group/FIXED_ARTICLE/article/list";

let currentIDs: string[] = [];

export async function getUpdatedNews() {
  let embeds: EmbedBuilder[] = [];
  let chestMessages: string = "";

  const { data } = await axios.get<ArticleInfoResponse>(BASE_API_URL);

  const fetchedArticles: Article[] = data.value[0].list
    .map((article) => {
      const { title, article_id, media_thumbnail_url } = article;
      return {
        title: `🔥🔥 ${title}`,
        id: article_id,
        previewImg: media_thumbnail_url || DEFAULT_THUMBNAIL,
      };
    })
    .reverse();

  if (!currentIDs.length) {
    currentIDs = ((await getPersistance()) as IPersistance)?.articleIDs || [];
  }

  const fetchedIds = fetchedArticles.map((article) => article.id); // from request
  console.log("currentIDs:", currentIDs);
  console.log("fetchedIds:", fetchedIds);

  const hasChanged = !fetchedIds.every((item) => currentIDs.includes(item));
  console.log(hasChanged ? "✅ New articles found" : "❎ No articles found");
  if (!hasChanged) return { embeds, chestMessages };
  for (let i = 0; i < fetchedIds.length; i++) {
    if (currentIDs.includes(fetchedIds[i])) continue;

    currentIDs.push(fetchedIds[i]);

    const newPost = fetchedArticles.find((article) => article.id === fetchedIds[i]) as Article;

    const newEmbed = new EmbedBuilder()
      .setTitle(newPost.title)
      .setURL(`https://page.onstove.com/epicseven/es/view/${newPost.id}`)
      .setThumbnail(newPost.previewImg)
      .setColor("#7DD321");

    embeds.push(newEmbed);
  }

  setPersistanceOption("articleIDs", fetchedIds as never);

  return { embeds, chestMessages };
}
