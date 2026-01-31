import React, { useEffect, useState, useRef } from "react";
import AdOne from "./AdFirstComponent";
import AdTwo from "./AdSecondComponent";
import BannerAd from "./BannerAdComponent";
import CategoryNews from "./CategoryNewsComponent";
import Obituaries from "./ObituariesComponent";
import LocalNews from "./LocalNewsComponent";
import VideoGallery from "./VideoGalleryComponent";
import Image from "next/image";

interface NewsItem {
  date: string; // "2025-11-15"
  heading: string;
  content: string;
  image?: string;
}

interface SidebarProps {
  siteSettings?: {
    advertisementsVisible: boolean;
    latestNewsVisible: boolean;
  };
}

const Sidebar: React.FC<SidebarProps> = ({ siteSettings }) => {
  const [news, setNews] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(true);

  // Expandable state
  const [isExpanded, setIsExpanded] = useState(false);
  const [isClamped, setIsClamped] = useState(true);
  const [isExpandable, setIsExpandable] = useState(false);
  const [contentHeight, setContentHeight] = useState('4.5rem');
  const contentRef = useRef<HTMLParagraphElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetch("/api/sanity/latestNews")
      .then((res) => res.json())
      .then((data) => {
        if (!data.error) {
          setNews(data);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Measurement effect
  useEffect(() => {
    if (!news) return;

    const timer = setTimeout(() => {
      if (contentRef.current) {
        const lineHeight = parseFloat(getComputedStyle(contentRef.current).lineHeight);
        const scrollHeight = contentRef.current.scrollHeight;

        // Check if content is more than ~3 lines (using 4.5rem / 1.5rem lineHeight)
        const threshold = lineHeight * 3.2;
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
    }, 200);
    return () => clearTimeout(timer);
  }, [news, loading]);

  const toggleExpand = () => {
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

  // Loader component
  const renderLoader = () => (
    <div className="flex flex-col justify-start w-full bg-white rounded-3xl shadow-xl border border-gray-100 p-6 gap-6 animate-pulse">
      <div className="w-full flex justify-between items-center border-b border-gray-100 pb-6">
        <div className="h-8 bg-gray-200 rounded-lg w-1/3"></div>
        <div className="h-3 w-3 bg-red-200 rounded-full"></div>
      </div>
      <div className="w-full flex flex-col gap-4">
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

  let day: number | string = "";
  let month: string = "";
  let year: number | string = "";

  if (news?.date) {
    const dateObj = new Date(news.date);
    if (!isNaN(dateObj.getTime())) {
      day = dateObj.getDate();
      year = dateObj.getFullYear();
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      month = monthNames[dateObj.getMonth()];
    }
  }

  const showAds = siteSettings?.advertisementsVisible ?? true;
  const showNews = siteSettings?.latestNewsVisible ?? true;

  return (
    <div className="flex flex-col items-start justify-start w-full lg:w-[35%] flex-shrink-0 gap-6">
      {showAds && <AdOne />}

      {/* Latest News Widget */}
      {showNews && (
        <div
          onClick={toggleExpand}
          className={`w-full bg-white rounded-[2.5rem] shadow-2xl shadow-blue-100/20 border border-gray-100 overflow-hidden sticky top-12 z-30 transition-all duration-300 ${isExpandable ? 'cursor-pointer hover:shadow-3xl hover:shadow-blue-900/5' : ''}`}
        >
          <div className="p-6 border-b border-gray-50 bg-gray-50/50 flex justify-between items-center">
            <h3 className="font-black text-xl text-gray-900">Latest News</h3>
            <div className="flex items-center gap-4">
              {isExpandable && (
                <div className={`text-gray-400 transition-transform duration-700 ease-[cubic-bezier(0.25,0.1,0.25,1)] ${isExpanded ? 'rotate-180' : ''}`}>
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

          {loading ? (
            renderLoader()
          ) : news ? (
            <div className="p-6 flex flex-col gap-6">
              {/* Optional Large Image */}
              {news.image && (
                <div className="w-full relative h-48 rounded-2xl overflow-hidden border border-gray-100 shadow-sm transition-transform duration-500 hover:scale-[1.02]">
                  <Image
                    src={news.image}
                    alt={news.heading}
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              <div className="flex flex-col md:flex-row items-start gap-4">
                {/* Mobile Date */}
                <div className="md:hidden w-1/2 self-end bg-blue-50/50 rounded-xl px-4 py-2 text-blue-600 font-bold text-center text-sm uppercase tracking-wide">
                  {day} {month} {year}
                </div>

                {/* Desktop Date */}
                <div className="hidden md:flex flex-shrink-0 flex-col items-center justify-center w-16 h-16 bg-blue-50 rounded-2xl text-blue-600">
                  <span className="text-xl font-black">{day}</span>
                  <span className="text-xs font-bold uppercase">{month}</span>
                </div>

                <div className="flex-1 w-full mb-4">
                  <h4 className="font-bold text-gray-900 text-lg leading-tight mb-2 group-hover:text-blue-600 transition-colors">
                    {news.heading}
                  </h4>
                  <div
                    className={`overflow-hidden transition-[max-height] duration-700 ease-[cubic-bezier(0.25,0.1,0.25,1)]`}
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
          ) : (
            <div className="p-6 text-center text-gray-500">
              No latest news available
            </div>
          )}
        </div>
      )}

      {showAds && <AdTwo />}

      {/* Local News Widget - Mobile Only */}
      <div id="local-news-mobile" className="w-full lg:hidden">
        <LocalNews />
      </div>

      {showAds && (
        <div className="w-full lg:hidden">
          <BannerAd />
        </div>
      )}

      <CategoryNews />
      <VideoGallery />
      <Obituaries />
    </div>
  );
};

export default Sidebar;
