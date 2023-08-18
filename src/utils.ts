import { convert } from "html-to-text";
import scriptags from "striptags";

const options = {
  wordwrap: null,
  ignoreHref: true,
  ignoreImage: true,
};

const htmlToText = (html: string) => convert(html, options);

export const formatHtmlText = (html: string) => htmlToText(scriptags(html, [], ""));

export const shorten = (text: string, width: number, placeholder: string = "..."): string => {
  if (text.length <= width) {
    return text;
  }
  return text.substring(0, width - placeholder.length) + placeholder;
};

export const properLink = (link: string) => {
  if (link.startsWith("//")) {
    return "https:" + link;
  }
  return link;
};
