"use client";

import React from "react";
import Marquee from "react-fast-marquee";

const NEWS_UPDATES = [
    "Breaking: Gramika launches new digital platform for rural news coverage.",
    "Weather Alert: Heavy rains expected in central Kerala districts tomorrow.",
    "Sports: Local football tournament finals to be held this Sunday at the municipal stadium.",
    "Education: State government announces new scholarship schemes for high school students.",
    "Culture: Annual temple festival preparations begin with flag hoisting ceremony."
];

const ScrollingNews = () => {
    return (
        <div className="w-full bg-red-600 text-white py-2 overflow-hidden relative z-40">
            <div className="max-w-7xl mx-auto flex items-center">
                <div className="bg-red-700 px-4 py-1 font-bold text-xs sm:text-sm uppercase tracking-wider z-10 shadow-md">
                    Breaking News
                </div>
                <Marquee gradient={false} speed={40} className="flex-1">
                    {NEWS_UPDATES.map((news, index) => (
                        <span key={index} className="mx-8 text-sm sm:text-base font-medium">
                            {news} •
                        </span>
                    ))}
                </Marquee>
            </div>
        </div>
    );
};

export default ScrollingNews;
