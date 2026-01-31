"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { FaChevronLeft, FaChevronRight, FaShareAlt, FaWhatsapp, FaFacebookF, FaInstagram, FaLink, FaCheck, FaTimes, FaCalendarAlt, FaUser, FaClock } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

type LocalNewsItem = {
    _id: string;
    title: string;
    image: string;
    description?: string;
    author?: string;
    publishedAt: string;
};

const slugify = (text: string) => {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^\u0D00-\u0D7F\w\s-]/g, '') // Keep Malayalam, alphanumeric, spaces, hyphens
        .replace(/\s+/g, '-') // Spaces to hyphens
        .replace(/-+/g, '-') // Multiple hyphens to single
        .substring(0, 60); // Max length
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
    }, [news._id, onOpen]);

    return (
        <div
            id={`news-${news._id}`}
            onClick={() => onOpen(news)}
            className={`group bg-white rounded-2xl sm:rounded-3xl p-2 sm:p-4 transition-all duration-500 border-2 items-start relative cursor-pointer
                ${isHighlighted ? 'border-blue-500 shadow-2xl ring-4 ring-blue-100 scale-[1.02]' : 'border-transparent hover:border-gray-100 shadow-sm hover:shadow-xl'} 
                flex flex-col sm:flex-row gap-4 sm:gap-6`}
        >
            <div className="relative h-40 sm:h-40 w-full sm:w-64 flex-shrink-0 rounded-xl sm:rounded-2xl overflow-hidden bg-gray-50 border border-gray-100">
                <Image
                    src={news.image || "/gramika.png"}
                    alt={news.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
            </div>
            <div className="flex-1 px-2 sm:px-0 w-full">
                <div className="flex justify-between items-start gap-2">
                    <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 leading-tight transition-colors mb-2 sm:mb-3 group-hover:text-blue-600">
                        {news.title}
                    </h3>
                </div>

                {news.author && (
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-2 py-0.5 rounded">
                            {news.author}
                        </span>
                    </div>
                )}

                {news.description && (
                    <p className="text-sm sm:text-base text-gray-500 line-clamp-2 leading-relaxed">
                        {news.description}
                    </p>
                )}

                <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-widest transition-all">
                        <span>Read Report</span>
                        <FaChevronRight size={8} />
                    </div>

                    <ShareButton news={news} />
                </div>
            </div>
        </div>
    );
};

const ShareButton = ({ news }: { news: LocalNewsItem }) => {
    const [showShare, setShowShare] = useState(false);
    const [copied, setCopied] = useState(false);

    const getShareUrl = () => {
        if (typeof window === 'undefined') return '';
        const slug = slugify(news.title);
        return `${window.location.origin}/news/${slug}`;
    };

    const shareLinks = {
        whatsapp: `https://wa.me/?text=${encodeURIComponent(news.title + "\n" + getShareUrl())}`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(getShareUrl())}`,
        instagram: `https://www.instagram.com/`,
    };

    const copyToClipboard = (e: React.MouseEvent) => {
        e.stopPropagation();
        navigator.clipboard.writeText(getShareUrl());
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleShareClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setShowShare(!showShare);
    };

    const handleLinkClick = (e: React.MouseEvent) => {
        e.stopPropagation();
    };

    return (
        <div className="relative">
            <button
                onClick={handleShareClick}
                className="p-2 rounded-full bg-gray-100 hover:bg-blue-50 text-gray-600 hover:text-blue-600 transition-all"
                aria-label="Share"
            >
                <FaShareAlt size={14} />
            </button>

            <AnimatePresence>
                {showShare && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: -10 }}
                        className="absolute right-0 bottom-full mb-2 bg-white rounded-xl shadow-2xl border border-gray-200 p-2 flex gap-2 z-50"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <a
                            href={shareLinks.whatsapp}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={handleLinkClick}
                            className="p-2 rounded-lg bg-green-50 hover:bg-green-100 text-green-600 transition-all"
                            aria-label="Share on WhatsApp"
                        >
                            <FaWhatsapp size={16} />
                        </a>
                        <a
                            href={shareLinks.facebook}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={handleLinkClick}
                            className="p-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 transition-all"
                            aria-label="Share on Facebook"
                        >
                            <FaFacebookF size={16} />
                        </a>
                        <a
                            href={shareLinks.instagram}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={handleLinkClick}
                            className="p-2 rounded-lg bg-pink-50 hover:bg-pink-100 text-pink-600 transition-all"
                            aria-label="Share on Instagram"
                        >
                            <FaInstagram size={16} />
                        </a>
                        <button
                            onClick={copyToClipboard}
                            className="p-2 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-600 transition-all"
                            aria-label="Copy link"
                        >
                            {copied ? <FaCheck size={16} className="text-green-600" /> : <FaLink size={16} />}
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const NewsModal = ({ news, onClose, onNext, onPrev }: { news: LocalNewsItem, onClose: () => void, onNext?: () => void, onPrev?: () => void }) => {
    const [copied, setCopied] = useState(false);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight' && onNext) onNext();
            if (e.key === 'ArrowLeft' && onPrev) onPrev();
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onNext, onPrev, onClose]);

    // Touch Navigation
    const [touchStart, setTouchStart] = useState<number | null>(null);
    const [touchEnd, setTouchEnd] = useState<number | null>(null);
    const minSwipeDistance = 50;

    const onTouchStart = (e: React.TouchEvent) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    };

    const onTouchMove = (e: React.TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;

        if (isLeftSwipe && onNext) onNext();
        if (isRightSwipe && onPrev) onPrev();
    };

    const getShareUrl = () => {
        if (typeof window === 'undefined') return '';
        const slug = slugify(news.title);
        return `${window.location.origin}/news/${slug}`;
    };

    const shareLinks = {
        whatsapp: `https://wa.me/?text=${encodeURIComponent(news.title + "\n" + getShareUrl())}`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(getShareUrl())}`,
        instagram: `https://www.instagram.com/`,
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(getShareUrl());
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-0 sm:p-4 lg:p-8"
            onClick={onClose}
        >
            <motion.div
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 40, opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="bg-white w-full max-w-4xl h-full sm:h-auto sm:max-h-[90vh] sm:rounded-2xl overflow-hidden relative shadow-2xl flex flex-col"
                onClick={(e) => e.stopPropagation()}
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
            >
                {/* Header Bar */}
                <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-gray-100 bg-white sticky top-0 z-50">
                    <div className="flex items-center gap-3">
                        <div className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse" />
                        <span className="text-xs sm:text-sm font-black uppercase tracking-[0.2em] text-blue-600 hidden sm:block">Gramika News</span>
                        <span className="text-xs font-black uppercase tracking-[0.2em] text-blue-600 sm:hidden">Gramika</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="flex items-center bg-gray-50 rounded-full p-1 mr-2">
                            <button
                                onClick={onPrev}
                                disabled={!onPrev}
                                className={`w-8 h-8 flex items-center justify-center rounded-full transition-all ${onPrev
                                    ? "hover:bg-white hover:shadow-sm text-gray-700 hover:text-blue-600"
                                    : "text-gray-300 cursor-not-allowed"}`}
                                title="Previous Story (Left Arrow)"
                            >
                                <FaChevronLeft size={12} />
                            </button>
                            <div className="w-[1px] h-4 bg-gray-200 mx-1" />
                            <button
                                onClick={onNext}
                                disabled={!onNext}
                                className={`w-8 h-8 flex items-center justify-center rounded-full transition-all ${onNext
                                    ? "hover:bg-white hover:shadow-sm text-gray-700 hover:text-blue-600"
                                    : "text-gray-300 cursor-not-allowed"}`}
                                title="Next Story (Right Arrow)"
                            >
                                <FaChevronRight size={12} />
                            </button>
                        </div>

                        <button
                            onClick={onClose}
                            className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-gray-900 hover:bg-red-50 hover:text-red-500 rounded-full transition-all"
                            title="Close (Esc)"
                        >
                            <FaTimes size={20} />
                        </button>
                    </div>
                </div>

                <div className="overflow-y-auto flex-1">
                    <div className="max-w-3xl mx-auto px-6 py-10 sm:px-12">
                        {/* Article Header */}
                        <header className="mb-8">
                            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 leading-[1.1] mb-8 tracking-tight">
                                {news.title}
                            </h2>

                            <div className="flex flex-wrap items-center gap-y-4 gap-x-8 pt-8 border-t border-gray-100">
                                {news.author && (
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-blue-600 border border-gray-100">
                                            <FaUser size={16} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-0.5">Reported By</p>
                                            <p className="text-sm font-black text-gray-900">{news.author}</p>
                                        </div>
                                    </div>
                                )}

                                {news.author && <div className="h-8 w-[1px] bg-gray-100 hidden sm:block" />}

                                <div className="flex flex-col">
                                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-0.5">Published On</p>
                                    <div className="flex items-center gap-2 text-sm text-gray-900 font-bold">
                                        <FaCalendarAlt size={12} className="text-gray-400" />
                                        <span>{new Date(news.publishedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                                    </div>
                                </div>

                                <div className="h-8 w-[1px] bg-gray-100 hidden sm:block" />

                                <div className="flex flex-col">
                                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-2">Share on Socials</p>
                                    <div className="flex items-center gap-2">
                                        <a href={shareLinks.whatsapp} target="_blank" rel="noopener noreferrer"
                                            className="w-9 h-9 flex items-center justify-center bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366] hover:text-white rounded-full transition-all shadow-sm" title="Share on WhatsApp">
                                            <FaWhatsapp size={16} />
                                        </a>
                                        <a href={shareLinks.facebook} target="_blank" rel="noopener noreferrer"
                                            className="w-9 h-9 flex items-center justify-center bg-[#1877F2]/10 text-[#1877F2] hover:bg-[#1877F2] hover:text-white rounded-full transition-all shadow-sm" title="Share on Facebook">
                                            <FaFacebookF size={16} />
                                        </a>
                                        <a href={shareLinks.instagram} target="_blank" rel="noopener noreferrer"
                                            className="w-9 h-9 flex items-center justify-center bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white hover:opacity-90 rounded-full transition-all shadow-sm" title="Share on Instagram">
                                            <FaInstagram size={16} />
                                        </a>

                                        <div className="w-[1px] h-6 bg-gray-100 mx-1" />

                                        <button onClick={copyToClipboard}
                                            className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-[10px] uppercase tracking-widest transition-all shadow-sm ${copied ? 'bg-green-600 text-white shadow-green-100' : 'bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white'}`}>
                                            {copied ? <FaCheck size={12} /> : <FaLink size={12} />}
                                            <span>{copied ? 'Link Copied' : 'Copy Link'}</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </header>

                        {/* Article Image */}
                        <figure className="mb-12 relative rounded-xl overflow-hidden border border-gray-100 bg-gray-50 shadow-sm">
                            <div className="aspect-[16/9] relative">
                                <Image
                                    src={news.image || "/gramika.png"}
                                    alt={news.title}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        </figure>

                        {/* Article Content */}
                        <div className="prose prose-blue max-w-none">
                            <p className="text-gray-700 text-lg sm:text-xl leading-[1.8] whitespace-pre-line font-medium pb-12">
                                {(() => {
                                    if (!news.description) return null;
                                    const colonIndex = news.description.indexOf(':');
                                    if (colonIndex !== -1) {
                                        const prefix = news.description.substring(0, colonIndex + 1);
                                        const rest = news.description.substring(colonIndex + 1);
                                        return (
                                            <>
                                                <span className="font-black text-gray-950 mr-1">{prefix}</span>
                                                {rest}
                                            </>
                                        );
                                    }
                                    return news.description;
                                })()}
                            </p>
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
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
                    fetch("/api/sanity/siteSettings"),
                    fetch("/api/sanity/obituaries"),
                    fetch("/api/sanity/advertisement?position=ad-one"),
                    fetch("/api/sanity/advertisement?position=ad-two"),
                    fetch("/api/sanity/categoryNews?type=entertainmentNews"),
                    fetch("/api/sanity/categoryNews?type=healthNews"),
                    fetch("/api/sanity/categoryNews?type=sportsNews")
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
                if (settingsData && settingsData.heroSectionVisible === false) count += 1;

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
                const currentSlug = path.replace('/news/', '');

                // 1. Try finding in current newsData
                let index = newsData.findIndex(item => slugify(item.title) === currentSlug);

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
                        const res = await fetch(`${endpoint}?t=${Date.now()}`);
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
                const currentSlug = hash.replace('#news/', '');
                let index = newsData.findIndex(item => slugify(item.title) === currentSlug);
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

        fetch(`${endpoint}?t=${Date.now()}`)
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

    return (
        <div id="local-news" className="w-full mt-8 sm:mt-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
                <div className="flex items-center gap-3">
                    <div className="w-1.5 h-6 sm:h-8 bg-blue-600 rounded-full"></div>
                    <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
                        {activeTab === 'local' ? 'Local News' : 'National News'}
                    </h2>
                </div>

                <div className="flex bg-gray-100 p-1 rounded-xl sm:rounded-2xl w-fit">
                    <button
                        onClick={() => setActiveTab('local')}
                        className={`px-4 sm:px-6 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-sm font-bold transition-all ${activeTab === 'local'
                            ? "bg-white text-blue-600 shadow-sm"
                            : "text-gray-500 hover:text-gray-700"
                            }`}
                    >
                        Local
                    </button>
                    <button
                        onClick={() => setActiveTab('national')}
                        className={`px-4 sm:px-6 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-sm font-bold transition-all ${activeTab === 'national'
                            ? "bg-white text-blue-600 shadow-sm"
                            : "text-gray-500 hover:text-gray-700"
                            }`}
                    >
                        National
                    </button>
                </div>
            </div>

            {loading ? renderLoader() : (
                <>
                    {newsData.length === 0 ? (
                        <div className="bg-white rounded-3xl p-12 text-center border border-gray-100">
                            <p className="text-gray-500 font-medium">No {activeTab} news available at the moment.</p>
                        </div>
                    ) : (
                        <>
                            <div className="flex flex-col gap-4 sm:gap-6">
                                {currentNews.map((news) => (
                                    <LocalNewsItem
                                        key={news._id}
                                        news={news}
                                        onOpen={(item) => {
                                            const slug = slugify(item.title);
                                            window.history.pushState(null, '', `/news/${slug}`);
                                            setSelectedNews(item);
                                        }}
                                    />
                                ))}
                            </div>

                            <AnimatePresence>
                                {selectedNews && (
                                    <NewsModal
                                        news={selectedNews}
                                        onClose={() => {
                                            setSelectedNews(null);
                                            window.history.pushState(null, '', '/');
                                        }}
                                        onNext={() => {
                                            const idx = newsData.findIndex(n => n._id === selectedNews._id);
                                            if (idx !== -1 && idx < newsData.length - 1) {
                                                const nextItem = newsData[idx + 1];
                                                const slug = slugify(nextItem.title);
                                                window.history.pushState(null, '', `/news/${slug}`);
                                                setSelectedNews(nextItem);
                                            }
                                        }}
                                        onPrev={() => {
                                            const idx = newsData.findIndex(n => n._id === selectedNews._id);
                                            if (idx > 0) {
                                                const prevItem = newsData[idx - 1];
                                                const slug = slugify(prevItem.title);
                                                window.history.pushState(null, '', `/news/${slug}`);
                                                setSelectedNews(prevItem);
                                            }
                                        }}
                                    />
                                )}
                            </AnimatePresence>

                            {totalPages > 1 && (
                                <div className="flex justify-center items-center gap-2 sm:gap-3 mt-8">
                                    <button
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className={`px-4 h-10 rounded-xl flex items-center gap-2 transition-all ${currentPage === 1
                                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                            : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 shadow-sm"
                                            }`}
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
                                                    className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold transition-all ${currentPage === page
                                                        ? "bg-blue-600 text-white shadow-md transform scale-105"
                                                        : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
                                                        }`}
                                                >
                                                    {page}
                                                </button>
                                            ));
                                        })()}
                                    </div>

                                    <button
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        className={`px-4 h-10 rounded-xl flex items-center gap-2 transition-all ${currentPage === totalPages
                                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                            : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 shadow-sm"
                                            }`}
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
