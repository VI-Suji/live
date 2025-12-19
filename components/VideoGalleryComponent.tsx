"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { FaPlay } from "react-icons/fa";

type VideoItem = {
    _id: string;
    title: string;
    videoUrl: string;
    thumbnail: string;
};

const VideoGallery = () => {
    const [videos, setVideos] = useState<VideoItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 2;

    useEffect(() => {
        fetch(`/api/sanity/videoGallery?t=${Date.now()}`)
            .then((res) => res.json())
            .then((data) => {
                setVideos(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching videos:", err);
                setLoading(false);
            });
    }, []);

    const handleVideoClick = (url: string) => {
        if (url) {
            window.open(url, '_blank', 'noopener,noreferrer');
        }
    };

    if (!loading && videos.length === 0) {
        return null;
    }

    const totalPages = Math.ceil(videos.length / itemsPerPage);
    const currentVideos = videos.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div className="w-full mt-8">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-1.5 h-6 bg-red-600 rounded-full"></div>
                <h2 className="text-xl font-black text-gray-900 tracking-tight">Watch Shorts</h2>
            </div>

            {loading ? (
                <div className="grid grid-cols-2 gap-4">
                    {[1, 2].map((i) => (
                        <div key={i} className="aspect-[9/16] bg-gray-200 rounded-2xl animate-pulse"></div>
                    ))}
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-2 gap-3 sm:gap-4">
                        {currentVideos.map((video) => (
                            <div
                                key={video._id}
                                onClick={() => handleVideoClick(video.videoUrl)}
                                className="group relative aspect-[9/16] cursor-pointer overflow-hidden rounded-2xl bg-gray-900 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                            >
                                {video.thumbnail ? (
                                    <Image
                                        src={video.thumbnail}
                                        alt={video.title}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                                        <span className="text-gray-400 text-xs text-center px-2">{video.title}</span>
                                    </div>
                                )}

                                {/* Gradient Overlay for better text readability */}
                                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>

                                {/* Play Icon - Centered but subtle */}
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20">
                                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/50">
                                        <FaPlay className="text-white ml-1" size={16} />
                                    </div>
                                </div>

                                {/* Shorts/Reels Style Metadata */}
                                <div className="absolute bottom-0 left-0 right-0 p-3 flex flex-col gap-1">
                                    <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center shadow-lg mb-1 self-start">
                                        <FaPlay className="text-white ml-0.5" size={10} />
                                    </div>
                                    <p className="text-white text-sm font-bold line-clamp-2 leading-tight drop-shadow-md">
                                        {video.title}
                                    </p>
                                    <p className="text-gray-300 text-[10px] font-medium">Watch now</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex justify-center items-center gap-3 mt-8">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
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
                                        onClick={() => setCurrentPage(idx + 1)}
                                        className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold transition-all ${currentPage === idx + 1
                                            ? "bg-red-600 text-white shadow-md transform scale-105"
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
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
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

export default VideoGallery;
