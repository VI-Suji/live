"use client";

import React, { useRef, useEffect, useState } from "react";
import { FaNewspaper, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useRouter } from "next/navigation";

type Post = {
    id: string;        // Notion page ID
    pageId: string;    // Required for linking to BlogPost
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

    function scrollNext() {
        const el = containerRef.current;
        if (!el) return;
        const scrollAmount = window.innerWidth >= 1024 ? el.clientWidth / 4 : el.clientWidth;
        el.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }

    function scrollPrev() {
        const el = containerRef.current;
        if (!el) return;
        const scrollAmount = window.innerWidth >= 1024 ? el.clientWidth / 4 : el.clientWidth;
        el.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    }

    function handleReadMore(post: Post) {
        router.push(
            `/story/${post.pageId}`
        );
    }

    const renderLoader = () => {
        const placeholders = Array.from({ length: 3 });
        return placeholders.map((_, idx) => (
            <article
                key={idx}
                className="snap-start flex-shrink-0 w-[90%] sm:w-[85%] md:w-1/2 lg:w-1/3 rounded-xl overflow-hidden shadow-lg animate-pulse"
                style={{
                    background: "rgba(255, 255, 255, 0.1)",
                    backdropFilter: "blur(10px)",
                    WebkitBackdropFilter: "blur(10px)",
                    border: "1px solid rgba(255, 255, 255, 0.2)"
                }}
            >
                <div className="aspect-[16/9] w-full bg-gradient-to-br from-white/10 via-white/20 to-white/10"></div>
                <div className="p-5 flex flex-col justify-between min-h-[260px]">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="h-6 w-6 rounded-full bg-white/20"></div>
                        <div className="h-6 bg-white/20 rounded w-3/4"></div>
                    </div>
                    <div className="h-20 bg-white/20 rounded mb-4"></div>
                    <div className="h-6 w-24 bg-white/20 rounded"></div>
                </div>
            </article>
        ));
    };

    return (
        <>
            <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

            <div className="w-11/12 md:w-5/6 mx-auto flex flex-col gap-6">
                <div className="relative">
                    <button
                        onClick={scrollPrev}
                        aria-label="Previous"
                        className="hidden md:flex items-center justify-center absolute left-0 top-1/2 -translate-y-1/2 z-40 w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 text-black shadow-md transition-all duration-200"
                    >
                        <FaChevronLeft />
                    </button>

                    <div
                        ref={containerRef}
                        className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth gap-4 no-scrollbar pb-4"
                        style={{ WebkitOverflowScrolling: "touch" }}
                    >
                        {loading ? renderLoader() : posts.map((post) => (
                            <article
                                key={post.id}
                                className="snap-start flex-shrink-0 w-[90%] sm:w-[85%] md:w-1/2 lg:w-1/3 bg-[#f8f8f8] text-gray-900 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300"
                            >
                                {/* Image */}
                                <div className="aspect-[16/9] w-full">
                                    <img
                                        src={post.img || ""}
                                        alt={post.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                {/* Content */}
                                <div className="p-5 flex flex-col justify-between min-h-[260px]">
                                    <div className="flex items-center gap-2 text-red-600 mb-2">
                                        <FaNewspaper className="text-lg" />
                                        <h3 className="text-xl sm:text-2xl font-extrabold uppercase tracking-tight">
                                            {post.title || "Untitled"}
                                        </h3>
                                    </div>

                                    <p className="text-[15px] sm:text-[16px] leading-relaxed text-gray-800">
                                        {post.text || "No summary available."}
                                    </p>

                                    <button
                                        onClick={() => handleReadMore(post)}
                                        className="mt-4 text-sm sm:text-md font-semibold text-red-600 hover:underline flex items-center gap-1"
                                    >
                                        Read More...
                                        <FaChevronRight className="text-xs" />
                                    </button>

                                </div>
                            </article>
                        ))}
                    </div>

                    <button
                        onClick={scrollNext}
                        aria-label="Next"
                        className="hidden md:flex items-center justify-center absolute right-0 top-1/2 -translate-y-1/2 z-40 w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 text-black shadow-md transition-all duration-200"
                    >
                        <FaChevronRight />
                    </button>
                </div>
            </div>
        </>
    );
}
