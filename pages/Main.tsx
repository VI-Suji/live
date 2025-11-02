"use client";

import React from "react";
import { FiArrowRight } from "react-icons/fi";
import LiveNow from "./Live";
import CarouselSection from "./CarouselSection";
import BentoGridSection from "./Bentogrid";
import { FaCopyright } from "react-icons/fa";

const MainArea: React.FC = () => {
    return (
        <>
            <section className="w-full bg-[#f8f8f8] flex flex-col lg:flex-row items-start justify-between px-8 py-8 sm:py-16 gap-8">
                {/* Left Column - 3/4 width */}
                <div className="flex flex-col p-1 sm:p-5 gap-8">
                    {/* Row 1: Heading + Subtext + Button */}
                    <div className="flex flex-col gap-4 w-full">
                        <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight w-full">
                            Welcome to The News Daily
                        </h2>
                        <p className="text-gray-700 text-lg sm:text-xl w-full">
                            Stay updated with the latest headlines, trending technology, and business news.
                            Our Android-inspired interface gives you a clean and interactive reading experience.
                        </p>
                        <button className="flex items-center gap-2 px-5 py-3 bg-gradient-to-br from-blue-400 to-purple-500 hover:from-blue-500 hover:to-purple-600 shadow-md hover:shadow-lg rounded-full text-white font-semibold transition-all duration-200 active:scale-95 w-max">
                            Read More
                            <FiArrowRight className="text-lg" />
                        </button>
                    </div>
                    <div className="flex flex-col gap-2 w-full">
                        <h2 className="text-3xl sm:text-5xl font-extrabold text-gray-900 leading-tight w-full">
                            Live Now
                        </h2>
                        <LiveNow channelId="UCup3etEdjyF1L3sRbU-rKLw" />
                    </div>
                </div>

                <div className="flex items-center justify-center lg:w-1/3 h-full">
                    <div className="flex flex-col justify-start w-full h-full bg-white/10 backdrop-blur-2xl border border-white/20 rounded-2xl shadow-lg p-4 gap-4 w-1/2">

                        {/* Header */}
                        <div className="w-full flex justify-center">
                            <h3 className="bg-gradient-to-tr from-blue-200 to-purple-200 backdrop-blur-md rounded-xl py-4 px-4 text-3xl font-bold text-gray-900 w-full text-center">
                                Latest News
                            </h3>
                        </div>

                        {/* Right-aligned Date */}
                        <div className="w-full flex justify-end items-center gap-2">
                            {/* Day circle */}
                            <div className="relative w-10 h-8 bg-white/40 backdrop-blur-md rounded-full flex items-center justify-center text-gray-900 font-bold shadow transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
                                25
                                {/* Reflection shimmer */}
                                <div className="absolute top-0 left-0 w-full h-full rounded-full pointer-events-none bg-gradient-to-tr from-white/50 via-white/20 to-white/0 opacity-0 hover:opacity-30 animate-pulse"></div>
                            </div>

                            {/* Month-Year rectangle */}
                            <div className="relative w-32 h-8 bg-white/40 backdrop-blur-md rounded-full flex items-center justify-center text-gray-900 font-bold text-sm shadow p-2 transform transition-all duration-300 hover:scale-105 hover:shadow-lg overflow-hidden">
                                Oct 2025
                                {/* Reflection shimmer */}
                                <div className="absolute top-0 left-0 w-full h-full rounded-full pointer-events-none bg-gradient-to-r from-white/40 via-white/10 to-white/0 opacity-0 hover:opacity-30 animate-pulse"></div>
                            </div>
                        </div>

                        {/* Image / Thumbnail */}
                        <div className="w-full flex-1 relative rounded-xl shadow-lg overflow-hidden bg-black flex items-center justify-center text-gray-400 font-bold text-lg aspect-video">
                            Image/Thumbnail
                            {/* Optional play icon */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <svg
                                    className="w-12 h-12 text-white opacity-70"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M8 5v14l11-7z" />
                                </svg>
                            </div>
                        </div>


                        {/* Content Section */}
                        <div className="w-full flex flex-col gap-2">
                            {/* Major Heading */}
                            <h4 className="text-gray-900 font-bold text-lg leading-snug line-clamp-3 p-2">
                                Breaking: Major Tech Innovations Unveiled at Annual Conference
                            </h4>

                            {/* Horizontal line */}
                            <hr className="border-black/20 my-1" />

                            {/* Description */}
                            <p className="text-gray-700 text-md leading-relaxed p-2">
                                Discover the latest trends and breakthroughs in technology that are shaping the industry today. From AI advancements to groundbreaking software releases, stay informed with detailed insights and updates that matter.
                                Discover the latest trends and breakthroughs in technology that are shaping the industry today. From AI advancements to groundbreaking software releases, stay informed with detailed insights and updates that matter.
                            </p>
                        </div>

                    </div>
                </div>
            </section >
            <section className="bg-[#121212] text-white w-full">
                {/* Title */}
                <h2 className="m-10 text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
                    Top Stories
                </h2>
                <CarouselSection />
            </section>
            <section className="bg-[#f8f8f8] text-white w-full">
                <BentoGridSection />
            </section>
            <section>
                <footer className="w-full flex justify-center my-8 px-10">
                    <div className="w-full max-w-4xl flex flex-col sm:flex-row items-center justify-center gap-2 py-4 px-6 
      bg-white backdrop-blur-md rounded-2xl text-black text-sm sm:text-base shadow-lg">
                        {/* Left: Copyright Icon + Text */}
                        <div className="flex items-center gap-2">
                            <FaCopyright className="text-5xl sm:text-3xl" />
                            <span className="font-bold">Copyright News Daily Limited 2025. All rights reserved.</span>
                        </div>
                    </div>
                </footer>

            </section>
        </>
    );
};

export default MainArea;
