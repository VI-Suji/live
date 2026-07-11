import React, { useState, useEffect } from "react";
import { FaBolt, FaNewspaper } from "react-icons/fa";
import { openNewsReport } from "../utils/slugify";

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
                const [breakingRes, localRes] = await Promise.all([
                    fetch(`/api/sanity/breakingNews`),
                    fetch(`/api/sanity/localNews`)
                ]);

                const breakingData = await breakingRes.json();
                const localData = await localRes.json();

                if (Array.isArray(breakingData) && breakingData.length > 0) {
                    setDisplayNews(breakingData.map(item => ({ ...item, isBreaking: true })));
                    setIsBreaking(true);
                } else if (Array.isArray(localData) && localData.length > 0) {
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
        const interval = setInterval(fetchData, 2 * 60 * 1000);
        return () => clearInterval(interval);
    }, []);

    if (displayNews.length === 0) return null;

    return (
        <div
            className={`w-full overflow-hidden relative z-40 transition-colors duration-500 ${
                isBreaking
                    ? "bg-red-600 text-white"
                    : "bg-[var(--bg-surface)] text-[var(--text-primary)] border-b border-[var(--border-subtle)]"
            }`}
        >
            <div className="page-container">
                <div className="flex items-center h-8 sm:h-9">
                    <div
                        className={`flex-shrink-0 px-3 sm:px-4 h-full flex items-center gap-1.5 font-[family-name:var(--font-display)] text-[10px] sm:text-xs font-semibold uppercase tracking-wider ${
                            isBreaking ? "bg-red-700" : "bg-[var(--bg-muted)] text-[var(--accent)]"
                        }`}
                    >
                        {isBreaking ? (
                            <FaBolt className="text-amber-300 text-xs" />
                        ) : (
                            <FaNewspaper className="text-[var(--accent)] text-xs" />
                        )}
                        <span className="hidden xs:inline">{isBreaking ? "Breaking" : "Latest"}</span>
                    </div>

                    <div className="flex-1 relative overflow-hidden h-full mask-fade-edges">
                        <div className="absolute inset-0 flex items-center">
                            <div className="animate-scroll-left whitespace-nowrap flex items-center gap-8 sm:gap-12 pl-4">
                                {[...displayNews, ...displayNews, ...displayNews].map((item, index) => (
                                    <button
                                        key={`${item._id}-${index}`}
                                        disabled={!!item.isBreaking}
                                        onClick={() => {
                                            if (item.isBreaking) return;
                                            openNewsReport(item.title);
                                        }}
                                        className={`inline-flex items-center gap-2 font-[family-name:var(--font-display)] text-xs sm:text-sm text-left transition-colors ${
                                            !item.isBreaking
                                                ? "cursor-pointer hover:text-[var(--accent)]"
                                                : "cursor-default"
                                        } ${isBreaking ? "hover:text-amber-200" : ""}`}
                                    >
                                        <span className={`inline-block w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                                            isBreaking ? "bg-amber-300" : "bg-[var(--accent)]"
                                        }`} />
                                        {item.scrollTitle?.trim() ? item.scrollTitle : item.title}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes scroll-left {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-33.333%); }
                }
                .animate-scroll-left {
                    animation: scroll-left 50s linear infinite;
                }
                .animate-scroll-left:hover {
                    animation-play-state: paused;
                }
                @media (prefers-reduced-motion: reduce) {
                    .animate-scroll-left {
                        animation: none;
                    }
                }
                .mask-fade-edges {
                    mask-image: linear-gradient(90deg, transparent, black 3%, black 97%, transparent);
                }
            `}</style>
        </div>
    );
}
