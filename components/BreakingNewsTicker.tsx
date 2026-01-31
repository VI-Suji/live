import React, { useState, useEffect } from "react";
import { FaBolt, FaNewspaper } from "react-icons/fa";

type NewsItem = {
    _id: string;
    title: string;
    scrollTitle?: string;
    link?: string;
    isBreaking?: boolean;
};

export default function BreakingNewsTicker() {
    const [displayNews, setDisplayNews] = useState<NewsItem[]>([]);
    const [isBreaking, setIsBreaking] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch breaking news and local news
                const [breakingRes, localRes] = await Promise.all([
                    fetch("/api/sanity/breakingNews"),
                    fetch("/api/sanity/localNews")
                ]);

                const breakingData = await breakingRes.json();
                const localData = await localRes.json();

                if (Array.isArray(breakingData) && breakingData.length > 0) {
                    // We have breaking news, show all of it
                    setDisplayNews(breakingData.map(item => ({ ...item, isBreaking: true })));
                    setIsBreaking(true);
                } else if (Array.isArray(localData) && localData.length > 0) {
                    // No breaking news, always show top 5 local news per user request
                    setDisplayNews(localData.slice(0, 5).map(item => ({ ...item, isBreaking: false })));
                    setIsBreaking(false);
                } else {
                    setDisplayNews([]);
                }
            } catch (error) {
                console.error("Error fetching news for ticker:", error);
            }
        };

        fetchData();
        // Refresh every 2 minutes
        const interval = setInterval(fetchData, 2 * 60 * 1000);
        return () => clearInterval(interval);
    }, []);

    if (displayNews.length === 0) {
        return null; // Don't show anything if no news at all
    }

    return (
        <div className={`w-full ${isBreaking ? 'bg-gradient-to-r from-red-600 to-red-700' : 'bg-gradient-to-r from-blue-600 to-blue-700'} text-white overflow-hidden shadow-lg relative z-40 transition-colors duration-500`}>
            <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
                <div className="flex items-center h-8 sm:h-10">
                    {/* Label */}
                    <div className={`${isBreaking ? 'bg-red-800' : 'bg-blue-800'} px-2 sm:px-4 lg:px-6 h-full flex items-center gap-1 sm:gap-2 font-black text-[10px] sm:text-xs uppercase tracking-wider transition-colors duration-500`}>
                        {isBreaking ? (
                            <FaBolt className="text-yellow-300 animate-pulse text-xs sm:text-sm" />
                        ) : (
                            <FaNewspaper className="text-blue-200 text-xs sm:text-sm" />
                        )}
                        <span className="hidden xs:inline">{isBreaking ? 'Breaking News' : 'Latest Local'}</span>
                        <span className="inline xs:hidden">{isBreaking ? 'Breaking' : 'Local'}</span>
                    </div>

                    {/* Scrolling News Container */}
                    <div className="flex-1 relative overflow-hidden h-full">
                        <div className="absolute inset-0 flex items-center">
                            <div className="animate-scroll-left whitespace-nowrap flex items-center gap-6 sm:gap-12 pl-4">
                                {/* Duplicate the news items for seamless loop */}
                                {[...displayNews, ...displayNews, ...displayNews].map((item, index) => (
                                    <React.Fragment key={`${item._id}-${index}`}>
                                        <button
                                            disabled={!!item.isBreaking}
                                            onClick={() => {
                                                if (item.isBreaking) return;

                                                const slug = (item.title || "")
                                                    .toLowerCase()
                                                    .trim()
                                                    .replace(/[^\u0D00-\u0D7F\w\s-]/g, '')
                                                    .replace(/\s+/g, '-')
                                                    .replace(/-+/g, '-')
                                                    .substring(0, 60);

                                                window.history.pushState(null, '', `/news/${slug}`);
                                                window.dispatchEvent(new PopStateEvent('popstate', { state: null }));
                                            }}
                                            className={`inline-flex items-center gap-1.5 sm:gap-2 font-semibold text-xs sm:text-sm text-left transition-colors
                                                ${!item.isBreaking ? 'cursor-pointer hover:text-yellow-200' : 'cursor-default'}`}
                                        >
                                            <span className={`inline-block w-1.5 h-1.5 sm:w-2 sm:h-2 ${isBreaking ? 'bg-yellow-300' : 'bg-blue-200'} rounded-full`}></span>
                                            {item.scrollTitle && item.scrollTitle.trim() !== "" ? item.scrollTitle : item.title}
                                        </button>
                                    </React.Fragment>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes scroll-left {
                    0% {
                        transform: translateX(0);
                    }
                    100% {
                        transform: translateX(-33.333%);
                    }
                }

                .animate-scroll-left {
                    animation: scroll-left 30s linear infinite;
                }

                .animate-scroll-left:hover {
                    animation-play-state: paused;
                }
            `}</style>
        </div>
    );
}
