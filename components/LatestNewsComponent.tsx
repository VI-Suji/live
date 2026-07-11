"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import NewsShareMenu from "./NewsShareMenu";
import { getNewsSharePath } from "../utils/slugify";
import { getSiteOrigin } from "../utils/shareMeta";

interface NewsItem {
  _id: string;
  date: string;
  heading: string;
  content: string;
  image?: string;
}

const NewsItemCard: React.FC<{ news: NewsItem }> = ({ news }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isClamped, setIsClamped] = useState(true);
  const [isExpandable, setIsExpandable] = useState(false);
  const [contentHeight, setContentHeight] = useState('4.5rem');
  const contentRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (contentRef.current) {
        const lineHeight = parseFloat(getComputedStyle(contentRef.current).lineHeight) || 20;
        const hasOverflow = contentRef.current.scrollHeight > lineHeight * 3.5;
        setIsExpandable(hasOverflow);
        if (!hasOverflow) { setIsClamped(false); setContentHeight('none'); }
        else { setIsClamped(true); setContentHeight('4.5rem'); }
      }
    }, 50);
    return () => clearTimeout(timer);
  }, [news]);

  const toggleExpand = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isExpandable) return;
    if (!isExpanded) {
      setContentHeight('4.5rem');
      setIsClamped(false);
      requestAnimationFrame(() => {
        if (contentRef.current) {
          setContentHeight(`${contentRef.current.scrollHeight}px`);
          setIsExpanded(true);
        }
      });
    } else {
      setIsExpanded(false);
      setContentHeight('4.5rem');
    }
  };

  const handleTransitionEnd = (e: React.TransitionEvent) => {
    if (e.propertyName === 'max-height' && !isExpanded) setIsClamped(true);
  };

  const dateObj = new Date(news.date);
  const day = dateObj.getDate();
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const month = monthNames[dateObj.getMonth()];
  const shareUrl = `${getSiteOrigin()}${getNewsSharePath(news.heading)}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.3 }}
      className={`surface-card w-full overflow-hidden ${isExpandable ? 'cursor-pointer' : ''}`}
      onClick={toggleExpand}
    >
      <div className="px-5 py-4 border-b border-[var(--border-subtle)] flex justify-between items-center bg-[var(--bg-muted)]/40">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-60" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
          </span>
          <h3 className="font-[family-name:var(--font-display)] font-medium text-sm text-[var(--text-primary)]">Latest News</h3>
        </div>
        <div className="flex items-center gap-2">
          <NewsShareMenu shareUrl={shareUrl} size="sm" menuPlacement="below" />
          {isExpandable && (
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 text-[var(--text-tertiary)] transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          )}
        </div>
      </div>

      <div className="p-5 flex flex-col gap-4">
        {news.image && (
          <div className="image-frame relative h-36 sm:h-44 w-full">
            <Image src={news.image} alt={news.heading} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" priority />
          </div>
        )}

        <div className="flex gap-4">
          <div className="hidden sm:flex flex-shrink-0 flex-col items-center justify-center w-14 h-14 bg-[var(--accent-muted)] rounded-xl text-[var(--accent)]">
            <span className="text-lg font-semibold font-[family-name:var(--font-display)] leading-none">{day}</span>
            <span className="text-[10px] font-medium uppercase">{month}</span>
          </div>
          <div className="flex-1 min-w-0">
            <span className="sm:hidden text-[10px] font-[family-name:var(--font-display)] font-medium text-[var(--accent)] uppercase tracking-wide mb-1.5 block">
              {day} {month}
            </span>
            <h4 className="font-medium text-[var(--text-primary)] text-base leading-snug mb-2">
              {news.heading}
            </h4>
            <div
              className="overflow-hidden transition-[max-height] duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)]"
              style={{ maxHeight: contentHeight }}
              onTransitionEnd={handleTransitionEnd}
            >
              <p ref={contentRef} className={`text-sm text-[var(--text-secondary)] leading-relaxed ${isClamped ? 'line-clamp-4' : 'whitespace-pre-line'}`}>
                {news.content}
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const LatestNewsComponent: React.FC = () => {
  const [allNews, setAllNews] = useState<NewsItem[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/sanity/latestNews`)
      .then((res) => res.json())
      .then((data) => { if (!data.error && Array.isArray(data)) setAllNews(data); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (allNews.length <= 1) return;
    const timer = setInterval(() => setCurrentPage((prev) => (prev + 1) % allNews.length), 10000);
    return () => clearInterval(timer);
  }, [allNews.length, currentPage]);

  if (loading) return (
    <div className="surface-card p-5 space-y-4">
      <div className="h-5 skeleton w-1/3" />
      <div className="h-36 skeleton w-full rounded-xl" />
      <div className="h-4 skeleton w-full" />
      <div className="h-4 skeleton w-4/5" />
    </div>
  );

  if (allNews.length === 0) return null;

  const newsToDisplay = allNews[currentPage];

  const handleDragEnd = (_event: unknown, info: { offset: { x: number } }) => {
    const threshold = 50;
    if (info.offset.x < -threshold) setCurrentPage((prev) => (prev + 1) % allNews.length);
    else if (info.offset.x > threshold) setCurrentPage((prev) => (prev - 1 + allNews.length) % allNews.length);
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={newsToDisplay._id}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={handleDragEnd}
            className="cursor-grab active:cursor-grabbing"
          >
            <NewsItemCard news={newsToDisplay} />
          </motion.div>
        </AnimatePresence>
      </div>

      {allNews.length > 1 && (
        <div className="flex justify-center gap-2">
          {allNews.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentPage(idx)}
              className="p-1 focus:outline-none"
              aria-label={`Go to slide ${idx + 1}`}
            >
              <div className={`h-1 rounded-full transition-all duration-300 ${currentPage === idx ? "w-6 bg-[var(--accent)]" : "w-1.5 bg-[var(--border-strong)]"}`} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LatestNewsComponent;
