"use client";

import React, { useRef, useEffect, useState } from "react";
import { FaChevronLeft, FaChevronRight, FaArrowRight } from "react-icons/fa";
import { useRouter } from "next/navigation";
import Image from "next/image";

type Post = {
    id: string;
    pageId: string;
    title: string;
    img?: string;
    text?: string;
    date?: string;
    author?: string;
};

export default function TopStories() {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const router = useRouter();

    useEffect(() => {
        fetch("/api/notionPages")
            .then((res) => res.json())
            .then((data: Post[]) => {
                setPosts(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleScroll = () => {
            const scrollLeft = container.scrollLeft;
            const cardWidth = container.clientWidth;
            const index = Math.round(scrollLeft / cardWidth);
            setCurrentIndex(index);
        };

        container.addEventListener('scroll', handleScroll);
        return () => container.removeEventListener('scroll', handleScroll);
    }, [posts]);

    function scrollNext() {
        const el = containerRef.current;
        if (!el) return;
        const scrollAmount = el.clientWidth * 0.8;
        el.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }

    function scrollPrev() {
        const el = containerRef.current;
        if (!el) return;
        const scrollAmount = el.clientWidth * 0.8;
        el.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    }

    function handleReadMore(post: Post) {
        router.push(`/story/${post.pageId}`);
    }

    const renderLoader = () => {
        return Array.from({ length: 3 }).map((_, idx) => (
            <div
                key={idx}
                className="snap-start flex-shrink-0 w-full lg:w-[calc(33.333%-1rem)] h-[500px] rounded-3xl bg-gray-800 relative overflow-hidden border border-white/10"
            >
                <div className="absolute inset-0 bg-gray-800 animate-pulse"></div>
                <div className="absolute bottom-0 left-0 right-0 p-8 space-y-4 z-10">
                    <div className="w-24 h-6 bg-gray-700 rounded-full animate-pulse"></div>
                    <div className="space-y-2">
                        <div className="w-full h-8 bg-gray-700 rounded animate-pulse"></div>
                        <div className="w-3/4 h-8 bg-gray-700 rounded animate-pulse"></div>
                    </div>
                    <div className="w-32 h-6 bg-gray-700 rounded animate-pulse mt-4"></div>
                </div>
            </div>
        ));
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
            {/* Controls */}
            <div className="absolute top-1/2 -translate-y-1/2 -left-4 z-20 hidden lg:flex">
                <button
                    onClick={scrollPrev}
                    className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all duration-300 shadow-lg"
                >
                    <FaChevronLeft />
                </button>
            </div>
            <div className="absolute top-1/2 -translate-y-1/2 -right-4 z-20 hidden lg:flex">
                <button
                    onClick={scrollNext}
                    className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all duration-300 shadow-lg"
                >
                    <FaChevronRight />
                </button>
            </div>

            {/* Carousel */}
            <div
                ref={containerRef}
                className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-4 no-scrollbar"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {loading ? renderLoader() : posts.map((post) => (
                    <article
                        key={post.id}
                        onClick={() => handleReadMore(post)}
                        className="snap-start flex-shrink-0 w-full lg:w-[calc(33.333%-1rem)] h-[500px] relative rounded-3xl overflow-hidden cursor-pointer group transition-transform duration-300 hover:-translate-y-2"
                    >
                        {/* Image Background */}
                        <div className="absolute inset-0">
                            <Image
                                src={post.img || "/fallback.jpg"}
                                alt={post.title}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-90" />
                        </div>

                        {/* Content */}
                        <div className="absolute inset-0 p-8 flex flex-col justify-end">
                            <div className="transform transition-transform duration-300 translate-y-4 group-hover:translate-y-0">
                                <span className="inline-block px-3 py-1 bg-red-600 text-white text-xs font-bold uppercase tracking-wider rounded-full mb-4">
                                    Featured
                                </span>
                                <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3 leading-tight line-clamp-3">
                                    {post.title}
                                </h3>
                                <p className="text-gray-300 line-clamp-2 mb-6 text-sm sm:text-base opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300 delay-100">
                                    {post.text || "മുഴുവൻ വാർത്ത വായിക്കാൻ ക്ലിക്ക് ചെയ്യുക..."}
                                </p>
                                <div className="flex items-center gap-2 text-white font-semibold text-sm uppercase tracking-wide group-hover:text-red-400 transition-colors">
                                    വാർത്ത വായിക്കുക <FaArrowRight />
                                </div>
                            </div>
                        </div>
                    </article>
                ))}
            </div>

            {/* Carousel Indicators - Mobile Only */}
            {!loading && posts.length > 1 && (
                <div className="flex justify-center gap-2 mt-6 lg:hidden">
                    {posts.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => {
                                const container = containerRef.current;
                                if (container) {
                                    container.scrollTo({
                                        left: idx * container.clientWidth,
                                        behavior: 'smooth'
                                    });
                                }
                            }}
                            className={`h-2 rounded-full transition-all duration-300 ${idx === currentIndex
                                ? 'w-8 bg-white'
                                : 'w-2 bg-white/40 hover:bg-white/60'
                                }`}
                            aria-label={`Go to slide ${idx + 1}`}
                        />
                    ))}
                </div>
            )}

            {/* Swipe Hint - Mobile Only */}
            {!loading && posts.length > 1 && currentIndex === 0 && (
                <div className="flex justify-center items-center gap-2 mt-4 lg:hidden text-white/60 text-sm animate-pulse">
                    <span>Swipe to explore</span>
                    <FaChevronRight className="text-xs" />
                </div>
            )}
        </div>
    );
}
