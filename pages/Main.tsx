"use client";

import React, { useRef } from "react";
import { FiArrowRight } from "react-icons/fi";
import LiveNow from "./Live";
import CarouselSection from "./CarouselSection";
import BentoGridSection from "./Bentogrid";
import { FaCopyright } from "react-icons/fa";
import VideoPlayer from "./Video";

const MainArea: React.FC = () => {
    const topStoriesRef = useRef<HTMLElement>(null);

    const handleScrollToTopStories = () => {
        topStoriesRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <>
            <section
                id="home"
                className="w-full bg-[#f8f8f8] flex flex-col lg:flex-row items-start justify-between px-4 sm:px-8 py-4 gap-8 scroll-mt-30"
            >
                {/* Left Column */}
                <div className="flex flex-col p-1 sm:p-5 gap-10 w-full lg:w-3/4">
                    {/* Heading + Subtext + Button */}
                    <div className="flex flex-col gap-6 w-full">
                        <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight w-full">
                            നമസ്കാരം,
                        </h2>
                        <p className="text-gray-700 text-lg sm:text-xl w-full">
                            ഗ്രാമിക ചാനലിലേക് നിങ്ങൾക് ഹൃദയം നിറഞ്ഞ സ്വാഗതം! ഗ്രാമിക — ഗ്രാമീണതയുടെ ഹൃദയതാളം, നമ്മുടെ നാട്ടിൻപുറങ്ങളുടെ നന്മയും നിഷ്‌കളങ്കതയും അടയാളപ്പെടുത്തുന്ന നിങ്ങളുടെ വിശ്വസനീയ വാർത്താ സ്രോതസ്സ്.
                        </p>
                        <button
                            onClick={handleScrollToTopStories}
                            className="flex items-center gap-2 px-5 py-3 bg-gradient-to-br from-blue-400 to-purple-500 hover:from-blue-500 hover:to-purple-600 shadow-md hover:shadow-lg rounded-full hover:rounded-xl active:rounded-md transition-all duration-300 ease-in-out active:scale-95 text-white font-semibold w-max"
                        >
                            Read More
                            <FiArrowRight className="text-lg transition-transform duration-100 ease-linear group-hover:translate-x-1" />
                        </button>
                    </div>

                    {/* Live Now */}
                    <div className="flex flex-col gap-6 w-full">
                        <h2 className="text-3xl sm:text-5xl font-extrabold text-gray-900 leading-tight w-full">
                            Live Now
                        </h2>
                        <LiveNow channelId="UCgkLuDaFGUrfljjp7cNtQcw" />
                    </div>
                </div>

                {/* Right Column - Latest News + Video */}
                <div className="flex flex-col items-center justify-center w-full lg:w-1/4 h-full gap-6 px-0 sm:px-4 lg:px-8">
                    {/* Image / Video Block */}
                    <div className="w-full relative rounded-xl shadow-lg overflow-hidden bg-black flex items-center justify-center text-gray-400 font-bold text-lg aspect-video">
                        Image/Thumbnail
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-800 text-white">
                            This is an ad section can be rented
                        </div>
                    </div>
                    {/* News Card */}
                    <div className="flex flex-col justify-start w-full bg-white/10 backdrop-blur-2xl border border-white/20 rounded-2xl shadow-lg p-4 gap-4">
                        {/* Header */}
                        <div className="w-full flex justify-center">
                            <h3 className="bg-gradient-to-tr from-blue-200 to-purple-200 backdrop-blur-md rounded-xl py-4 px-4 text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 w-full text-center">
                                Latest News
                            </h3>
                        </div>

                        {/* Right-aligned Date */}
                        <div className="w-full flex justify-end items-center gap-2">
                            <div className="relative w-10 h-8 bg-white/40 backdrop-blur-md rounded-full flex items-center justify-center text-gray-900 font-bold shadow transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
                                25
                                <div className="absolute top-0 left-0 w-full h-full rounded-full pointer-events-none bg-gradient-to-tr from-white/50 via-white/20 to-white/0 opacity-0 hover:opacity-30 animate-pulse"></div>
                            </div>
                            <div className="relative w-28 sm:w-32 h-8 bg-white/40 backdrop-blur-md rounded-full flex items-center justify-center text-gray-900 font-bold text-sm shadow p-2 transform transition-all duration-300 hover:scale-105 hover:shadow-lg overflow-hidden">
                                Oct 2025
                                <div className="absolute top-0 left-0 w-full h-full rounded-full pointer-events-none bg-gradient-to-r from-white/40 via-white/10 to-white/0 opacity-0 hover:opacity-30 animate-pulse"></div>
                            </div>
                        </div>

                        {/* Content Section */}
                        <div className="w-full flex flex-col gap-2">
                            <h4 className="text-gray-900 font-bold text-lg sm:text-xl leading-snug line-clamp-3 p-2">
                                Breaking: Major Tech Innovations Unveiled at Annual Conference
                            </h4>
                            <hr className="border-black/20 my-1" />
                            <p className="text-gray-700 text-md sm:text-lg leading-relaxed p-2">
                                ഇവിടെ നമ്മൾ പങ്കുവെയ്ക്കുന്നത് നമ്മുടെ ഗ്രാമങ്ങളിലെ സംഭവങ്ങൾ, സംസ്കാരങ്ങൾ, കർഷകരുടെ ജീവിതരേഖകൾ, നാട്ടുവാർത്തകൾ, സാമൂഹിക വിഷയങ്ങൾ, പ്രാദേശിക വികസനങ്ങൾ എന്നിവയാണ്. ഗ്രാമിക ചാനൽ നിങ്ങളുടെ ശബ്ദമാണ് — നാട്ടിൻപുറങ്ങളുടെ സ്വരമായി, വിശ്വാസത്തോടെയും സത്യസന്ധതയോടെയും മുന്നോട്ട് പോകുന്ന മാധ്യമം 🌾📢
                            </p>
                        </div>
                    </div>

                    {/* Image / Video Block */}
                    <div className="w-full relative rounded-xl shadow-lg overflow-hidden bg-black flex items-center justify-center text-gray-400 font-bold text-lg aspect-video">
                        Image/Thumbnail
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-800 text-white">
                            This is an ad section can be rented
                        </div>
                    </div>
                </div>
            </section>

            <section
                ref={topStoriesRef}
                id="top-stories"
                className="bg-[#121212] text-white w-full scroll-mt-30 transition-all duration-500"
            >
                {/* Title */}
                <h2 className="m-10 pt-5 text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
                    Top Stories
                </h2>
                <CarouselSection />
            </section>

            <section id="socials" className="bg-[#f8f8f8] text-white w-full scroll-mt-24">
                <BentoGridSection />
            </section>

            <section className="py-5 bg-black">
                <footer className="w-full flex justify-center my-8 px-10">
                    <div className="w-full max-w-4xl flex flex-col sm:flex-row items-center justify-center gap-2 py-4 px-6 
                        bg-white backdrop-blur-md rounded-2xl text-black text-sm sm:text-base shadow-lg"
                    >
                        {/* Left: Copyright Icon + Text */}
                        <div className="flex items-center gap-2">
                            <FaCopyright className="text-5xl sm:text-3xl" />
                            <span className="font-bold">Copyright Gramika Limited 2025. All rights reserved.</span>
                        </div>
                    </div>
                </footer>
            </section>
        </>
    );
};

export default MainArea;
