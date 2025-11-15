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
};

// Helper function to parse paragraph content
const parseParagraph = (blocks: BlockObjectResponse[]): NotionPost => {
  const result: NotionPost = { id: null, title: "", img: "", text: "" };

  blocks.forEach((block) => {
    if (block.type === "paragraph" && block.paragraph.rich_text.length > 0) {
      const content = block.paragraph.rich_text
        .map((rt) => rt.plain_text)
        .join("");

      // Extract fields using regex
      const idMatch = content.match(/id:\s*(\d+)/);
      const titleMatch = content.match(/title:\s*"(.+?)"/);
      const imgMatch = content.match(/img:\s*"(.+?)"/);
      const textMatch = content.match(/text:\s*"([\s\S]+?)"$/); // [\s\S] handles multiline

      if (idMatch) result.id = parseInt(idMatch[1]);
      if (titleMatch) result.title = titleMatch[1];
      if (imgMatch) result.img = imgMatch[1];
      if (textMatch) result.text = textMatch[1];
    }
  });

  return result;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<NotionPost[] | { error: string }>
) {
  try {
    const data: NotionPost[] = [];

    for (const pageId of PAGE_IDS) {
      // Get blocks of the page
      const response = await notion.blocks.children.list({
        block_id: pageId,
        page_size: 50,
      });

      const parsed = parseParagraph(response.results as BlockObjectResponse[]);

      // Only add if id exists
      if (parsed.id !== null) data.push(parsed);
    }

    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch Notion pages" });
  }
}
