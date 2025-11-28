"use client";

import React, { useRef, useState, useEffect } from "react";
import Hero from "./HeroComponent";
import Sidebar from "./SideBarComponent";
import Socials from "./SocialsComponent";
import LiveNow from "./LiveComponent";
import TopStories from "./TopStoriesComponent";
import Footer from "./FooterComponent";
import LocalNews from "./LocalNewsComponent";

const MainSection: React.FC = () => {
    const topStoriesRef = useRef<HTMLElement>(null);
    const [siteSettings, setSiteSettings] = useState({
        liveStreamVisible: true,
        heroSectionVisible: true,
        advertisementsVisible: true,
        latestNewsVisible: true,
        topStoriesVisible: true,
    });

    useEffect(() => {
        const fetchSettings = () => {
            fetch(`/api/sanity/siteSettings?t=${Date.now()}`)
                .then(res => res.json())
                .then(data => {
                    setSiteSettings({
                        liveStreamVisible: data.liveStreamVisible ?? true,
                        heroSectionVisible: data.heroSectionVisible ?? true,
                        advertisementsVisible: data.advertisementsVisible ?? true,
                        latestNewsVisible: data.latestNewsVisible ?? true,
                        topStoriesVisible: data.topStoriesVisible ?? true,
                    });
                })
                .catch(console.error);
        };

        fetchSettings();
        const interval = setInterval(fetchSettings, 10000);
        return () => clearInterval(interval);
    }, []);

    const handleScrollToTopStories = () => {
        topStoriesRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <main className="w-full min-h-screen pt-36 sm:pt-40 lg:pt-32">{/* Adjusted mobile padding */}
            {/* Hero Section - Light with subtle gradient */}
            <section
                className="relative bg-gradient-to-br from-gray-50 via-white to-blue-50 overflow-hidden"
            >
                <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-8 sm:py-12 lg:py-16 flex flex-col lg:flex-row items-start justify-center gap-6 sm:gap-8">
                    <div className="flex flex-col gap-8 sm:gap-10 w-full lg:w-[65%]">
                        <div id="home" className="flex flex-col gap-8 sm:gap-10">
                            {siteSettings.heroSectionVisible && (
                                <Hero onReadMore={handleScrollToTopStories} />
                            )}

                            {/* Live Section with Card Style */}
                            {siteSettings.liveStreamVisible && (
                                <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-4 sm:p-6 lg:p-8 border border-gray-100">
                                    <div className="flex items-center gap-3 mb-4 sm:mb-6">
                                        <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse"></div>
                                        <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-gray-900">
                                            Live Now
                                        </h2>
                                    </div>
                                    <LiveNow channelId="UCgkLuDaFGUrfljjp7cNtQcw" />
                                </div>
                            )}
                        </div>

                        {/* Local News Section */}
                        <section
                            ref={topStoriesRef}
                            id="local-news"
                        >
                            <LocalNews />
                        </section>
                    </div>

                    <Sidebar siteSettings={siteSettings} />
                </div>
            </section>

            {/* Top Stories Section - Dark dramatic */}
            {siteSettings.topStoriesVisible && (
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
            )}

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
