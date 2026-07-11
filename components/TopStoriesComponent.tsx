"use client";

import React, { useState } from "react";
import { FaChevronLeft, FaChevronRight, FaArrowRight } from "react-icons/fa";
import { useRouter } from "next/router";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import NewsShareMenu from "./NewsShareMenu";
import { getStorySharePath } from "../utils/slugify";
import { getSiteOrigin } from "../utils/shareMeta";

const STORIES_PER_PAGE = 3;

function stripHtml(html?: string) {
    if (!html) return "";
    return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

type Post = {
    _id: string;
    title: string;
    slug: { current: string };
    mainImage?: string;
    excerpt?: string;
    publishedAt?: string;
    author?: string;
};

export default function TopStories() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const router = useRouter();

    React.useEffect(() => {
        fetch(`/api/sanity/topStories`)
            .then((res) => res.json())
            .then((data: Post[]) => { setPosts(data); setLoading(false); })
            .catch((err) => { console.error(err); setLoading(false); });
    }, []);

    const totalPages = Math.ceil(posts.length / STORIES_PER_PAGE);
    const pagePosts = posts.slice(
        (currentPage - 1) * STORIES_PER_PAGE,
        currentPage * STORIES_PER_PAGE
    );
    const featuredPost = pagePosts[0];
    const sidePosts = pagePosts.slice(1);

    React.useEffect(() => {
        if (currentPage > totalPages && totalPages > 0) {
            setCurrentPage(totalPages);
        }
    }, [posts.length, currentPage, totalPages]);

    function handleReadMore(post: Post) {
        router.push(`/story/${post.slug.current}`);
    }

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
            document.getElementById("top-stories")?.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

    const renderLoader = () => (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 lg:gap-4">
            <div className="lg:col-span-2 h-[300px] lg:h-[500px] rounded-2xl skeleton opacity-30" />
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-3 lg:gap-4">
                <div className="h-[180px] lg:h-[238px] rounded-2xl skeleton opacity-30" />
                <div className="h-[180px] lg:h-[238px] rounded-2xl skeleton opacity-30" />
            </div>
        </div>
    );

    if (!loading && posts.length === 0) return null;
    if (!loading && !featuredPost) return null;

    const paginationPages: number[] = [];
    paginationPages.push(1);
    if (currentPage !== 1 && currentPage !== totalPages) {
        paginationPages.push(currentPage);
    }
    if (totalPages > 1) {
        paginationPages.push(totalPages);
    }

    return (
        <div className="relative">
            {loading ? renderLoader() : (
                <>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 lg:gap-4">
                        <FeaturedSlot post={featuredPost} pageKey={currentPage} onRead={handleReadMore} />

                        {sidePosts.length > 0 && (
                            <div className={`grid gap-3 lg:gap-4 ${sidePosts.length >= 2 ? "grid-cols-2 lg:grid-cols-1" : "grid-cols-1"}`}>
                                {sidePosts.map((post, i) => (
                                    <SideSlot
                                        key={`${currentPage}-${post._id}`}
                                        post={post}
                                        index={i}
                                        pageKey={currentPage}
                                        onRead={handleReadMore}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    {totalPages > 1 && (
                        <div className="flex justify-center items-center gap-2 sm:gap-3 mt-8">
                            <button
                                type="button"
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className={`pagination-btn ${currentPage === 1 ? "pagination-btn-dark-disabled" : "pagination-btn-dark-enabled"}`}
                                aria-label="Previous page"
                            >
                                <FaChevronLeft size={12} />
                                <span className="text-sm font-bold">Prev</span>
                            </button>

                            <div className="flex items-center gap-1 sm:gap-2">
                                {paginationPages.map((page) => (
                                    <button
                                        key={`page-${page}`}
                                        type="button"
                                        onClick={() => handlePageChange(page)}
                                        className={`pagination-page ${currentPage === page ? "pagination-page-dark-current" : "pagination-page-dark-default"}`}
                                    >
                                        {page}
                                    </button>
                                ))}
                            </div>

                            <button
                                type="button"
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className={`pagination-btn ${currentPage === totalPages ? "pagination-btn-dark-disabled" : "pagination-btn-dark-enabled"}`}
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
}

function FeaturedSlot({
    post,
    pageKey,
    onRead,
}: {
    post: Post;
    pageKey: number;
    onRead: (p: Post) => void;
}) {
    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={`featured-${pageKey}-${post._id}`}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="lg:col-span-2"
            >
                <FeaturedCard post={post} onRead={onRead} size="large" />
            </motion.div>
        </AnimatePresence>
    );
}

function SideSlot({
    post,
    index,
    pageKey,
    onRead,
}: {
    post: Post;
    index: number;
    pageKey: number;
    onRead: (p: Post) => void;
}) {
    return (
        <AnimatePresence mode="popLayout">
            <motion.div
                key={`side-${pageKey}-${index}-${post._id}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25, delay: index * 0.05 }}
            >
                <FeaturedCard post={post} onRead={onRead} size="small" />
            </motion.div>
        </AnimatePresence>
    );
}

function FeaturedCard({ post, onRead, size }: { post: Post; onRead: (p: Post) => void; size: "large" | "small" }) {
    const heights = {
        large: "h-[300px] sm:h-[360px] lg:h-[500px]",
        small: "h-[180px] lg:h-[238px]",
    };

    return (
        <article
            onClick={() => onRead(post)}
            className={`group relative ${heights[size]} rounded-2xl overflow-hidden cursor-pointer border border-white/15 active:scale-[0.99] transition-transform`}
        >
            <StoryCardContent post={post} size={size} />
        </article>
    );
}

function StoryCardContent({ post, size }: { post: Post; size: "large" | "small" }) {
    const isLarge = size === "large";
    const [excerptExpanded, setExcerptExpanded] = useState(false);
    const excerptText = stripHtml(post.excerpt);

    React.useEffect(() => {
        setExcerptExpanded(false);
    }, [post._id]);

    return (
        <>
            <div className="absolute inset-0">
                {post.mainImage ? (
                    <Image
                        src={post.mainImage}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                        sizes={isLarge ? "(max-width: 1024px) 100vw, 66vw" : "(max-width: 1024px) 50vw, 33vw"}
                    />
                ) : (
                    <div className="absolute inset-0 bg-zinc-800 flex items-center justify-center">
                        <Image src="/gramika.png" alt="Gramika" width={isLarge ? 100 : 64} height={isLarge ? 100 : 64} className="object-contain opacity-20" />
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/55 to-black/15" />
            </div>

            <div className={`absolute inset-0 flex flex-col justify-end ${isLarge ? "p-5 sm:p-8" : "p-4"}`}>
                <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-30" onClick={(e) => e.stopPropagation()}>
                    <NewsShareMenu
                        shareUrl={`${getSiteOrigin()}${getStorySharePath(post.slug.current)}`}
                        size="sm"
                        variant="on-dark"
                        menuPlacement="below"
                    />
                </div>

                <span className="inline-flex w-fit px-2 py-0.5 sm:px-2.5 sm:py-1 bg-white/20 backdrop-blur-sm text-white text-[9px] sm:text-[10px] font-[family-name:var(--font-display)] font-semibold uppercase tracking-wider rounded-md mb-2 sm:mb-3 border border-white/20">
                    Featured
                </span>

                <h3 className={`font-semibold text-white leading-snug mb-1.5 sm:mb-2 shrink-0 ${
                    isLarge
                        ? "text-lg sm:text-2xl lg:text-3xl line-clamp-2 lg:line-clamp-3"
                        : "text-sm lg:text-base line-clamp-2 lg:line-clamp-3"
                }`}>
                    {post.title}
                </h3>

                {isLarge && excerptText && (
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            setExcerptExpanded((prev) => !prev);
                        }}
                        className={`text-left w-full mb-3 min-h-0 rounded-md transition-colors hover:bg-white/5 cursor-pointer ${
                            excerptExpanded ? "max-h-32 overflow-y-auto pr-1" : ""
                        }`}
                        aria-expanded={excerptExpanded}
                        aria-label={excerptExpanded ? "Collapse description" : "Expand description"}
                    >
                        <p className={`text-zinc-200 text-sm leading-relaxed ${excerptExpanded ? "" : "line-clamp-1"}`}>
                            {excerptText}
                        </p>
                    </button>
                )}

                <div className="flex items-center gap-1.5 text-zinc-200 text-[11px] sm:text-xs font-[family-name:var(--font-display)] font-medium">
                    Read story <FaArrowRight className="text-[9px] sm:text-[10px]" />
                </div>
            </div>
        </>
    );
}
