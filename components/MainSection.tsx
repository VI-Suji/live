"use client";

import React, { useRef, useState, useEffect } from "react";
import Hero from "./HeroComponent";
import Sidebar from "./SideBarComponent";
import Socials from "./SocialsComponent";
import TopStories from "./TopStoriesComponent";
import Footer from "./FooterComponent";
import LocalNews from "./LocalNewsComponent";
import BannerAd from "./BannerAdComponent";
import SectionHeader from "./SectionHeader";

const MainSection: React.FC = () => {
    const topStoriesRef = useRef<HTMLElement>(null);
    const [siteSettings, setSiteSettings] = useState({
        liveStreamVisible: true,
        heroSectionVisible: true,
        advertisementsVisible: true,
        latestNewsVisible: true,
        topStoriesVisible: true,
    });
    const [hasActiveTopStories, setHasActiveTopStories] = useState(true);

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

    useEffect(() => {
        const checkTopStories = () => {
            fetch('/api/sanity/topStories')
                .then(res => res.json())
                .then(data => {
                    setHasActiveTopStories(data && data.length > 0);
                })
                .catch(() => setHasActiveTopStories(false));
        };

        checkTopStories();
        const interval = setInterval(checkTopStories, 10000);
        return () => clearInterval(interval);
    }, []);

    const handleScrollToTopStories = () => {
        topStoriesRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <main className="w-full">
            {/* Hero + Sidebar */}
            <section className="relative">
                <div className="page-container pt-3 sm:pt-5 pb-8 sm:pb-10">
                    <div className="flex flex-col lg:flex-row items-start gap-4 sm:gap-6 lg:gap-10">
                        <div className="flex flex-col gap-6 w-full lg:w-[62%]">
                            <div id="home" className="flex flex-col">
                                {siteSettings.heroSectionVisible && (
                                    <Hero
                                        onReadMore={handleScrollToTopStories}
                                        showLive={siteSettings.liveStreamVisible}
                                    />
                                )}
                            </div>

                            <section
                                id="local-news-desktop"
                                className="hidden lg:block"
                            >
                                <LocalNews />
                            </section>
                        </div>

                        <Sidebar siteSettings={siteSettings} />
                    </div>
                </div>
            </section>

            {/* Banner Ad */}
            {siteSettings.advertisementsVisible && (
                <section className="border-t border-[var(--border-subtle)]">
                    <div className="page-container py-6 sm:py-8">
                        <BannerAd />
                    </div>
                </section>
            )}

            {/* Feature Stories */}
            {siteSettings.topStoriesVisible && hasActiveTopStories && (
                <section
                    ref={topStoriesRef}
                    id="top-stories"
                    className="feature-stories-section relative py-12 sm:py-20 overflow-hidden"
                >
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(96,165,250,0.15),transparent)] pointer-events-none" />
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_100%_100%,rgba(255,255,255,0.04),transparent)] pointer-events-none" />

                    <div className="relative z-10 page-container">
                        <SectionHeader
                            title="Feature Stories"
                            align="center"
                            className="[&_h2]:!text-white [&_.section-divider]:via-zinc-500"
                        />
                        <TopStories />
                    </div>
                </section>
            )}

            {/* Socials */}
            <section id="socials" className="border-t border-[var(--border-subtle)]">
                <div className="page-container py-12 sm:py-20">
                    <Socials />
                </div>
            </section>

            <Footer />
        </main>
    );
};

export default MainSection;
