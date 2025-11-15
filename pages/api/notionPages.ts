import { NextApiRequest, NextApiResponse } from "next";
import { Client } from "@notionhq/client";
import { BlockObjectResponse } from "@notionhq/client/build/src/api-endpoints";

// Initialize Notion client
const notion = new Client({ auth: process.env.NOTION_API_KEY });

// Your Notion page IDs
const PAGE_IDS = [
  "2acdb2816d9b8094af87e21371d1ee7b",
  "2acdb2816d9b8095ac4ddacc723724d8",
  "2acdb2816d9b804e98aed426c5636f7b",
  "2acdb2816d9b80d2b129dcdd772d29ed",
  "2acdb2816d9b804fa438ca58c6cc5467",
];

type NotionPost = {
  id: number | null;
  title: string;
  img: string;
  text: string;
  date: string;
  author: string;
  pageId: string;
};

// Helper to parse "key: value" from a string
const parseBlockContent = (content: string): { key: string; value: string } | null => {
  const match = content.match(/^(\w+):\s*"?(.*?)"?$/);
  if (!match) return null;
  return { key: match[1].trim(), value: match[2].trim() };
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<NotionPost[] | { error: string }>
) {
  try {
    const data: NotionPost[] = [];

    for (const pageId of PAGE_IDS) {
      const response = await notion.blocks.children.list({
        block_id: pageId,
        page_size: 50,
      });

      const blocks = response.results.slice(0, 6) as BlockObjectResponse[];

      const post: NotionPost = {
        id: null,
        title: "",
        img: "",
        text: "",
        date: "",
        author: "",
        pageId,
      };

      blocks.forEach((block) => {
        if (block.type === "paragraph" && "paragraph" in block && block.paragraph.rich_text.length > 0) {
          const content = block.paragraph.rich_text.map((t) => t.plain_text).join("");
          const kv = parseBlockContent(content);
          if (!kv) return;

          switch (kv.key.toLowerCase()) {
            case "id":
              post.id = parseInt(kv.value, 10) || null;
              break;
            case "title":
              post.title = kv.value;
              break;
            case "img":
              // remove HTML tags if present
              post.img = kv.value.replace(/<[^>]+>/g, "");
              break;
            case "text":
              post.text = kv.value;
              break;
            case "date":
              post.date = kv.value;
              break;
            case "author":
              post.author = kv.value;
              break;
            default:
              break;
          }
        }
      });

      data.push(post);
    }

    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch Notion pages" });
  }
}
