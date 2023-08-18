import axios from "axios";
import { EmbedBuilder } from "discord.js";
import { getPersistance, setPersistanceOption } from "../functions";
import { IPersistance } from "../types";
import type { ArticleInfoResponse } from "./types";
import { formatHtmlText, properLink, shorten } from "../utils";

interface Article {
  title: string;
  id: string;
  previewImg: string;
  description: string;
}

const DEFAULT_THUMBNAIL = "https://cdn.discordapp.com/embed/avatars/1.png";

const BASE_API_URL =
  "https://api.onstove.com/cwms/v1.0/channel/144/article_group/FIXED_ARTICLE/article/list?article_group_seq_list=1240&content_yn=Y";

let cachedIDs: Set<string> = new Set();

export async function getUpdatedNews() {
  const { data } = await axios.get<ArticleInfoResponse>(BASE_API_URL);

  const fetchedArticles: Article[] = data.value[0].list
    .map((article) => {
      const { title, article_id, media_thumbnail_url, content } = article;
      return {
        title: `🔥🔥 ${title}`,
        id: article_id,
        previewImg: media_thumbnail_url ? properLink(media_thumbnail_url) : DEFAULT_THUMBNAIL,
        description: shorten(formatHtmlText(content), 200),
      };
    })
    .reverse();

  if (cachedIDs.size === 0) {
    const persistedData = (await getPersistance()) as IPersistance;
    cachedIDs = new Set(persistedData?.articleIDs || []);
  }

  const fetchedIds = fetchedArticles.map((article) => article.id);

  const newIds = fetchedIds.filter((id) => !cachedIDs.has(id));

  // console.log({ cachedIDs, fetchedIds, newIds });

  let embeds: EmbedBuilder[] = [];

  if (newIds.length === 0) return { embeds };

  for (const newId of newIds) {
    const newPost = fetchedArticles.find((article) => article.id === newId) as Article;

    const newEmbed = new EmbedBuilder({
      title: newPost.title,
      url: `https://page.onstove.com/epicseven/es/view/${newPost.id}`,
      description: newPost.description,
      thumbnail: {
        url: newPost.previewImg,
      },
    }).setColor("#7DD321");

    embeds.push(newEmbed);
    cachedIDs.add(newId);
  }

  await setPersistanceOption("articleIDs", Array.from(cachedIDs));

  return { embeds };
}
