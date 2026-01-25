"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

interface CategoryNewsItemData {
    _id: string;
    title: string;
    image: string;
    description?: string;
    author?: string;
    publishedAt: string;
}

const CategoryNewsItem = ({ news }: { news: CategoryNewsItemData }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isClamped, setIsClamped] = useState(true);
    const [isExpandable, setIsExpandable] = useState(false);
    const [contentHeight, setContentHeight] = useState('4.5rem');
    const contentRef = useRef<HTMLParagraphElement>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (contentRef.current) {
                const lineHeight = parseFloat(getComputedStyle(contentRef.current).lineHeight);
                const scrollHeight = contentRef.current.scrollHeight;
                const threshold = lineHeight * 4.2;
                const hasOverflow = scrollHeight > threshold;

                setIsExpandable(hasOverflow);
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

    return (
        <div
            onClick={toggleExpand}
            className={`group bg-white rounded-2xl transition-all duration-300 border border-transparent hover:border-gray-100 flex flex-col gap-4 items-start relative mb-4 last:mb-0 ${isExpandable ? 'cursor-pointer hover:shadow-xl' : ''}`}
        >
            <div className="relative h-44 w-full flex-shrink-0 rounded-2xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 border border-gray-300">
                <Image
                    src={news.image || "/gramika.png"}
                    alt={news.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
            </div>
            <div className="flex-1 px-2 w-full pb-2">
                <div className="flex justify-between items-start gap-2">
                    <h3 className={`text-lg font-bold text-gray-900 leading-tight transition-colors mb-2 ${isExpandable ? 'group-hover:text-blue-600' : ''}`}>
                        {news.title}
                    </h3>
                    {isExpandable && (
                        <div className={`text-gray-400 mt-1 transition-transform duration-1000 ease-[cubic-bezier(0.25,0.1,0.25,1)] ${isExpanded ? 'rotate-180' : ''}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    )}
                </div>

                {news.author && (
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider bg-blue-50 px-2 py-1 rounded-md">
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
                            className={`text-sm text-gray-500 mb-2 ${isClamped ? 'line-clamp-3' : 'whitespace-pre-line'}`}
                        >
                            {news.description}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

const CategoryNewsComponent = () => {
    const [newsData, setNewsData] = useState<CategoryNewsItemData[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [activeTab, setActiveTab] = useState<'entertainmentNews' | 'healthNews' | 'sportsNews'>('entertainmentNews');
    const itemsPerPage = 2;

    useEffect(() => {
        setLoading(true);
        fetch(`/api/sanity/categoryNews?type=${activeTab}&t=${Date.now()}`)
            .then((res) => res.json())
            .then((data) => {
                setNewsData(Array.isArray(data) ? data : []);
                setLoading(false);
                setCurrentPage(1);
            })
            .catch((err) => {
                console.error(`Error fetching ${activeTab} news:`, err);
                setLoading(false);
            });
    }, [activeTab]);

    const totalPages = Math.ceil(newsData.length / itemsPerPage);
    const currentNews = newsData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
            const element = document.getElementById('category-news-header');
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    };

    const renderLoader = () => (
        <div className="flex flex-col gap-6">
            {Array.from({ length: 2 }).map((_, idx) => (
                <div key={idx} className="bg-white rounded-3xl p-4 flex flex-col gap-6 items-center animate-pulse">
                    <div className="h-44 w-full flex-shrink-0 rounded-2xl bg-gray-200"></div>
                    <div className="flex-1 space-y-3 w-full">
                        <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-full"></div>
                    </div>
                </div>
            ))}
        </div>
    );

    return (
        <div className="w-full mt-4">
            <div id="category-news-header" className="flex flex-col gap-6 mb-8">
                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-1.5 h-7 bg-blue-600 rounded-full"></div>
                        <h2 className="text-2xl font-black text-gray-900 tracking-tight">
                            {activeTab === 'entertainmentNews' ? 'Entertainment News' : activeTab === 'healthNews' ? 'Health News' : 'Sports News'}
                        </h2>
                    </div>

                    <div className="flex bg-gray-100 p-1 rounded-xl sm:rounded-2xl w-full">
                        {(['entertainmentNews', 'healthNews', 'sportsNews'] as const).map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`flex-1 px-4 sm:px-6 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold transition-all ${activeTab === tab
                                    ? "bg-white text-blue-600 shadow-sm"
                                    : "text-gray-500 hover:text-gray-700"
                                    }`}
                            >
                                <span className="capitalize">{tab.replace('News', '')}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {loading ? renderLoader() : (
                <>
                    {newsData.length === 0 ? (
                        <div className="bg-white rounded-3xl p-8 text-center border border-gray-100">
                            <p className="text-gray-500 text-sm font-medium">No {activeTab.replace('News', '')} news available.</p>
                        </div>
                    ) : (
                        <div className="flex flex-col">
                            {currentNews.map((news) => (
                                <CategoryNewsItem key={news._id} news={news} />
                            ))}
                        </div>
                    )}
                </>
            )}

            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-6">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${currentPage === 1
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 shadow-sm"
                            }`}
                        aria-label="Previous page"
                    >
                        <FaChevronLeft size={12} />
                    </button>

                    <div className="flex gap-1.5">
                        {Array.from({ length: totalPages }).map((_, idx) => {
                            const page = idx + 1;
                            // Show first, last, current, and pages around current
                            if (
                                page === 1 ||
                                page === totalPages ||
                                (page >= currentPage - 1 && page <= currentPage + 1)
                            ) {
                                return (
                                    <button
                                        key={page}
                                        onClick={() => handlePageChange(page)}
                                        className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold transition-all ${currentPage === page
                                            ? "bg-blue-600 text-white shadow-md transform scale-105"
                                            : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
                                            }`}
                                    >
                                        {page}
                                    </button>
                                );
                            } else if (
                                page === currentPage - 2 ||
                                page === currentPage + 2
                            ) {
                                return <span key={page} className="w-4 flex justify-center items-end pb-2 text-gray-400">...</span>;
                            }
                            return null;
                        })}
                    </div>

                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${currentPage === totalPages
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 shadow-sm"
                            }`}
                        aria-label="Next page"
                    >
                        <FaChevronRight size={12} />
                    </button>
                </div>
            )}
        </div>
    );
};

export default CategoryNewsComponent;
