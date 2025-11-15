"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { FaCalendarAlt, FaUser } from "react-icons/fa";

// ------------------- TYPES -------------------

type Annotation = {
  bold: boolean;
  italic: boolean;
  strikethrough: boolean;
  underline: boolean;
  code: boolean;
  color: string;
};

type RichText = {
  plain_text: string;
  href?: string;
  annotations: Annotation;
};

type ParagraphBlock = {
  id: string;
  type: "paragraph";
  paragraph: { rich_text: RichText[] };
};

type Heading1Block = {
  id: string;
  type: "heading_1";
  heading_1: { rich_text: RichText[] };
};

type Heading2Block = {
  id: string;
  type: "heading_2";
  heading_2: { rich_text: RichText[] };
};

type Heading3Block = {
  id: string;
  type: "heading_3";
  heading_3: { rich_text: RichText[] };
};

type BulletedListItemBlock = {
  id: string;
  type: "bulleted_list_item";
  bulleted_list_item: { rich_text: RichText[] };
};

type NumberedListItemBlock = {
  id: string;
  type: "numbered_list_item";
  numbered_list_item: { rich_text: RichText[] };
};

type QuoteBlock = {
  id: string;
  type: "quote";
  quote: { rich_text: RichText[] };
};

type CodeBlock = {
  id: string;
  type: "code";
  code: { rich_text: RichText[] };
};

type DividerBlock = {
  id: string;
  type: "divider";
};

type ImageBlock = {
  id: string;
  type: "image";
  image:
  | { type: "external"; external: { url: string } }
  | { type: "file"; file: { url: string } };
};

type CalloutBlock = {
  id: string;
  type: "callout";
  callout: { rich_text: RichText[]; icon?: { emoji: string } };
};

type Block =
  | ParagraphBlock
  | Heading1Block
  | Heading2Block
  | Heading3Block
  | BulletedListItemBlock
  | NumberedListItemBlock
  | QuoteBlock
  | CodeBlock
  | DividerBlock
  | ImageBlock
  | CalloutBlock;

type NotionPage = {
  id: string;
  title: string;
  blocks: Block[];
};

type BlogPostProps = {
  pageId: string;
  date?: string;
  author?: string;
};

// ------------------- RENDER RICHTEXT -------------------

function renderRichText(richText: RichText[]) {
  return richText.map((text, idx) => {
    const { bold, italic, strikethrough, underline, code, color } = text.annotations;
    let classes = "";

    if (bold) classes += " font-bold";
    if (italic) classes += " italic";
    if (strikethrough) classes += " line-through";
    if (underline) classes += " underline";
    if (code) classes += " font-mono bg-gray-100/50 px-1 rounded-sm";

    const style = color !== "default" ? { color } : undefined;

    if (text.href) {
      return (
        <a
          key={idx}
          href={text.href}
          target="_blank"
          rel="noopener noreferrer"
          className={classes + " text-blue-600 hover:underline"}
          style={style}
        >
          {text.plain_text}
        </a>
      );
    }

    return (
      <span key={idx} className={classes} style={style}>
        {text.plain_text}
      </span>
    );
  });
}

// ------------------- BLOG POST COMPONENT -------------------

export default function BlogPost({ pageId, author, date }: BlogPostProps) {
  const [pageData, setPageData] = useState<NotionPage | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPage() {
      try {
        const res = await fetch(`/api/eachNotionPage?pageId=${pageId}`);
        const data: NotionPage = await res.json();
        setPageData(data);
      } catch (err) {
        console.error("Failed to fetch page:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchPage();
  }, [pageId]);

  if (loading) {
    return (
      <div className="bg-[#f8f8f8] w-full flex justify-center items-center min-h-[80vh]">
        <div className="animate-pulse w-11/12 md:w-2/3 lg:w-1/2 bg-white/10 backdrop-blur-md rounded-xl shadow-lg p-6 space-y-4">
          <div className="h-64 bg-gray-300/30 rounded-lg"></div>
          <div className="h-6 w-3/4 bg-gray-300/30 rounded"></div>
          <div className="h-4 w-full bg-gray-300/20 rounded"></div>
          <div className="h-4 w-full bg-gray-300/20 rounded"></div>
          <div className="h-4 w-5/6 bg-gray-300/20 rounded"></div>
          <div className="mt-4 flex gap-4 items-center">
            <div className="h-6 w-32 bg-gray-300/20 rounded"></div>
            <div className="h-6 w-20 bg-gray-300/20 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!pageData) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Failed to load page
      </div>
    );
  }

  const firstImage = pageData.blocks.find((b): b is ImageBlock => b.type === "image");
  const imageUrl =
    firstImage?.image.type === "external" ? firstImage.image.external.url : firstImage?.image.file.url ?? "https://images.unsplash.com/photo-1522199710521-72d69614c702?w=1600&q=80";

  return (
    <div className="min-h-screen bg-[#f8f8f8] text-gray-900 relative">
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="relative w-full h-[360px] rounded-3xl overflow-hidden shadow-2xl mb-10 bg-white/20 backdrop-blur-2xl border border-white/30">
          {imageUrl && (
            <Image
              src={imageUrl}
              alt="Blog"
              fill
              className="object-cover opacity-40"
            />
          )}
          <div className="relative z-10 p-10 flex flex-col justify-end h-full">
            <h1 className="text-xl sm:text-5xl font-extrabold leading-tight drop-shadow-md">{pageData.title}</h1>
            <div className="mt-4 flex items-center gap-6 text-gray-800 font-medium backdrop-blur-md bg-white/40 px-4 py-2 rounded-full shadow-md">
              <span className="flex items-center gap-2"><FaCalendarAlt /> {date || "Unknown Date"}</span>
              <span className="flex items-center gap-2"><FaUser /> {author || "Gramika Team"}</span>
            </div>
          </div>
        </div>

        <article className="flex-1 bg-white/20 backdrop-blur-3xl shadow-xl border border-white/20 rounded-3xl p-10 leading-relaxed text-gray-900 space-y-8">
          {pageData.blocks.map((block) => {
            switch (block.type) {
              case "paragraph":
                return <p className="text-md sm:text-lg text-gray-800" key={block.id}>{renderRichText(block.paragraph.rich_text)}</p>;

              case "heading_1":
                return <h1 className="text-2xl sm:text-4xl font-extrabold text-gray-900 drop-shadow-md" key={block.id}>{block.heading_1.rich_text.map(t => t.plain_text).join("")}</h1>;

              case "heading_2":
                return <h2 className="text-xl sm:text-3xl font-bold text-gray-900 border-l-4 border-blue-400 pl-4" key={block.id}>{block.heading_2.rich_text.map(t => t.plain_text).join("")}</h2>;

              case "heading_3":
                return <h3 className="text-md sm:text-2xl font-semibold text-gray-800" key={block.id}>{block.heading_3.rich_text.map(t => t.plain_text).join("")}</h3>;

              case "bulleted_list_item":
                return <ul className="list-disc list-inside text-gray-700 space-y-1" key={block.id}><li>{block.bulleted_list_item.rich_text.map(t => t.plain_text).join("")}</li></ul>;

              case "numbered_list_item":
                return <ol className="list-decimal list-inside text-gray-700 space-y-1" key={block.id}><li>{block.numbered_list_item.rich_text.map(t => t.plain_text).join("")}</li></ol>;

              case "quote":
                return <blockquote className="border-l-4 border-purple-400 pl-6 italic text-gray-700 bg-white/10 backdrop-blur-md p-4 rounded-lg shadow-sm" key={block.id}>{block.quote.rich_text.map(t => t.plain_text).join("")}</blockquote>;

              case "code":
                return <pre className="bg-gray-100/50 backdrop-blur-md p-4 rounded-xl overflow-x-auto shadow-inner text-gray-900" key={block.id}><code>{block.code.rich_text.map(t => t.plain_text).join("")}</code></pre>;

              case "divider":
                return <hr className="border-gray-300 my-8" key={block.id} />;

              case "image":
                const url = block.image.type === "external" ? block.image.external.url : block.image.file.url;
                return <img key={block.id} src={url} alt="Notion Image" className="relative w-full rounded-2xl overflow-hidden shadow-lg hover:scale-102 transform transition-all duration-300" />;
              case "callout":
                return (
                  <div key={block.id} className="flex items-center gap-4 bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-pink-400/20 p-5 rounded-xl shadow-md backdrop-blur-sm transition transform hover:scale-[1.02]">
                    {block.callout.icon?.emoji && <span className="text-3xl">{block.callout.icon.emoji}</span>}
                    <p className="text-gray-800 font-medium">{block.callout.rich_text.map(t => t.plain_text).join("")}</p>
                  </div>
                );

              default:
                return null;
            }
          })}
        </article>
      </main>
    </div>
  );
}
