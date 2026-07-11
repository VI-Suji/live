"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { slugify, getNewsSharePath, decodeSlug, isNewsModalUrl, navigateBackFromNewsModal } from "../utils/slugify";
import { getSiteOrigin } from "../utils/shareMeta";
import NewsShareMenu from "./NewsShareMenu";
import NewsReportModal from "./NewsReportModal";
import SectionHeader from "./SectionHeader";

type LocalNewsItem = {
    _id: string;
    title: string;
    image: string;
    description?: string;
    author?: string;
    publishedAt: string;
};

const LocalNewsItem = ({ news, onOpen }: { news: LocalNewsItem, onOpen: (news: LocalNewsItem) => void }) => {
    const [isHighlighted, setIsHighlighted] = useState(false);

    useEffect(() => {
        const checkHash = () => {
            if (window.location.hash === `#news-${news._id}`) {
                setIsHighlighted(true);
                onOpen(news);
                setTimeout(() => setIsHighlighted(false), 3000);
            }
        };

        checkHash();
        window.addEventListener('hashchange', checkHash);
        return () => window.removeEventListener('hashchange', checkHash);
    }, [news, onOpen]);

    return (
        <div
            id={`news-${news._id}`}
            onClick={() => onOpen(news)}
            className={`group surface-card surface-card-interactive p-3 sm:p-5 items-start relative cursor-pointer flex flex-col sm:flex-row gap-4 sm:gap-5
                ${isHighlighted ? 'ring-2 ring-[var(--accent)] border-[var(--accent)]' : ''}`}
        >
            <div className="image-frame relative h-40 sm:h-40 w-full sm:w-44 flex-shrink-0">
                <Image
                    src={news.image || "/gramika.png"}
                    alt={news.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
            </div>
            <div className="flex-1 px-2 sm:px-0 w-full">
                <div className="flex justify-between items-start gap-2">
                    <h3 className="text-base sm:text-lg font-medium text-[var(--text-primary)] leading-snug transition-colors mb-2 group-hover:text-[var(--accent)]">
                        {news.title}
                    </h3>
                </div>

                {news.author && (
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-[10px] font-[family-name:var(--font-display)] font-medium text-[var(--accent)] uppercase tracking-wider bg-[var(--accent-muted)] px-2 py-0.5 rounded-md">
                            {news.author}
                        </span>
                    </div>
                )}

                {news.description && (
                    <p className="text-sm text-[var(--text-secondary)] line-clamp-2 leading-relaxed">
                        {news.description.trim()}
                    </p>
                )}

                <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[var(--accent)] font-[family-name:var(--font-display)] font-medium text-xs transition-all">
                        <span>Read Report</span>
                        <FaChevronRight size={8} />
                    </div>

                    <NewsShareMenu
                        shareUrl={`${getSiteOrigin()}${getNewsSharePath(news.title)}`}
                    />
                </div>
            </div>
        </div>
    );
};


const LocalNews = () => {
    const [newsData, setNewsData] = useState<LocalNewsItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [activeTab, setActiveTab] = useState<'local' | 'national'>('local');
    const [itemsPerPage, setItemsPerPage] = useState(4);
    const [selectedNews, setSelectedNews] = useState<LocalNewsItem | null>(null);

    useEffect(() => {
        const calculateItemsPerPage = async () => {
            try {
                const [settingsRes, obituariesRes, adOneRes, adTwoRes, entRes, healthRes, sportsRes] = await Promise.all([
                    fetch(`/api/sanity/siteSettings`),
                    fetch(`/api/sanity/obituaries`),
                    fetch(`/api/sanity/advertisement?position=ad-one`),
                    fetch(`/api/sanity/advertisement?position=ad-two`),
                    fetch(`/api/sanity/categoryNews?type=entertainmentNews`),
                    fetch(`/api/sanity/categoryNews?type=healthNews`),
                    fetch(`/api/sanity/categoryNews?type=sportsNews`)
                ]);

                const settingsData = await settingsRes.json();
                const obituariesData = await obituariesRes.json();
                const adOneData = await adOneRes.json();
                const adTwoData = await adTwoRes.json();
                const entData = await entRes.json();
                const healthData = await healthRes.json();
                const sportsData = await sportsRes.json();

                const hasCategoryNews =
                    (Array.isArray(entData) && entData.length > 0) ||
                    (Array.isArray(healthData) && healthData.length > 0) ||
                    (Array.isArray(sportsData) && sportsData.length > 0);

                // Check if any category news has pagination (more than 6 items = pagination active)
                const hasCategoryPagination =
                    (Array.isArray(entData) && entData.length > 2) ||
                    (Array.isArray(healthData) && healthData.length > 2) ||
                    (Array.isArray(sportsData) && sportsData.length > 2);

                let count = hasCategoryNews ? 3 : 2;

                if (adOneData && adOneData.active && !adOneData.error) count += 1;
                if (adTwoData && adTwoData.active && !adTwoData.error) count += 1;
                if (Array.isArray(obituariesData) && obituariesData.length > 0) count += 1;
                if (settingsData && settingsData.heroSectionVisible === false) count += 2;

                // Add +1 if category news has pagination
                if (hasCategoryPagination) count += 1;

                // Override for mobile: Irrespective of anything else, 5 per page on mobile
                if (window.innerWidth < 640) {
                    setItemsPerPage(5);
                    return;
                }

                setItemsPerPage(count);
            } catch (error) {
                console.error("Error calculating items per page:", error);

                // Fallback for mobile even on error
                if (typeof window !== 'undefined' && window.innerWidth < 640) {
                    setItemsPerPage(5);
                } else {
                    setItemsPerPage(4);
                }
            }
        };

        calculateItemsPerPage();
        window.addEventListener('resize', calculateItemsPerPage);
        const interval = setInterval(calculateItemsPerPage, 5 * 60 * 1000);
        return () => {
            clearInterval(interval);
            window.removeEventListener('resize', calculateItemsPerPage);
        };
    }, []);

    useEffect(() => {
        const handleGlobalUrl = async () => {
            let path = window.location.pathname;
            let hash = window.location.hash;
            try {
                path = decodeURIComponent(window.location.pathname);
                hash = decodeURIComponent(window.location.hash);
            } catch (e) {
                console.warn("Failed to decode URL path/hash", e);
            }

            // Handle new professional path (e.g., /news/title)
            if (path.startsWith('/news/')) {
                const currentSlug = decodeSlug(path.replace('/news/', ''));

                // 1. Try finding in current newsData
                const index = newsData.findIndex(item => slugify(item.title) === currentSlug);

                if (index !== -1) {
                    const page = Math.floor(index / itemsPerPage) + 1;
                    if (page !== currentPage) {
                        setCurrentPage(page);
                    }
                    setSelectedNews(newsData[index]);
                    return;
                }

                // 2. Search other category if needed
                if (newsData.length > 0) {
                    const otherTab = activeTab === 'local' ? 'national' : 'local';
                    const endpoint = otherTab === 'local' ? '/api/sanity/localNews' : '/api/sanity/nationalNews';

                    try {
                        const res = await fetch(`${endpoint}`);
                        const otherData = await res.json();
                        const otherIndex = otherData.findIndex((item: any) => slugify(item.title) === currentSlug);

                        if (otherIndex !== -1) {
                            setActiveTab(otherTab);
                            setSelectedNews(otherData[otherIndex]);
                            return;
                        }
                    } catch (e) {
                        console.error("Error searching other tab for story:", e);
                    }
                }
                return;
            }

            // Handle legacy slash-hashes (backward compatibility)
            if (hash.startsWith('#news/')) {
                const currentSlug = decodeSlug(hash.replace('#news/', ''));
                const index = newsData.findIndex(item => slugify(item.title) === currentSlug);
                if (index !== -1) {
                    setSelectedNews(newsData[index]);
                }
                return;
            }

            // Handle legacy dash-hashes
            if (hash.startsWith('#news-')) {
                const id = hash.replace('#news-', '');
                const index = newsData.findIndex(item => item._id === id);
                if (index !== -1) {
                    setSelectedNews(newsData[index]);
                }
                return;
            }

            if (!isNewsModalUrl(path, hash)) {
                setSelectedNews(null);
            }
        };

        window.addEventListener('popstate', handleGlobalUrl);
        window.addEventListener('hashchange', handleGlobalUrl);

        if (newsData.length > 0) {
            handleGlobalUrl();
        } else if (window.location.pathname.startsWith('/news/')) {
            handleGlobalUrl();
        }

        return () => {
            window.removeEventListener('popstate', handleGlobalUrl);
            window.removeEventListener('hashchange', handleGlobalUrl);
        };
    }, [newsData, itemsPerPage, currentPage, activeTab]);

    useEffect(() => {
        setLoading(true);
        const endpoint = activeTab === 'local' ? '/api/sanity/localNews' : '/api/sanity/nationalNews';

        fetch(`${endpoint}`)
            .then((res) => res.json())
            .then((data) => {
                setNewsData(data);
                setLoading(false);
                if (!window.location.hash.startsWith('#news-')) {
                    setCurrentPage(1);
                }
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
            document.getElementById('local-news')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    const renderLoader = () => (
        <div className="flex flex-col gap-4">
            {Array.from({ length: 3 }).map((_, idx) => (
                <div key={idx} className="surface-card p-4 flex flex-col sm:flex-row gap-4">
                    <div className="h-40 sm:h-36 w-full sm:w-44 flex-shrink-0 skeleton rounded-xl" />
                    <div className="flex-1 space-y-3 w-full">
                        <div className="h-5 skeleton w-3/4" />
                        <div className="h-4 skeleton w-full" />
                        <div className="h-4 skeleton w-5/6" />
                    </div>
                </div>
            ))}
        </div>
    );

    return (
        <div id="local-news" className="w-full">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3 mb-3 sm:mb-4">
                <SectionHeader
                    title={activeTab === 'local' ? 'Local News' : 'National News'}
                    compact
                />

                <div className="tab-group w-fit flex-shrink-0">
                    <button
                        onClick={() => setActiveTab('local')}
                        className={`tab-item ${activeTab === 'local' ? 'tab-item-active' : ''}`}
                    >
                        Local
                    </button>
                    <button
                        onClick={() => setActiveTab('national')}
                        className={`tab-item ${activeTab === 'national' ? 'tab-item-active' : ''}`}
                    >
                        National
                    </button>
                </div>
            </div>

            {loading ? renderLoader() : (
                <>
                    {newsData.length === 0 ? (
                        <div className="surface-card p-12 text-center">
                            <p className="text-[var(--text-secondary)] text-sm">No {activeTab} news available at the moment.</p>
                        </div>
                    ) : (
                        <>
                            <motion.div 
                                className="flex flex-col gap-4 sm:gap-6"
                                drag="x"
                                dragConstraints={{ left: 0, right: 0 }}
                                onDragEnd={(event, info) => {
                                    if (window.innerWidth >= 640) return; // Only for mobile
                                    const threshold = 50;
                                    if (info.offset.x < -threshold) {
                                        // Swipe left -> next page
                                        handlePageChange(currentPage + 1);
                                    } else if (info.offset.x > threshold) {
                                        // Swipe right -> prev page
                                        handlePageChange(currentPage - 1);
                                    }
                                }}
                            >
                                {currentNews.map((news) => (
                                    <LocalNewsItem
                                        key={news._id}
                                        news={news}
                                        onOpen={(item) => {
                                            window.history.pushState(null, '', getNewsSharePath(item.title));
                                            setSelectedNews(item);
                                        }}
                                    />
                                ))}
                            </motion.div>

                            <AnimatePresence>
                                {selectedNews && (
                                    <NewsReportModal
                                        news={selectedNews}
                                        onClose={() => {
                                            setSelectedNews(null);
                                            navigateBackFromNewsModal();
                                        }}
                                        onNext={() => {
                                            const idx = newsData.findIndex(n => n._id === selectedNews._id);
                                            if (idx !== -1 && idx < newsData.length - 1) {
                                                const nextItem = newsData[idx + 1];
                                                window.history.replaceState(null, '', getNewsSharePath(nextItem.title));
                                                setSelectedNews(nextItem);
                                            }
                                        }}
                                        onPrev={() => {
                                            const idx = newsData.findIndex(n => n._id === selectedNews._id);
                                            if (idx > 0) {
                                                const prevItem = newsData[idx - 1];
                                                window.history.replaceState(null, '', getNewsSharePath(prevItem.title));
                                                setSelectedNews(prevItem);
                                            }
                                        }}
                                    />
                                )}
                            </AnimatePresence>

                            {totalPages > 1 && (
                                <div className="flex justify-center items-center gap-2 sm:gap-3 mt-10 mb-4 sm:mt-8 sm:mb-0 px-1">
                                    <button
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className={`pagination-btn ${currentPage === 1 ? "pagination-btn-disabled" : "pagination-btn-enabled"}`}
                                        aria-label="Previous page"
                                    >
                                        <FaChevronLeft size={12} />
                                        <span className="text-sm font-bold">Prev</span>
                                    </button>

                                    <div className="flex items-center gap-1 sm:gap-2">
                                        {(() => {
                                            const pages: number[] = [];
                                            pages.push(1);

                                            if (currentPage !== 1 && currentPage !== totalPages) {
                                                pages.push(currentPage);
                                            }

                                            if (totalPages > 1) {
                                                pages.push(totalPages);
                                            }

                                            return pages.map((page) => (
                                                <button
                                                    key={`page-${page}`}
                                                    onClick={() => handlePageChange(page)}
                                                    className={`pagination-page ${currentPage === page ? "pagination-page-current" : "pagination-page-default"}`}
                                                >
                                                    {page}
                                                </button>
                                            ));
                                        })()}
                                    </div>

                                    <button
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        className={`pagination-btn ${currentPage === totalPages ? "pagination-btn-disabled" : "pagination-btn-enabled"}`}
                                        aria-label="Next page"
                                    >
                                        <span className="text-sm font-bold">Next</span>
                                        <FaChevronRight size={12} />
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </>
            )}
        </div>
    );
};

export default LocalNews;
