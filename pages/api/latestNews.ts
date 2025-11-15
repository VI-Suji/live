import type { NextApiRequest, NextApiResponse } from "next";
import { Client } from "@notionhq/client";
import { BlockObjectResponse, RichTextItemResponse } from "@notionhq/client/build/src/api-endpoints";

const notion = new Client({ auth: process.env.NOTION_API_KEY });
const PAGE_ID = "2acdb2816d9b806da2baf83293c16344";

type NewsData = {
  date: string;
  heading: string;
  content: string;
};

type ErrorData = { error: string };

export default async function handler(
  _req: NextApiRequest,
  res: NextApiResponse<NewsData | ErrorData>
) {
  try {
    // Fetch blocks from Notion page
    const blocksRes = await notion.blocks.children.list({ block_id: PAGE_ID });
    const blocks: BlockObjectResponse[] = blocksRes.results as BlockObjectResponse[];

    // Combine all paragraph text into one string
    const rawText = blocks
      .map((block) => {
        if (block.type === "paragraph") {
          const richText: RichTextItemResponse[] = block.paragraph.rich_text;
          return richText.map((t) => t.plain_text).join("");
        }
        return "";
      })
      .filter(Boolean)
      .join("\n");

    // Parse date, heading, and content using regex
    const dateMatch = rawText.match(/Date\s*:\s*(.*)/);
    const headingMatch = rawText.match(/Heading\s*:\s*(.*)/);
    const contentMatch = rawText.match(/Content\s*:\s*([\s\S]*)/);

    const date = dateMatch ? dateMatch[1].trim() : "";
    const heading = headingMatch ? headingMatch[1].trim() : "";
    const content = contentMatch ? contentMatch[1].trim() : "";

    res.status(200).json({ date, heading, content });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch or parse Notion page" });
  }
}
