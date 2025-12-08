"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

type LocalNewsItem = {
    _id: string;
    title: string;
    image: string;
    description?: string;
    author?: string;
    publishedAt: string;
};

const LocalNewsItem = ({ news }: { news: LocalNewsItem }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isClamped, setIsClamped] = useState(true);
    const [isExpandable, setIsExpandable] = useState(false);
    const [contentHeight, setContentHeight] = useState('4.5rem');
    const contentRef = useRef<HTMLParagraphElement>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Initial measurement to check if expandable
    useEffect(() => {
        const timer = setTimeout(() => {
            if (contentRef.current) {
                const lineHeight = parseFloat(getComputedStyle(contentRef.current).lineHeight);
                const scrollHeight = contentRef.current.scrollHeight;

                // Check if content is more than 4.2 lines
                const threshold = lineHeight * 4.2;
                const hasOverflow = scrollHeight > threshold;

                setIsExpandable(hasOverflow);
                // If not expandable, ensure full content is shown
                if (!hasOverflow) {
                    setIsClamped(false);
                    setContentHeight('none');
                }
            }
        }, 150);
        return () => clearTimeout(timer);
    }, [news.description]);

    const toggleExpand = () => {
        if (!isExpandable) return;

        // Clear any pending timeouts
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }

        if (!isExpanded) {
            // EXPANDING
            // 1. Ensure we start from the collapsed height
            setContentHeight('4.5rem');

            // 2. Unclamp to measure real height (container keeps it clipped)
            setIsClamped(false);

            // 3. Measure and animate in next frame
            requestAnimationFrame(() => {
                if (contentRef.current) {
                    const fullHeight = contentRef.current.scrollHeight;
                    // Force a reflow if needed, then set new height
                    setContentHeight(`${fullHeight}px`);
                    setIsExpanded(true);
                }
            });
        } else {
            // COLLAPSING
            // 1. Start animation to collapsed height
            setIsExpanded(false);
            setContentHeight('4.5rem');
            // 2. isClamped will be set to true in onTransitionEnd
        }
    };

    const handleTransitionEnd = (e: React.TransitionEvent) => {
        if (e.propertyName === 'max-height' && !isExpanded) {
            setIsClamped(true);
        }
    };

    return (
        <div
            onClick={toggleExpand}
            className={`group bg-white rounded-2xl sm:rounded-3xl p-2 sm:p-4 transition-all duration-300 border border-transparent hover:border-gray-100 flex flex-col sm:flex-row gap-4 sm:gap-6 items-start relative ${isExpandable ? 'cursor-pointer hover:shadow-xl' : ''}`}
        >
            <div className="relative h-40 sm:h-40 w-full sm:w-64 flex-shrink-0 rounded-xl sm:rounded-2xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 border border-gray-300">
                <Image
                    src={news.image || "/gramika.png"}
                    alt={news.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
            </div>
            <div className="flex-1 px-2 sm:px-0 w-full">
                <div className="flex justify-between items-start gap-2">
                    <h3 className={`text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 leading-tight transition-colors mb-2 sm:mb-3 ${isExpandable ? 'group-hover:text-blue-600' : ''}`}>
                        {news.title}
                    </h3>
                    {isExpandable && (
                        <div className={`text-gray-400 transition-transform duration-1000 ease-[cubic-bezier(0.25,0.1,0.25,1)] ${isExpanded ? 'rotate-180' : ''}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    )}
                </div>

                {news.author && (
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-bold text-blue-600 uppercase tracking-wider bg-blue-50 px-2 py-1 rounded-md">
                            By {news.author}
                        </span>
                    </div>
                )}

                <div
                    className="overflow-hidden transition-[max-height] duration-1000 ease-[cubic-bezier(0.25,0.1,0.25,1)]"
                    style={{ maxHeight: contentHeight }}
                    onTransitionEnd={handleTransitionEnd}
                >
                    {news.description && (
                        <p
                            ref={contentRef}
                            className={`text-sm sm:text-base text-gray-500 mb-2 sm:mb-4 ${isClamped ? 'line-clamp-3' : 'whitespace-pre-line'}`}
                        >
                            {news.description}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};



const LocalNews = () => {
    const [localNews, setLocalNews] = useState<LocalNewsItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    useEffect(() => {
        fetch(`/api/sanity/localNews?t=${Date.now()}`)
            .then((res) => res.json())
            .then((data) => {
                setLocalNews(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching local news:", err);
                setLoading(false);
            });
    }, []);

    const totalPages = Math.ceil(localNews.length / itemsPerPage);
    const currentNews = localNews.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
            document.getElementById('local-news')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    const renderLoader = () => (
        <div className="flex flex-col gap-6">
            {Array.from({ length: 3 }).map((_, idx) => (
                <div key={idx} className="bg-white rounded-3xl p-4 flex flex-col sm:flex-row gap-6 items-center animate-pulse">
                    <div className="h-48 sm:h-40 w-full sm:w-64 flex-shrink-0 rounded-2xl bg-gray-200"></div>
                    <div className="flex-1 space-y-3 w-full">
                        <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-full"></div>
                        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                    </div>
                </div>
            ))}
        </div>
    );

    if (!loading && localNews.length === 0) {
        return null;
    }

    return (
        <div id="local-news" className="w-full mt-8 sm:mt-12 border border-gray-200 sm:border-none rounded-3xl p-2 sm:p-0">
            <div className="flex items-center gap-3 mb-6 sm:mb-8">
                <div className="w-1.5 h-6 sm:h-8 bg-blue-600 rounded-full"></div>
                <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">Local News</h2>
            </div>

            {loading ? renderLoader() : (
                <>
                    <div className="flex flex-col gap-4 sm:gap-6">
                        {currentNews.map((news) => (
                            <LocalNewsItem key={news._id} news={news} />
                        ))}
                    </div>

                    {totalPages > 1 && (
                        <div className="flex justify-center items-center gap-3 mt-8">
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${currentPage === 1
                                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                    : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
                                    }`}
                            >
                                Previous
                            </button>

                            <div className="flex gap-2">
                                {Array.from({ length: totalPages }).map((_, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => handlePageChange(idx + 1)}
                                        className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold transition-all ${currentPage === idx + 1
                                            ? "bg-blue-600 text-white shadow-md transform scale-105"
                                            : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
                                            }`}
                                        aria-label={`Page ${idx + 1}`}
                                        aria-current={currentPage === idx + 1 ? 'page' : undefined}
                                    >
                                        {idx + 1}
                                    </button>
                                ))}
                            </div>

                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${currentPage === totalPages
                                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                    : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
                                    }`}
                            >
                                Next
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default LocalNews;
