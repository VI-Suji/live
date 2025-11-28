import React, { useState, useEffect } from "react";
import { FaBolt } from "react-icons/fa";

type BreakingNewsItem = {
    _id: string;
    title: string;
    link?: string;
    priority: number;
};

export default function BreakingNewsTicker() {
    const [news, setNews] = useState<BreakingNewsItem[]>([]);

    useEffect(() => {
        const fetchNews = () => {
            fetch("/api/sanity/breakingNews")
                .then((res) => res.json())
                .then((data) => {
                    if (Array.isArray(data)) {
                        setNews(data);
                    }
                })
                .catch(console.error);
        };

        fetchNews();
        // Refresh every 5 minutes
        const interval = setInterval(fetchNews, 5 * 60 * 1000);
        return () => clearInterval(interval);
    }, []);

    if (news.length === 0) {
        return null;
    }

    return (
        <div className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white overflow-hidden shadow-lg relative z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center h-10">
                    {/* Breaking News Label */}
                    <div className="flex-shrink-0 bg-red-800 px-6 h-full flex items-center gap-2 font-black text-sm uppercase tracking-wider">
                        <FaBolt className="text-yellow-300 animate-pulse" />
                        <span>Breaking News</span>
                    </div>

                    {/* Scrolling News Container */}
                    <div className="flex-1 relative overflow-hidden h-full">
                        <div className="absolute inset-0 flex items-center">
                            <div className="animate-scroll-left whitespace-nowrap flex items-center gap-12">
                                {/* Duplicate the news items for seamless loop */}
                                {[...news, ...news, ...news].map((item, index) => (
                                    <React.Fragment key={`${item._id}-${index}`}>
                                        {item.link ? (
                                            <a
                                                href={item.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-2 hover:text-yellow-300 transition-colors font-semibold text-sm"
                                            >
                                                <span className="inline-block w-2 h-2 bg-yellow-300 rounded-full"></span>
                                                {item.title}
                                            </a>
                                        ) : (
                                            <span className="inline-flex items-center gap-2 font-semibold text-sm">
                                                <span className="inline-block w-2 h-2 bg-yellow-300 rounded-full"></span>
                                                {item.title}
                                            </span>
                                        )}
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
