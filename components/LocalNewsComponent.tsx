"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

type LocalNewsItem = {
    _id: string;
    title: string;
    image: string;
    description?: string;
    publishedAt: string;
};

const LocalNews = () => {
    const [localNews, setLocalNews] = useState<LocalNewsItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/sanity/localNews")
            .then((res) => res.json())
            .then((data) => {
                setLocalNews(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching local news:", err);
                setLoading(false);
            });
    }, []);

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

    if (!loading && localNews.length === 0) {
        return null;
    }

    return (
        <div className="w-full mt-8 sm:mt-12">
            <div className="flex items-center gap-3 mb-6 sm:mb-8">
                <div className="w-1.5 h-6 sm:h-8 bg-blue-600 rounded-full"></div>
                <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">Local News</h2>
            </div>

            {loading ? renderLoader() : (
                <div className="flex flex-col gap-4 sm:gap-6">
                    {localNews.map((news) => (
                        <div key={news._id} className="group cursor-pointer bg-white rounded-2xl sm:rounded-3xl p-3 sm:p-4 hover:shadow-xl transition-all duration-300 border border-transparent hover:border-gray-100 flex flex-col sm:flex-row gap-4 sm:gap-6 items-start sm:items-center">
                            <div className="relative h-40 sm:h-40 w-full sm:w-64 flex-shrink-0 rounded-xl sm:rounded-2xl overflow-hidden">
                                <Image
                                    src={news.image}
                                    alt={news.title}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                            </div>
                            <div className="flex-1 px-2 sm:px-0">
                                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 leading-tight group-hover:text-blue-600 transition-colors mb-2 sm:mb-3">
                                    {news.title}
                                </h3>
                                <p className="text-sm sm:text-base text-gray-500 line-clamp-3 sm:line-clamp-4 mb-2 sm:mb-4">
                                    {news.description || "സംഭവത്തിന്റെ വിശദമായ കവറേജ്, പ്രധാന വ്യക്തികളുമായുള്ള അഭിമുഖങ്ങൾ, ചടങ്ങിൽ പങ്കെടുത്ത പ്രാദേശിക നിവാസികൾ എന്നിവ ഉൾപ്പെടുന്നു."}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default LocalNews;
