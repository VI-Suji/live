"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { FaCalendarAlt, FaUser, FaArrowLeft } from "react-icons/fa";
import { getDirectImageUrl } from "../../utils/imageUtils";
import { useRouter } from "next/navigation";

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
  const [readingProgress, setReadingProgress] = useState(0);
  const router = useRouter();

  useEffect(() => {
    async function fetchPage() {
      try {
        const res = await fetch(`/api/eachNotionPage?pageId=${pageId}`);
        const data = await res.json();
        setPageData(data);
      } catch (error) {
        console.error("Error fetching page:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchPage();
  }, [pageId]);

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const progress = (scrollTop / (documentHeight - windowHeight)) * 100;
      setReadingProgress(Math.min(progress, 100));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        {/* Progress Bar Skeleton */}
        <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-50">
          <div className="h-full bg-red-600 w-0"></div>
        </div>

        {/* Back Button Skeleton */}
        <div className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-40">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="w-32 h-8 bg-gray-200 rounded-full animate-pulse"></div>
          </div>
        </div>

        {/* Hero Skeleton */}
        <div className="relative w-full h-[50vh] bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200 animate-pulse">
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>

        {/* Content Skeleton */}
        <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-10 pb-20">
          <div className="bg-white rounded-3xl shadow-2xl p-8 sm:p-12 space-y-6 animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            <div className="h-6 bg-gray-200 rounded w-full"></div>
            <div className="h-6 bg-gray-200 rounded w-5/6"></div>
            <div className="h-40 bg-gray-200 rounded-2xl my-8"></div>
          </div>
        </main>
      </div>
    );
  }

  if (!pageData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Failed to load article</h2>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-gray-900 text-white rounded-full font-bold hover:bg-gray-800 transition-colors"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  const firstImage = pageData.blocks.find((b): b is ImageBlock => b.type === "image");
  const rawImageUrl =
    firstImage?.image.type === "external" ? firstImage.image.external.url : firstImage?.image.file.url ?? "https://images.unsplash.com/photo-1522199710521-72d69614c702?w=1600&q=80";
  const imageUrl = getDirectImageUrl(rawImageUrl);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-50">
        <div
          className="h-full bg-gradient-to-r from-red-600 to-red-500 transition-all duration-150"
          style={{ width: `${readingProgress}%` }}
        ></div>
      </div>

      {/* Sticky Navigation */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between relative">
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors group z-10"
          >
            <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
            <span className="font-semibold hidden sm:inline">Back</span>
          </button>

          <h1 className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl font-extrabold tracking-tight text-gray-900">
            ഗ്രാമിക
          </h1>

          <div className="flex items-center gap-4 z-10">
            <span className="text-sm text-gray-500 font-medium">
              {Math.round(readingProgress)}% read
            </span>
          </div>
        </div>
      </div>

      {/* Hero Image */}
      <div className="relative w-full h-[50vh] overflow-hidden">
        {imageUrl && (
          <Image
            src={imageUrl}
            alt="Article header"
            fill
            className="object-cover"
            priority
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
      </div>

      {/* Article Content Card */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-10 pb-20">
        <article className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Article Header */}
          <div className="p-8 sm:p-12 border-b border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <span className="px-4 py-1.5 bg-red-600 text-white text-xs font-bold uppercase tracking-wider rounded-full">
                Featured
              </span>
              <span className="text-gray-400 text-sm">•</span>
              <span className="text-gray-600 text-sm font-medium">
                {Math.ceil(pageData.blocks.filter(b => b.type === 'paragraph').length / 200)} min read
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 leading-tight mb-6">
              {pageData.title}
            </h1>

            <div className="flex flex-wrap items-center gap-6 text-gray-600">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-white font-bold">
                  {(author || "G")[0].toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{author || "Gramika Team"}</p>
                  <p className="text-sm text-gray-500">{date || new Date().toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Article Body */}
          <div className="prose prose-lg max-w-none p-8 sm:p-12">
            {pageData.blocks.map((block) => {
              switch (block.type) {
                case "paragraph":
                  return (
                    <p className="text-lg leading-relaxed text-gray-700 mb-6" key={block.id}>
                      {renderRichText(block.paragraph.rich_text)}
                    </p>
                  );

                case "heading_1":
                  return (
                    <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mt-16 mb-6 scroll-mt-24" key={block.id}>
                      {block.heading_1.rich_text.map(t => t.plain_text).join("")}
                    </h2>
                  );

                case "heading_2":
                  return (
                    <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-12 mb-4 pb-3 border-b-2 border-red-600/20" key={block.id}>
                      {block.heading_2.rich_text.map(t => t.plain_text).join("")}
                    </h3>
                  );

                case "heading_3":
                  return (
                    <h4 className="text-xl sm:text-2xl font-bold text-gray-800 mt-10 mb-3" key={block.id}>
                      {block.heading_3.rich_text.map(t => t.plain_text).join("")}
                    </h4>
                  );

                case "bulleted_list_item":
                  return (
                    <ul className="space-y-3 my-6" key={block.id}>
                      <li className="flex items-start gap-3 text-lg text-gray-700">
                        <span className="flex-shrink-0 w-2 h-2 bg-red-600 rounded-full mt-2"></span>
                        <span className="flex-1">{block.bulleted_list_item.rich_text.map(t => t.plain_text).join("")}</span>
                      </li>
                    </ul>
                  );

                case "numbered_list_item":
                  return (
                    <ol className="space-y-3 my-6 counter-reset" key={block.id}>
                      <li className="flex items-start gap-3 text-lg text-gray-700">
                        <span className="flex-shrink-0 w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                          1
                        </span>
                        <span className="flex-1">{block.numbered_list_item.rich_text.map(t => t.plain_text).join("")}</span>
                      </li>
                    </ol>
                  );

                case "quote":
                  return (
                    <blockquote className="relative pl-8 py-6 my-10 border-l-4 border-red-600 bg-gradient-to-r from-red-50 to-transparent rounded-r-2xl" key={block.id}>
                      <svg className="absolute top-4 left-2 w-6 h-6 text-red-600/20" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                      </svg>
                      <p className="text-xl italic text-gray-800 leading-relaxed font-serif">
                        {block.quote.rich_text.map(t => t.plain_text).join("")}
                      </p>
                    </blockquote>
                  );

                case "code":
                  return (
                    <div className="my-8 rounded-2xl overflow-hidden shadow-lg" key={block.id}>
                      <div className="bg-gray-800 px-4 py-2 flex items-center gap-2">
                        <div className="flex gap-1.5">
                          <div className="w-3 h-3 rounded-full bg-red-500"></div>
                          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                          <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        </div>
                        <span className="text-gray-400 text-xs ml-2">Code</span>
                      </div>
                      <pre className="bg-gray-900 text-gray-100 p-6 overflow-x-auto">
                        <code className="text-sm font-mono">
                          {block.code.rich_text.map(t => t.plain_text).join("")}
                        </code>
                      </pre>
                    </div>
                  );

                case "divider":
                  return (
                    <div className="flex items-center justify-center my-12" key={block.id}>
                      <div className="flex gap-2">
                        <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                        <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                        <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                      </div>
                    </div>
                  );

                case "image":
                  const rawBlockUrl = block.image.type === "external" ? block.image.external.url : block.image.file.url;
                  const url = getDirectImageUrl(rawBlockUrl);
                  return (
                    <figure className="my-12 -mx-8 sm:-mx-12" key={block.id}>
                      <div className="relative aspect-video rounded-2xl overflow-hidden shadow-xl">
                        <img
                          src={url}
                          alt="Article image"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </figure>
                  );

                case "callout":
                  return (
                    <div key={block.id} className="flex items-start gap-4 bg-gradient-to-r from-blue-50 to-blue-50/50 border-l-4 border-blue-500 p-6 rounded-r-2xl my-8 shadow-sm">
                      {block.callout.icon?.emoji && (
                        <span className="text-4xl flex-shrink-0">{block.callout.icon.emoji}</span>
                      )}
                      <p className="text-lg text-gray-800 leading-relaxed flex-1">
                        {block.callout.rich_text.map(t => t.plain_text).join("")}
                      </p>
                    </div>
                  );

                default:
                  return null;
              }
            })}
          </div>

          {/* Article Footer */}
          <div className="p-8 sm:p-12 bg-gradient-to-br from-gray-50 to-white border-t border-gray-100">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="text-center sm:text-left">
                <p className="text-sm text-gray-500 mb-2">Enjoyed this article?</p>
                <p className="text-lg font-bold text-gray-900">Share it with your network</p>
              </div>
              <button
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: pageData.title,
                      url: window.location.href,
                    }).catch(console.error);
                  } else {
                    navigator.clipboard.writeText(window.location.href);
                    alert("Link copied to clipboard!");
                  }
                }}
                className="px-8 py-4 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-full font-bold hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                Share Article
              </button>
            </div>
          </div>
        </article>

        {/* Back to Top Button */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="mt-8 w-full py-4 bg-white border-2 border-gray-200 text-gray-700 rounded-full font-bold hover:bg-gray-50 transition-colors"
        >
          Back to Top ↑
        </button>
      </main>
    </div>
  );
}
