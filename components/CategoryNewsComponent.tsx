import React, { useEffect, useState } from "react";
import Image from "next/image";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import { getNewsSharePath } from "../utils/slugify";
import { getCanonicalNewsShareUrl } from "../utils/shareMeta";
import NewsShareMenu from "./NewsShareMenu";
import SectionHeader from "./SectionHeader";

interface CategoryNewsItemData {
    _id: string;
    title: string;
    image: string;
    description?: string;
    author?: string;
    publishedAt: string;
}

const CategoryNewsItem = ({ news, onOpen }: { news: CategoryNewsItemData, onOpen: (news: CategoryNewsItemData) => void }) => {
    return (
        <div
            onClick={() => onOpen(news)}
            className="group surface-card surface-card-interactive p-3 flex flex-col gap-3 cursor-pointer relative h-full overflow-hidden"
        >
            <div className="image-frame relative aspect-[16/9] w-full">
                <Image
                    src={news.image || "/gramika.png"}
                    alt={news.title}
                    fill
                    className="object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>

            <div className="flex flex-col flex-1 px-2 pb-2">
                <h3 className="text-sm sm:text-base font-medium text-[var(--text-primary)] leading-snug mb-1.5 group-hover:text-[var(--accent)] transition-colors line-clamp-2">
                    {news.title}
                </h3>

                {news.author && (
                    <div className="flex items-center gap-2 mb-3">
                        <span className="text-[10px] font-[family-name:var(--font-display)] font-medium text-[var(--accent)] uppercase tracking-wider bg-[var(--accent-muted)] px-2 py-0.5 rounded-md">
                            {news.author}
                        </span>
                    </div>
                )}

                {news.description && (
                    <p className="text-xs text-[var(--text-secondary)] line-clamp-2 leading-relaxed mb-3">
                        {news.description.trim()}
                    </p>
                )}

                <div className="mt-auto flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-[var(--accent)] font-[family-name:var(--font-display)] font-medium text-[10px]">
                        <span>Read Report</span>
                        <FaChevronRight size={7} className="transition-transform group-hover:translate-x-1" />
                    </div>

                    <NewsShareMenu
                        shareUrl={getCanonicalNewsShareUrl(news.title)}
                        size="sm"
                    />
                </div>
            </div>
        </div>
    );
};


const CategoryNewsComponent = ({ latestNewsVisible = true }: { latestNewsVisible?: boolean }) => {
    const router = useRouter();
    const [newsData, setNewsData] = useState<CategoryNewsItemData[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [activeTab, setActiveTab] = useState<'entertainmentNews' | 'healthNews' | 'sportsNews'>('entertainmentNews');
    const [itemsPerPage, setItemsPerPage] = useState(2);
    const [isMobile, setIsMobile] = useState(false);

    const openArticle = (item: CategoryNewsItemData) => {
        void router.push(getNewsSharePath(item.title));
    };

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 1024);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, [isMobile]);

    useEffect(() => {
        if (!latestNewsVisible) {
            setItemsPerPage(6);
            return;
        }

        // Fetch to check if latest news exists in order to adjust grid layout
        fetch(`/api/sanity/latestNews`)
            .then(res => res.json())
            .then(data => {
                if (data.error || (Array.isArray(data) && data.length === 0)) {
                    setItemsPerPage(6);
                } else {
                    setItemsPerPage(2);
                }
            })
            .catch(() => setItemsPerPage(6));
    }, [latestNewsVisible]);

    useEffect(() => {
        setLoading(true);
        fetch(`/api/sanity/categoryNews?type=${activeTab}`)
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

    const effectiveItemsPerPage = isMobile ? 2 : itemsPerPage;
    const totalPages = Math.ceil(newsData.length / effectiveItemsPerPage);
    const currentNews = newsData.slice(
        (currentPage - 1) * effectiveItemsPerPage,
        currentPage * effectiveItemsPerPage
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Array.from({ length: 2 }).map((_, idx) => (
                <div key={idx} className="surface-card p-3 flex flex-col gap-3">
                    <div className="aspect-[16/9] w-full skeleton rounded-xl" />
                    <div className="h-4 skeleton w-3/4" />
                    <div className="h-3 skeleton w-full" />
                </div>
            ))}
        </div>
    );

    return (
        <div className="w-full">
            <div id="category-news-header" className="mb-4">
                <SectionHeader title="Category News" compact align="center-mobile-left" className="mb-3" />

                <div className="flex border-b border-[var(--border-subtle)]">
                    {(['entertainmentNews', 'healthNews', 'sportsNews'] as const).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 sm:px-5 py-3 text-xs font-[family-name:var(--font-display)] font-medium uppercase tracking-wider transition-all relative ${
                                activeTab === tab
                                    ? "text-[var(--accent)]"
                                    : "text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]"
                            }`}
                        >
                            {tab.replace('News', '')}
                            {activeTab === tab && (
                                <motion.div
                                    layoutId="tab-underline"
                                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--accent)]"
                                />
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {loading ? renderLoader() : (
                <>
                    {newsData.length === 0 ? (
                        <div className="surface-card p-10 text-center">
                            <p className="text-[var(--text-tertiary)] text-xs font-[family-name:var(--font-display)] font-medium uppercase tracking-wider">No stories available</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {currentNews.map((news) => (
                                <CategoryNewsItem
                                    key={news._id}
                                    news={news}
                                    onOpen={openArticle}
                                />
                            ))}
                        </div>
                    )}

                    {totalPages > 1 && (
                        <div className="flex justify-center items-center gap-2 sm:gap-3 mt-10 mb-2 sm:mt-8 sm:mb-0 px-1">
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
                                            key={page}
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
        </div>
    );
};

export default CategoryNewsComponent;
