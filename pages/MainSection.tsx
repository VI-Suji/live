"use client";

import React, { useRef } from "react";
import Hero from "./components/HeroComponent";
import Sidebar from "./components/SideBarComponent";
import Socials from "./components/SocialsComponent";
import LiveNow from "./components/LiveComponent";
import TopStories from "./components/TopStoriesComponent";
import Footer from "./components/FooterComponent";

const MainSection: React.FC = () => {
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
                <div className="flex flex-col p-1 sm:p-5 gap-10 w-full lg:w-3/4">
                    <Hero onReadMore={handleScrollToTopStories} />
                    <div className="flex flex-col gap-6">
                        <h2 className="text-3xl sm:text-5xl font-extrabold text-gray-900 leading-tight">
                            Live Now
                        </h2>
                        <LiveNow channelId="UCgkLuDaFGUrfljjp7cNtQcw" />
                    </div>
                </div>

                <Sidebar />
            </section>

            <section
                ref={topStoriesRef}
                id="top-stories"
                className="bg-[#121212] text-white w-full scroll-mt-30"
            >
                <h2 className="m-10 pt-5 text-3xl sm:text-5xl font-extrabold">
                    Top Stories
                </h2>
                <TopStories />
            </section>

            <section id="socials" className="bg-[#f8f8f8] w-full scroll-mt-24">
                <Socials />
            </section>
            <section className="py-5 bg-black">
                <Footer />
            </section>
        </>
    );
};

export default MainSection;
