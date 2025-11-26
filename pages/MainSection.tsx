"use client";

import React, { useRef } from "react";
import Hero from "./components/HeroComponent";
import Sidebar from "./components/SideBarComponent";
import Socials from "./components/SocialsComponent";
import LiveNow from "./components/LiveComponent";
import TopStories from "./components/TopStoriesComponent";
import Footer from "./components/FooterComponent";
import ScrollingNews from "./components/ScrollingNewsComponent";
import LocalNews from "./components/LocalNewsComponent";

const MainSection: React.FC = () => {
    const topStoriesRef = useRef<HTMLElement>(null);

    const handleScrollToTopStories = () => {
        topStoriesRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <main className="w-full min-h-screen pt-20">
            <ScrollingNews />

            {/* Hero Section - Light with subtle gradient */}
            <section
                id="home"
                className="relative bg-gradient-to-br from-gray-50 via-white to-blue-50 overflow-hidden"
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 flex flex-col lg:flex-row items-start justify-center gap-8">
                    <div className="flex flex-col gap-10 w-full lg:w-[65%]">
                        <Hero onReadMore={handleScrollToTopStories} />

                        {/* Live Section with Card Style */}
                        <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-8 border border-gray-100">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse"></div>
                                <h2 className="text-2xl sm:text-3xl font-black text-gray-900">
                                    Live Now
                                </h2>
                            </div>
                            <LiveNow channelId="UCgkLuDaFGUrfljjp7cNtQcw" />
                        </div>

                        {/* Local News Section */}
                        <section
                            ref={topStoriesRef}
                            id="local-news"
                        >
                            <LocalNews />
                        </section>
                    </div>

                    <Sidebar />
                </div>
            </section>

            {/* Top Stories Section - Dark dramatic */}
            <section
                ref={topStoriesRef}
                id="top-stories"
                className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white py-20 sm:py-28 overflow-hidden"
            >
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"></div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-6 bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
                            Top Stories
                        </h2>
                    </div>
                    <TopStories />
                </div>
            </section>

            {/* Socials Section - Colorful gradient */}
            <section id="socials" className="relative bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-8 sm:py-12">
                <Socials />
            </section>
            <section className="bg-white">
                <Footer />
            </section>
        </main >
    );
};

export default MainSection;
