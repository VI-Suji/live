"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import BlogPost from "../components/TopStoryPostComponent";
import { FaArrowLeft } from "react-icons/fa";
import Footer from "../components/FooterComponent";

type Post = {
  id: number | string;
  pageId: string;
  title: string;
  img?: string;
  text?: string;
  date?: string;
  author?: string;
};

export default function StoryPage() {
  const router = useRouter();
  const { pageId } = router.query;

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!pageId || typeof pageId !== "string") return;

    const fetchPost = async () => {
      try {
        const res = await fetch("/api/notionPages");
        const data: Post[] = await res.json();

        const currentPost = data.find((p) => p.pageId === pageId);
        if (currentPost) setPost(currentPost);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    fetchPost();
  }, [pageId]);

  return (
    <>
      {/* Header always renders */}
      <header className="w-full bg-black backdrop-blur-xl border-b border-black/10 shadow-sm sticky top-0 z-50">
        <div className="flex items-center justify-between px-4 md:px-6 py-3 sm:py-8 relative">
          {/* Back Button */}
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-2 bg-gradient-to-br from-blue-400 to-purple-500 hover:from-blue-500 hover:to-purple-600 shadow-md hover:shadow-lg rounded-full hover:rounded-xl active:rounded-md transition-all duration-300 ease-in-out active:scale-95 text-white font-semibold p-2 sm:px-5 sm:py-3"
          >
            <FaArrowLeft className="text-lg sm:text-base" />
            <span className="hidden sm:inline">Back to Home</span>
          </button>

          {/* Title */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-white text-center absolute left-1/2 -translate-x-1/2">
            ഗ്രാമിക
          </h1>
        </div>
      </header>

      {/* Main content */}
      {loading ? (
        <div className="bg-[#f8f8f8] w-full flex justify-center items-center min-h-[80vh]">
          <div className="animate-pulse w-11/12 md:w-2/3 lg:w-1/2 bg-white/10 backdrop-blur-md rounded-xl shadow-lg p-6 space-y-4">
            <div className="h-64 bg-gray-300/30 rounded-lg"></div>
            <div className="h-6 w-3/4 bg-gray-300/30 rounded"></div>
            <div className="h-4 w-full bg-gray-300/20 rounded"></div>
            <div className="h-4 w-full bg-gray-300/20 rounded"></div>
            <div className="h-4 w-5/6 bg-gray-300/20 rounded"></div>
            <div className="mt-4 flex gap-4 items-center">
              <div className="h-6 w-32 bg-gray-300/20 rounded"></div>
              <div className="h-6 w-20 bg-gray-300/20 rounded"></div>
            </div>
          </div>
        </div>
      ) : post ? (
        <BlogPost pageId={post.pageId} author={post.author} date={post.date} />
      ) : (
        <div className="text-center mt-20 text-gray-700">Post not found.</div>
      )}

      {/* Footer always renders */}
      <Footer />
    </>
  );
}
