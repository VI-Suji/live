"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

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
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Reduce timeout for snappier height detection
    const timer = setTimeout(() => {
      if (contentRef.current) {
        const lineHeight = parseFloat(getComputedStyle(contentRef.current).lineHeight) || 20;
        const scrollHeight = contentRef.current.scrollHeight;
        const threshold = lineHeight * 3.5;
        const hasOverflow = scrollHeight > threshold;

        setIsExpandable(hasOverflow);
        if (!hasOverflow) {
          setIsClamped(false);
          setContentHeight('none');
        } else {
          setIsClamped(true);
          setContentHeight('4.5rem');
        }
      }
    }, 50); // Snappier measurement
    return () => clearTimeout(timer);
  }, [news]);

  const toggleExpand = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isExpandable) return;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    if (!isExpanded) {
      setContentHeight('4.5rem');
      setIsClamped(false);
      requestAnimationFrame(() => {
        if (contentRef.current) {
          const fullHeight = contentRef.current.scrollHeight;
          setContentHeight(`${fullHeight}px`);
          setIsExpanded(true);
        }
      });
    } else {
      setIsExpanded(false);
      setContentHeight('4.5rem');
    }
  };

  const handleTransitionEnd = (e: React.TransitionEvent) => {
    if (e.propertyName === 'max-height' && !isExpanded) {
      setIsClamped(true);
    }
  };

  const dateObj = new Date(news.date);
  const day = dateObj.getDate();
  const year = dateObj.getFullYear();
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const month = monthNames[dateObj.getMonth()];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className={`w-full bg-white rounded-[2.5rem] shadow-2xl shadow-blue-100/20 border border-gray-100 overflow-hidden z-30 transition-shadow duration-300 ${isExpandable ? 'cursor-pointer hover:shadow-3xl hover:shadow-blue-900/5' : ''}`}
      onClick={toggleExpand}
    >
      <div className="p-6 border-b border-gray-50 bg-gray-50/50 flex justify-between items-center">
        <h3 className="font-black text-xl text-gray-900">Latest News</h3>
        <div className="flex items-center gap-4">
          {isExpandable && (
            <div className={`text-gray-400 transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] ${isExpanded ? 'rotate-180' : ''}`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          )}
          <span className="flex h-3 w-3 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
          </span>
        </div>
      </div>

      <div className="p-6 flex flex-col gap-6">
        {news.image && (
          <div className="w-full relative h-48 rounded-2xl overflow-hidden border border-gray-100 shadow-sm transition-transform duration-500 hover:scale-[1.02]">
            <Image
              src={news.image}
              alt={news.heading}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover"
              priority
            />
          </div>
        )}

        <div className="flex flex-col md:flex-row items-start gap-4">
          <div className="hidden md:flex flex-shrink-0 flex-col items-center justify-center w-16 h-16 bg-blue-50 rounded-2xl text-blue-600">
            <span className="text-xl font-black">{day}</span>
            <span className="text-xs font-bold uppercase">{month}</span>
          </div>

          <div className="flex-1 w-full mb-4">
            <div className="md:hidden inline-block bg-blue-50/50 rounded-lg px-3 py-1 text-blue-600 font-bold text-xs uppercase tracking-wide mb-2">
              {day} {month} {year}
            </div>
            <h4 className="font-bold text-gray-900 text-lg leading-tight mb-2 group-hover:text-blue-600 transition-colors">
              {news.heading}
            </h4>
            <div
              className={`overflow-hidden transition-[max-height] duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)]`}
              style={{ maxHeight: contentHeight }}
              onTransitionEnd={handleTransitionEnd}
            >
              <p
                ref={contentRef}
                className={`text-gray-500 text-sm leading-relaxed ${isClamped ? 'line-clamp-4' : 'whitespace-pre-line'}`}
              >
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
      .then((data) => {
        if (!data.error && Array.isArray(data)) {
          setAllNews(data);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (allNews.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentPage((prev) => (prev + 1) % allNews.length);
    }, 10000);

    return () => clearInterval(timer);
  }, [allNews.length, currentPage]);

  if (loading) return (
    <div className="flex flex-col justify-start w-full bg-white rounded-[2.5rem] shadow-xl border border-gray-100 p-6 gap-6 animate-pulse">
      <div className="w-full flex justify-between items-center border-b border-gray-100 pb-6">
        <div className="h-8 bg-gray-200 rounded-lg w-1/3"></div>
        <div className="h-3 w-3 bg-red-200 rounded-full"></div>
      </div>
      <div className="space-y-4">
        <div className="w-full h-48 bg-gray-200 rounded-2xl"></div>
        <div className="flex gap-4">
          <div className="w-16 h-16 bg-gray-200 rounded-2xl flex-shrink-0"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
          </div>
        </div>
      </div>
    </div>
  );

  if (allNews.length === 0) return null;
  
  const newsToDisplay = allNews[currentPage];

  const handleDragEnd = (event: any, info: any) => {
    const threshold = 50;
    if (info.offset.x < -threshold) {
      // Swiped left, show next
      setCurrentPage((prev) => (prev + 1) % allNews.length);
    } else if (info.offset.x > threshold) {
      // Swiped right, show previous
      setCurrentPage((prev) => (prev - 1 + allNews.length) % allNews.length);
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full relative">
      <div className="relative overflow-hidden min-h-[400px]">
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
        <div className="flex justify-center items-center gap-3">
          {allNews.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentPage(idx)}
              className={`group relative flex items-center justify-center p-2 focus:outline-none`}
              aria-label={`Go to slide ${idx + 1}`}
            >
              <div className={`h-2 rounded-full transition-all duration-500 ease-out ${
                currentPage === idx ? "w-8 bg-blue-600" : "w-2 bg-gray-300 group-hover:bg-gray-400"
              }`} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LatestNewsComponent;
