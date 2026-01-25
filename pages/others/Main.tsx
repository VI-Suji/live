"use client";

import React, { useRef, useState, useEffect } from "react";
import { FiArrowRight } from "react-icons/fi";
import { motion } from "framer-motion";
import LiveNow from "../../components/LiveComponent";
import CarouselSection from "../../components/TopStoriesComponent";
import BentoGridSection from "../../components/SocialsComponent";
import HeroComponent from "../../components/HeroComponent";
import LatestNewsWidget from "../../components/LatestNewsWidget";
import AdFirstComponent from "../../components/AdFirstComponent";
import AdSecondComponent from "../../components/AdSecondComponent";
import { FaCopyright } from "react-icons/fa";

const MainArea: React.FC = () => {
    const topStoriesRef = useRef<HTMLElement>(null);
    const [siteSettings, setSiteSettings] = useState({
        liveStreamVisible: true,
        heroSectionVisible: true,
        advertisementsVisible: true,
        latestNewsVisible: true,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch site settings with cache busting
        const fetchSettings = () => {
            fetch(`/api/sanity/siteSettings?t=${Date.now()}`)
                .then(res => res.json())
                .then(data => {
                    setSiteSettings({
                        liveStreamVisible: data.liveStreamVisible ?? true,
                        heroSectionVisible: data.heroSectionVisible ?? true,
                        advertisementsVisible: data.advertisementsVisible ?? true,
                        latestNewsVisible: data.latestNewsVisible ?? true,
                    });
                })
                .catch(console.error)
                .finally(() => setLoading(false));
        };

        // Initial fetch
        fetchSettings();

        // Refresh settings every 10 seconds to pick up changes
        const interval = setInterval(fetchSettings, 10000);

        return () => clearInterval(interval);
    }, []);

    const handleScrollToTopStories = () => {
        topStoriesRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <>
            <section
                id="home"
                className="w-full bg-[#f8f8f8] flex flex-col lg:flex-row items-start justify-between px-4 sm:px-8 py-4 gap-8 scroll-mt-30"
            >
                {/* Left Column */}
                <div className="flex flex-col p-1 sm:p-5 gap-10 w-full lg:w-3/4">
                    {/* Hero Section */}
                    {siteSettings.heroSectionVisible && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <HeroComponent
                                onReadMore={handleScrollToTopStories}
                                showLive={siteSettings.liveStreamVisible}
                            />
                        </motion.div>
                    )}

                    {/* Live Now */}
                    {siteSettings.liveStreamVisible && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="flex flex-col gap-6 w-full"
                        >
                            <h2 className="text-3xl sm:text-5xl font-extrabold text-gray-900 leading-tight w-full">
                                Live Now
                            </h2>
                            <LiveNow channelId="UCgkLuDaFGUrfljjp7cNtQcw" />
                        </motion.div>
                    )}
                </div>

                {/* Right Column - Latest News + Ads */}
                <div className="flex flex-col items-center justify-center w-full lg:w-1/4 h-full gap-6 px-0 sm:px-4 lg:px-8">
                    {/* First Ad */}
                    {siteSettings.advertisementsVisible && (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            className="w-full"
                        >
                            <AdFirstComponent />
                        </motion.div>
                    )}

                    {/* Latest News Widget */}
                    {siteSettings.latestNewsVisible && (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            className="w-full"
                        >
                            <LatestNewsWidget />
                        </motion.div>
                    )}

                    {/* Second Ad */}
                    {siteSettings.advertisementsVisible && (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.5 }}
                            className="w-full"
                        >
                            <AdSecondComponent />
                        </motion.div>
                    )}
                </div>
            </section>

            <motion.section
                ref={topStoriesRef}
                id="top-stories"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="bg-[#121212] text-white w-full scroll-mt-30 transition-all duration-500"
            >
                {/* Title */}
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="m-10 pt-5 text-3xl sm:text-5xl font-extrabold text-white tracking-tight"
                >
                    Top Stories
                </motion.h2>
                <CarouselSection />
            </motion.section>

            <motion.section
                id="socials"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="bg-[#f8f8f8] text-white w-full scroll-mt-24"
            >
                <BentoGridSection />
            </motion.section>

            <section className="py-5 bg-black">
                <footer className="w-full flex flex-col items-center my-8 px-4 sm:px-10 gap-6">
                    {/* Social Links */}
                    <div className="flex items-center gap-6">
                        <a href="https://www.youtube.com/@GramikaTv" target="_blank" rel="noopener noreferrer" className="text-white hover:text-red-600 transition-colors">
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>
                        </a>
                        <a href="https://www.facebook.com/GRAMIKATV/" target="_blank" rel="noopener noreferrer" className="text-white hover:text-blue-600 transition-colors">
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                        </a>
                        <a href="https://www.instagram.com/gramikatv/reels/" target="_blank" rel="noopener noreferrer" className="text-white hover:text-pink-600 transition-colors">
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
                        </a>
                        <a href="#" className="text-white hover:text-green-500 transition-colors">
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" /></svg>
                        </a>
                    </div>

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
