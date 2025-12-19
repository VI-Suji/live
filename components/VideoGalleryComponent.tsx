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
    const scrollRef = React.useRef<HTMLDivElement>(null);

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

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const { scrollLeft, clientWidth } = scrollRef.current;
            const scrollAmount = clientWidth * 0.8;
            const target = direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount;
            scrollRef.current.scrollTo({
                left: target,
                behavior: 'smooth'
            });
        }
    };

    if (!loading && videos.length === 0) return null;

    return (
        <div className="w-full mt-8">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-1.5 h-6 bg-red-600 rounded-full"></div>
                    <h2 className="text-xl font-black text-gray-900 tracking-tight">Watch Shorts</h2>
                </div>

                {!loading && videos.length > 0 && (
                    <div className="flex gap-2">
                        <button
                            onClick={() => scroll('left')}
                            className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors shadow-sm"
                            aria-label="Previous"
                        >
                            <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <button
                            onClick={() => scroll('right')}
                            className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors shadow-sm"
                            aria-label="Next"
                        >
                            <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                )}
            </div>

            {loading ? (
                <div className="flex gap-4 overflow-hidden">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="w-[65%] sm:w-[calc(46%)] flex-shrink-0 aspect-[9/16] bg-gray-200 rounded-2xl animate-pulse"></div>
                    ))}
                </div>
            ) : (
                <div
                    ref={scrollRef}
                    className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory px-0.5"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {videos.map((video) => (
                        <div
                            key={video._id}
                            onClick={() => handleVideoClick(video.videoUrl)}
                            className="group relative w-[65%] sm:w-[calc(46%)] flex-shrink-0 aspect-[9/16] cursor-pointer overflow-hidden rounded-2xl bg-gray-900 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 snap-start"
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

                            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>

                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20">
                                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/50">
                                    <FaPlay className="text-white ml-1" size={16} />
                                </div>
                            </div>

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
            )}
        </div>
    );
};

export default VideoGallery;

