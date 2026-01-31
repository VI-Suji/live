import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { FaChevronLeft, FaChevronRight, FaShareAlt, FaWhatsapp, FaFacebookF, FaInstagram, FaLink, FaCheck, FaTimes, FaCalendarAlt, FaUser, FaClock } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const slugify = (text: string) => {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^\u0D00-\u0D7F\w\s-]/g, '') // Keep Malayalam, alphanumeric, spaces, hyphens
        .replace(/\s+/g, '-') // Spaces to hyphens
        .replace(/-+/g, '-') // Multiple hyphens to single
        .substring(0, 60); // Max length
};

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
            className="group bg-white rounded-2xl p-2.5 transition-all duration-300 border border-gray-100 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-500/5 flex flex-col gap-4 cursor-pointer relative h-full overflow-hidden"
        >
            <div className="relative aspect-[16/9] w-full overflow-hidden bg-gray-50 rounded-2xl border border-gray-100">
                <Image
                    src={news.image || "/gramika.png"}
                    alt={news.title}
                    fill
                    className="object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>

            <div className="flex flex-col flex-1 px-2 pb-2">
                <h3 className="text-base font-bold text-gray-900 leading-snug mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {news.title}
                </h3>

                {news.author && (
                    <div className="flex items-center gap-2 mb-3">
                        <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-2.5 py-1 rounded-lg">
                            {news.author}
                        </span>
                    </div>
                )}

                {news.description && (
                    <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed mb-4">
                        {news.description}
                    </p>
                )}

                <div className="mt-auto flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-blue-600 font-bold text-[10px] uppercase tracking-wider">
                        <span>Read Report</span>
                        <FaChevronRight size={7} className="transition-transform group-hover:translate-x-1" />
                    </div>

                    <CategoryShareButton news={news} />
                </div>
            </div>
        </div>
    );
};

const CategoryShareButton = ({ news }: { news: CategoryNewsItemData }) => {
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
                className="p-1.5 rounded-full bg-gray-100 hover:bg-blue-50 text-gray-600 hover:text-blue-600 transition-all"
                aria-label="Share"
            >
                <FaShareAlt size={12} />
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
                            <FaWhatsapp size={14} />
                        </a>
                        <a
                            href={shareLinks.facebook}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={handleLinkClick}
                            className="p-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 transition-all"
                            aria-label="Share on Facebook"
                        >
                            <FaFacebookF size={14} />
                        </a>
                        <a
                            href={shareLinks.instagram}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={handleLinkClick}
                            className="p-2 rounded-lg bg-pink-50 hover:bg-pink-100 text-pink-600 transition-all"
                            aria-label="Share on Instagram"
                        >
                            <FaInstagram size={14} />
                        </a>
                        <button
                            onClick={copyToClipboard}
                            className="p-2 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-600 transition-all"
                            aria-label="Copy link"
                        >
                            {copied ? <FaCheck size={14} className="text-green-600" /> : <FaLink size={14} />}
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const NewsModal = ({ news, onClose, onNext, onPrev }: { news: CategoryNewsItemData, onClose: () => void, onNext?: () => void, onPrev?: () => void }) => {
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
                            className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-full transition-all"
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
                                            className="w-9 h-9 flex items-center justify-center bg-pink-50 text-pink-500 hover:bg-pink-500 hover:text-white rounded-full transition-all shadow-sm" title="Share on Instagram">
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

                        {/* Article Footer Navigation & Share */}
                        <div className="mt-12 pt-8 border-t border-gray-100 pb-16">
                            <div className="flex flex-col items-center gap-8">
                                <div className="w-full flex flex-col sm:flex-row items-center gap-6 sm:gap-4">
                                    {/* Navigation Row - Full width on mobile, separate items on desktop */}
                                    <div className="w-full flex items-center justify-between sm:contents order-2 sm:order-none">
                                        {/* Prev Hint */}
                                        <div className="sm:flex-1">
                                            <button
                                                onClick={onPrev}
                                                disabled={!onPrev}
                                                className="group flex flex-col items-start gap-1.5 opacity-60 hover:opacity-100 disabled:opacity-20 transition-all text-left w-fit"
                                            >
                                                <div className="flex items-center gap-2">
                                                    <motion.div
                                                        animate={{ x: [0, -4, 0] }}
                                                        transition={{ repeat: Infinity, duration: 2 }}
                                                        className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100"
                                                    >
                                                        <FaChevronLeft size={10} />
                                                    </motion.div>
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 sm:hidden">Swipe</span>
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 hidden sm:block whitespace-nowrap">Click Left Arrow</span>
                                                </div>
                                                <span className="text-[8px] sm:text-[9px] font-bold text-gray-400 uppercase tracking-tighter ml-1 sm:ml-0">Previous</span>
                                            </button>
                                        </div>

                                        {/* Next Hint (Mobile Only Position) */}
                                        <div className="sm:hidden">
                                            <button
                                                onClick={onNext}
                                                disabled={!onNext}
                                                className="group flex flex-col items-end gap-1.5 opacity-60 hover:opacity-100 disabled:opacity-20 transition-all text-right w-fit"
                                            >
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-blue-600">Swipe</span>
                                                    <motion.div
                                                        animate={{ x: [0, 4, 0] }}
                                                        transition={{ repeat: Infinity, duration: 2 }}
                                                        className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100"
                                                    >
                                                        <FaChevronRight size={10} />
                                                    </motion.div>
                                                </div>
                                                <span className="text-[8px] font-bold text-gray-400 uppercase tracking-tighter mr-1">Next</span>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Share Center - Stacked on mobile, middle on desktop */}
                                    <div className="w-full sm:w-auto order-1 sm:order-none">
                                        <div className="flex flex-col items-center gap-3 sm:gap-4 px-6 sm:px-8 py-3 sm:py-4 bg-gray-50/50 rounded-[2rem] border border-gray-100">
                                            <p className="text-[9px] sm:text-[10px] text-gray-400 font-black uppercase tracking-[0.3em]">Share Report</p>
                                            <div className="flex items-center gap-2 sm:gap-3">
                                                <a href={shareLinks.whatsapp} target="_blank" rel="noopener noreferrer"
                                                    className="w-9 h-9 sm:w-11 sm:h-11 flex items-center justify-center bg-white text-[#25D366] hover:bg-[#25D366] hover:text-white rounded-xl transition-all shadow-sm border border-gray-100 group">
                                                    <FaWhatsapp size={18} className="group-hover:scale-110 transition-transform" />
                                                </a>
                                                <a href={shareLinks.facebook} target="_blank" rel="noopener noreferrer"
                                                    className="w-9 h-9 sm:w-11 sm:h-11 flex items-center justify-center bg-white text-[#1877F2] hover:bg-[#1877F2] hover:text-white rounded-xl transition-all shadow-sm border border-gray-100 group">
                                                    <FaFacebookF size={18} className="group-hover:scale-110 transition-transform" />
                                                </a>
                                                <a href={shareLinks.instagram} target="_blank" rel="noopener noreferrer"
                                                    className="w-9 h-9 sm:w-11 sm:h-11 flex items-center justify-center bg-white text-[#E4405F] hover:bg-[#E4405F] hover:text-white rounded-xl transition-all shadow-sm border border-gray-100 group">
                                                    <FaInstagram size={18} className="group-hover:scale-110 transition-transform" />
                                                </a>
                                                <button onClick={copyToClipboard}
                                                    className={`w-9 h-9 sm:w-11 sm:h-11 flex items-center justify-center rounded-xl transition-all shadow-sm border group ${copied ? 'bg-green-600 text-white border-green-600' : 'bg-white text-gray-600 hover:bg-blue-600 hover:text-white border-gray-100'}`}>
                                                    {copied ? <FaCheck size={16} /> : <FaLink size={16} className="group-hover:scale-110 transition-transform" />}
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Next Hint (Desktop Position) */}
                                    <div className="hidden sm:flex flex-1 justify-end">
                                        <button
                                            onClick={onNext}
                                            disabled={!onNext}
                                            className="group flex flex-col items-end gap-2 opacity-60 hover:opacity-100 disabled:opacity-20 transition-all text-right w-fit"
                                        >
                                            <div className="flex items-center gap-2">
                                                <span className="text-[10px] font-black uppercase tracking-widest text-blue-600">Click Right Arrow</span>
                                                <motion.div
                                                    animate={{ x: [0, 4, 0] }}
                                                    transition={{ repeat: Infinity, duration: 2 }}
                                                    className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100"
                                                >
                                                    <FaChevronRight size={10} />
                                                </motion.div>
                                            </div>
                                            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">Next Story</span>
                                        </button>
                                    </div>
                                </div>

                                {/* <div className="flex items-center gap-4 text-gray-200">
                                    <div className="h-[1px] w-12 bg-gray-100"></div>
                                    <div className="flex items-center gap-2">
                                        <kbd className="px-1.5 py-0.5 rounded border border-gray-200 bg-white text-[9px] font-black text-gray-400">ESC</kbd>
                                        <span className="text-[9px] font-black uppercase tracking-widest">to close</span>
                                    </div>
                                    <div className="h-[1px] w-12 bg-gray-100"></div>
                                </div> */}
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

const CategoryNewsComponent = () => {
    const [newsData, setNewsData] = useState<CategoryNewsItemData[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [activeTab, setActiveTab] = useState<'entertainmentNews' | 'healthNews' | 'sportsNews'>('entertainmentNews');
    const [selectedNews, setSelectedNews] = useState<CategoryNewsItemData | null>(null);
    const itemsPerPage = 2;

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

            if (path.startsWith('/news/')) {
                const currentSlug = path.replace('/news/', '');
                const index = newsData.findIndex(item => slugify(item.title) === currentSlug);

                if (index !== -1) {
                    const page = Math.floor(index / itemsPerPage) + 1;
                    if (page !== currentPage) {
                        setCurrentPage(page);
                    }
                    setSelectedNews(newsData[index]);
                    return;
                }

                if (newsData.length > 0) {
                    const tabs: ('entertainmentNews' | 'healthNews' | 'sportsNews')[] = ['entertainmentNews', 'healthNews', 'sportsNews'];
                    for (const tab of tabs) {
                        if (tab === activeTab) continue;
                        try {
                            const res = await fetch(`/api/sanity/categoryNews?type=${tab}&t=${Date.now()}`);
                            const data = await res.json();
                            const storyIndex = data.findIndex((item: any) => slugify(item.title) === currentSlug);
                            if (storyIndex !== -1) {
                                setActiveTab(tab);
                                setSelectedNews(data[storyIndex]);
                                return;
                            }
                        } catch (e) { }
                    }
                }
                return;
            }

            // Legacy hash support
            if (hash.startsWith('#news/')) {
                const currentSlug = hash.replace('#news/', '');
                const index = newsData.findIndex(item => slugify(item.title) === currentSlug);
                if (index !== -1) setSelectedNews(newsData[index]);
                return;
            }
        };

        window.addEventListener('popstate', handleGlobalUrl);
        window.addEventListener('hashchange', handleGlobalUrl);
        if (newsData.length > 0) handleGlobalUrl();
        else if (window.location.pathname.startsWith('/news/')) handleGlobalUrl();

        return () => {
            window.removeEventListener('popstate', handleGlobalUrl);
            window.removeEventListener('hashchange', handleGlobalUrl);
        };
    }, [newsData, itemsPerPage, currentPage, activeTab]);

    useEffect(() => {
        setLoading(true);
        fetch(`/api/sanity/categoryNews?type=${activeTab}&t=${Date.now()}`)
            .then((res) => res.json())
            .then((data) => {
                setNewsData(Array.isArray(data) ? data : []);
                setLoading(false);
                if (!window.location.pathname.startsWith('/news/')) {
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
        <div className="w-full mt-8">
            <div id="category-news-header" className="mb-8 overflow-hidden">
                <div className="flex flex-col gap-6">
                    <div className="flex items-center gap-6">
                        <div className="w-1.5 h-8 bg-blue-600 rounded-full"></div>
                        <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">
                            {activeTab === 'entertainmentNews' ? 'Entertainment News' : activeTab === 'healthNews' ? 'Health News' : 'Sports News'}
                        </h2>
                    </div>

                    <div className="flex border-b border-gray-200">
                        {(['entertainmentNews', 'healthNews', 'sportsNews'] as const).map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-6 py-4 text-xs font-black uppercase tracking-widest transition-all relative ${activeTab === tab
                                    ? "text-blue-600"
                                    : "text-gray-400 hover:text-gray-600"
                                    }`}
                            >
                                {tab.replace('News', '')}
                                {activeTab === tab && (
                                    <motion.div
                                        layoutId="tab-underline"
                                        className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-t-full"
                                    />
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {loading ? renderLoader() : (
                <>
                    {newsData.length === 0 ? (
                        <div className="bg-white rounded-3xl p-12 text-center border-2 border-gray-50">
                            <p className="text-gray-400 text-sm font-bold uppercase tracking-widest">No stories available.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {currentNews.map((news) => (
                                <CategoryNewsItem
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
                    )}

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
                </>
            )}

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
                                    key={page}
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
        </div>
    );
};

export default CategoryNewsComponent;
