import axios from "axios";
import { parse } from "node-html-parser";
import { EmbedBuilder } from "discord.js";
import { ArticleInfoResponse, ArticleListResponse } from "./types";
import { getPersistanceOption, setPersistanceOption, shorten } from "../functions";

interface Article {
  title: string;
  id: string;
  previewImg: string;
  description: string;
}

const defaultThumbnail = "https://cdn.discordapp.com/embed/avatars/1.png";

export async function checkArticles() {
  let embeds: EmbedBuilder[] = [];
  let chestMessages: string = "";

  const { data } = await axios.post<ArticleListResponse>(
    "https://api.onstove.com/cafe/v1/ArticleList",
    ARTICLES_STOVE_API
  );

  const fetchedArticles = data.context.article_list
    .map((article) => {
      const { title, card_no, preview_url, content } = article;
      return {
        title: `🔥🔥 ${title}`,
        id: card_no,
        previewImg: preview_url || defaultThumbnail,
        description: shorten(content, 200),
      };
    })
    .reverse();

  const currentIDs = (await getPersistanceOption("articleIDs")) || []; // from database
  const fetchedIds = fetchedArticles.map((article) => article.id); // from request

  const hasChanged = !fetchedIds.every((item) => currentIDs.includes(item));
  console.log(hasChanged ? "✅ New articles found" : "❎ No articles found");
  if (!hasChanged) return { embeds, chestMessages };
  for (let i = 0; i < fetchedIds.length; i++) {
    if (currentIDs.includes(fetchedIds[i])) continue;
    currentIDs.push(fetchedIds[i]);

    const newPost = fetchedArticles.find((article) => article.id === fetchedIds[i]) as Article;

    const newEmbed = new EmbedBuilder()
      .setTitle(newPost.title)
      .setDescription(newPost.description)
      .setURL(`https://page.onstove.com/epicseven/es/view/${newPost.id}`)
      .setThumbnail(newPost.previewImg)
      .setColor("#7DD321");

    embeds.push(newEmbed);

    // Check if post is about chest password
    if (!newPost.title.toLowerCase().includes("contraseña del cofre de regalo")) continue;

    const body = {
      cafe_key: "epicseven",
      card_no: fetchedIds[i],
      channel_key: "es",
    };

    const { data } = await axios.post<ArticleInfoResponse>("https://api.onstove.com/cafe/v1/ArticleInfo", body);
    const password = parse(data.context.content).querySelectorAll("td")[5].text;
    chestMessages = `@everyone:\t ✨ ${password} ✨`;
  }
  setPersistanceOption("articleIDs", fetchedIds as never);

  return { embeds, chestMessages };
}

const ARTICLES_STOVE_API = {
  cafe_key: "epicseven",
  channel_key: "es",
  board_key: "e7es001",
  page: 1,
  size: 16,
  display_opt: "usertag_on,html_remove",
  direction: "latest",
  notice_type: "Y",
};
