import type { NextApiRequest, NextApiResponse } from "next";
import { Client } from "@notionhq/client";
import { BlockObjectResponse, PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";

const notion = new Client({ auth: process.env.NOTION_API_KEY });

// Type-safe representation of a Notion title property
type NotionTitleProperty = {
  type: "title";
  title: { plain_text: string }[];
};

// Generic Notion properties map
type NotionProperties = {
  [key: string]: NotionTitleProperty | unknown; // other property types can be unknown
};

// Recursive function to fetch blocks and their children
async function fetchBlocks(blockId: string): Promise<BlockObjectResponse[]> {
  const allBlocks: BlockObjectResponse[] = [];
  let cursor: string | undefined = undefined;

  do {
    const res = await notion.blocks.children.list({
      block_id: blockId,
      start_cursor: cursor,
      page_size: 50,
    });

    // Type assertion to BlockObjectResponse[]
    allBlocks.push(...(res.results as BlockObjectResponse[]));
    cursor = res.next_cursor ?? undefined;
  } while (cursor);

  // Recursively fetch children for blocks that have children
  for (const block of allBlocks) {
    if (block.has_children) {
      const children = await fetchBlocks(block.id);
      // Safely attach children
      (block as BlockObjectResponse & { children?: BlockObjectResponse[] }).children = children;
    }
  }

  return allBlocks;
}

// Helper: find first child_page block and fetch its title + content
async function findInnerPageContent(pageId: string) {
  const topBlocks = await fetchBlocks(pageId);

  const childPageBlock = topBlocks.find((b) => b.type === "child_page");
  if (!childPageBlock || childPageBlock.type !== "child_page") return null;

  const innerPageId = childPageBlock.id;

  // Fetch page metadata
  const innerPage = await notion.pages.retrieve({ page_id: innerPageId }) as PageObjectResponse;

  // Extract title safely
  let title = "Untitled";
  if ("properties" in innerPage) {
    const properties = innerPage.properties as NotionProperties;

    const titleProp = properties.title as NotionTitleProperty | undefined;
    if (titleProp?.type === "title" && titleProp.title.length > 0) {
      title = titleProp.title[0].plain_text;
    }
  }

  const innerPageBlocks = await fetchBlocks(innerPageId);

  return {
    id: innerPageId,
    title,
    blocks: innerPageBlocks,
  };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { pageId } = req.query;

  if (!pageId || typeof pageId !== "string") {
    return res.status(400).json({ error: "Missing pageId query parameter" });
  }

  try {
    const innerContent = await findInnerPageContent(pageId);

    if (!innerContent) {
      return res.status(404).json({ error: "No inner page found" });
    }

    res.status(200).json(innerContent);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch inner page content" });
  }
}
