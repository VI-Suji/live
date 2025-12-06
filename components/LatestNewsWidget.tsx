"use client";

import React, { useState, useEffect } from "react";

type LatestNews = {
    _id: string;
    heading: string;
    content: string;
    date: string;
    active: boolean;
};

const LatestNewsWidget: React.FC = () => {
    const [news, setNews] = useState<LatestNews | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const res = await fetch('/api/sanity/latestNews');
                if (res.ok) {
                    const data = await res.json();
                    if (data && data.active) {
                        setNews(data);
                    }
                }
            } catch (error) {
                console.error("Error fetching latest news:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchNews();
    }, []);

    // Don't render if no news or inactive
    if (loading || !news || !news.active) {
        return null;
    }

    // Parse date
    const newsDate = new Date(news.date);
    const day = newsDate.getDate();
    const month = newsDate.toLocaleDateString('en-US', { month: 'short' });
    const year = newsDate.getFullYear();

    return (
        <div className="flex flex-col justify-start w-full bg-white/10 backdrop-blur-2xl border border-white/20 rounded-2xl shadow-lg p-4 gap-4">
            {/* Header */}
            <div className="w-full flex justify-center order-2 md:order-none">
                <h3 className="bg-gradient-to-tr from-blue-200 to-purple-200 backdrop-blur-md rounded-xl py-4 px-4 text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 w-full text-center">
                    {news.heading}
                </h3>
            </div>

            {/* Right-aligned Date */}
            <div className="w-full flex justify-end items-center gap-2 order-1 md:order-none">
                <div className="relative w-10 h-8 bg-white/40 backdrop-blur-md rounded-full flex items-center justify-center text-gray-900 font-bold shadow transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
                    {day}
                    <div className="absolute top-0 left-0 w-full h-full rounded-full pointer-events-none bg-gradient-to-tr from-white/50 via-white/20 to-white/0 opacity-0 hover:opacity-30 animate-pulse"></div>
                </div>
                <div className="relative w-28 sm:w-32 h-8 bg-white/40 backdrop-blur-md rounded-full flex items-center justify-center text-gray-900 font-bold text-sm shadow p-2 transform transition-all duration-300 hover:scale-105 hover:shadow-lg overflow-hidden">
                    {month} {year}
                    <div className="absolute top-0 left-0 w-full h-full rounded-full pointer-events-none bg-gradient-to-r from-white/40 via-white/10 to-white/0 opacity-0 hover:opacity-30 animate-pulse"></div>
                </div>
            </div>

            {/* Content Section */}
            <div className="w-full flex flex-col gap-2 order-3 md:order-none">
                <hr className="border-black/20 my-1" />
                <p className="text-gray-700 text-md sm:text-lg leading-relaxed p-2">
                    {news.content}
                </p>
            </div>
        </div>
    );
};

export default LatestNewsWidget;
