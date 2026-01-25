"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { FiMenu, FiX } from "react-icons/fi";
import BreakingNewsTicker from "./BreakingNewsTicker";
import LiveDateTime from "./LiveDateTime";

const Header: React.FC = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [activeSection, setActiveSection] = useState("home");
    const [siteSettings, setSiteSettings] = useState({
        liveStreamVisible: true,
        heroSectionVisible: true,
        topStoriesVisible: true,
    });
    const [menuItems, setMenuItems] = useState<Array<{ label: string; target: string }>>([]);

    // Rotating Image State
    const [headerImages, setHeaderImages] = useState<string[]>(["/gramika.png"]);
    const [rotationInterval, setRotationInterval] = useState(20000);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // Fetch site settings
    useEffect(() => {
        const fetchSettings = () => {
            fetch(`/api/sanity/siteSettings?t=${Date.now()}`)
                .then(res => res.json())
                .then(data => {
                    setSiteSettings({
                        liveStreamVisible: data.liveStreamVisible ?? true,
                        heroSectionVisible: data.heroSectionVisible ?? true,
                        topStoriesVisible: data.topStoriesVisible ?? true,
                    });


                    // Update header images - Always include Gramika logo as first item
                    if (data.headerImages && Array.isArray(data.headerImages) && data.headerImages.length > 0) {
                        const fetchedUrls = data.headerImages.map((img: any) => img.url);
                        setHeaderImages(["/gramika.png", ...fetchedUrls]);
                    } else {
                        setHeaderImages(["/gramika.png"]);
                    }

                    // Update rotation interval
                    if (data.rotationInterval) {
                        setRotationInterval(data.rotationInterval * 1000);
                    }
                })
                .catch(console.error);
        };

        // Initial fetch
        fetchSettings();

        // Refresh settings every 10 seconds
        const interval = setInterval(fetchSettings, 10000);

        return () => clearInterval(interval);
    }, []);

    // Rotation Timer
    useEffect(() => {
        if (headerImages.length <= 1) return;

        const interval = setInterval(() => {
            setCurrentImageIndex((prev) => (prev + 1) % headerImages.length);
        }, rotationInterval);
        return () => clearInterval(interval);
    }, [headerImages, rotationInterval]);

    const [contentAvailability, setContentAvailability] = useState({
        localNews: false,
        topStories: false,
    });

    // Check content availability
    useEffect(() => {
        // Check local news
        fetch('/api/sanity/localNews')
            .then(res => res.json())
            .then(data => {
                setContentAvailability(prev => ({
                    ...prev,
                    localNews: Array.isArray(data) && data.length > 0
                }));
            })
            .catch(console.error);

        // Check top stories
        fetch('/api/sanity/topStories')
            .then(res => res.json())
            .then(data => {
                setContentAvailability(prev => ({
                    ...prev,
                    topStories: Array.isArray(data) && data.length > 0
                }));
            })
            .catch(console.error);
    }, []);

    // Update menu items based on site settings and content availability
    useEffect(() => {
        const items = [];

        // Show HOME if hero section is visible
        if (siteSettings.heroSectionVisible) {
            items.push({ label: "HOME", target: "home" });
        }

        // Show LOCAL NEWS only if content exists
        if (contentAvailability.localNews) {
            items.push({ label: "LOCAL NEWS", target: "local-news" });
        }

        // Show FEATURE STORIES only if content exists AND setting is enabled
        if (contentAvailability.topStories && siteSettings.topStoriesVisible) {
            items.push({ label: "FEATURE STORIES", target: "top-stories" });
        }

        // Always show SOCIALS (it has social media links)
        items.push({ label: "SOCIALS", target: "socials" });

        setMenuItems(items);
    }, [siteSettings, contentAvailability]);

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Scroll Spy Logic
    useEffect(() => {
        const handleScrollSpy = () => {
            const scrollPosition = window.scrollY + 150; // Offset for header height

            // Create a copy of menu items and reverse it to check from bottom up
            // This ensures nested or overlapping sections are handled correctly (most specific first)
            const items = [...menuItems].reverse();

            for (const item of items) {
                let targetId = item.target;

                // Handle responsive Local News section
                if (targetId === 'local-news') {
                    const desktop = document.getElementById('local-news-desktop');
                    const mobile = document.getElementById('local-news-mobile');

                    // Check which one is visible
                    if (desktop && desktop.offsetParent !== null) {
                        targetId = 'local-news-desktop';
                    } else if (mobile && mobile.offsetParent !== null) {
                        targetId = 'local-news-mobile';
                    }
                }

                const section = document.getElementById(targetId);
                if (section) {
                    const rect = section.getBoundingClientRect();
                    const absoluteTop = rect.top + window.scrollY;
                    const height = rect.height;

                    if (
                        scrollPosition >= absoluteTop &&
                        scrollPosition < absoluteTop + height
                    ) {
                        setActiveSection(item.target); // Keep original target for active state
                        break;
                    }
                }
            }
        };

        window.addEventListener("scroll", handleScrollSpy);
        // Call once on mount/update to set initial state
        handleScrollSpy();

        return () => window.removeEventListener("scroll", handleScrollSpy);
    }, [menuItems]);

    // Smooth scroll handler
    const scrollToSection = (targetId: string) => {
        let actualTargetId = targetId;

        // Handle responsive Local News section
        if (targetId === 'local-news') {
            const desktop = document.getElementById('local-news-desktop');
            const mobile = document.getElementById('local-news-mobile');

            if (desktop && desktop.offsetParent !== null) {
                actualTargetId = 'local-news-desktop';
            } else if (mobile && mobile.offsetParent !== null) {
                actualTargetId = 'local-news-mobile';
            }
        }

        const section = document.getElementById(actualTargetId);
        if (section) {
            // Offset for sticky header (increased to account for breaking news ticker)
            const headerOffset = 120;
            const elementPosition = section.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth"
            });
            setActiveSection(targetId);
            setMobileMenuOpen(false);
        }
    };

    return (
        <>
            {/* Fixed Main Header (Logo + Navigation Only) */}
            <header
                className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ${isScrolled || mobileMenuOpen
                    ? "bg-white backdrop-blur-xl shadow-md border-b border-white/20 py-3"
                    : "bg-white backdrop-blur-lg shadow-sm py-5"
                    }`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between relative h-16 sm:h-20">
                        {/* Left: Rotating Image */}
                        <div className="flex-shrink-0 w-24 sm:w-32 flex justify-start z-10">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentImageIndex}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    transition={{ duration: 0.5 }}
                                    className="relative w-12 h-12 sm:w-16 sm:h-16"
                                >
                                    <Image
                                        src={headerImages[currentImageIndex]}
                                        alt="Rotating"
                                        fill
                                        className="object-contain"
                                    />
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        {/* Center: Text Only (Logo Removed) - Offset slightly left */}
                        <div
                            className="absolute left-[45%] top-1/2 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20 flex items-center gap-2 sm:gap-3"
                            onClick={() => scrollToSection("home")}
                        >
                            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-gray-900 whitespace-nowrap">
                                ഗ്രാമിക
                            </h1>
                        </div>

                        {/* Right: Navigation & Mobile Menu */}
                        <div className="flex-shrink-0 flex items-center justify-end z-10 w-20 sm:w-auto">
                            {/* Desktop Navigation */}
                            <nav className="hidden md:flex items-center gap-8">
                                {menuItems.map((item) => (
                                    <div key={item.label} className="relative">
                                        <button
                                            onClick={() => scrollToSection(item.target)}
                                            className={`text-sm font-bold tracking-wide transition-colors duration-300 hover:text-blue-600 ${activeSection === item.target ? "text-blue-600" : "text-gray-600"
                                                }`}
                                        >
                                            {item.label}
                                        </button>
                                        {activeSection === item.target && (
                                            <motion.div
                                                layoutId="underline"
                                                className="absolute left-0 right-0 -bottom-1 h-0.5 bg-blue-600"
                                                initial={false}
                                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                            />
                                        )}
                                    </div>
                                ))}
                            </nav>

                            {/* Mobile Menu Button */}
                            <button
                                className="md:hidden p-2 text-gray-900 focus:outline-none"
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                aria-label="Toggle menu"
                            >
                                {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Scrollable Content Below Fixed Header */}
            <div className="pt-28 sm:pt-32"> {/* Spacer for fixed header - adjusted for proper spacing */}
                {/* Live Date & Time */}
                <div className="bg-white/95 backdrop-blur-md border-b border-gray-200">
                    <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-1 sm:py-2">
                        <LiveDateTime />
                    </div>
                </div>

                {/* News Ticker */}
                <div className="relative z-40 bg-white">
                    <BreakingNewsTicker />
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="fixed inset-0 z-40 bg-white/95 backdrop-blur-3xl md:hidden pt-24 px-6"
                    >
                        <nav className="flex flex-col gap-6 items-center justify-center h-full pb-24">
                            {menuItems.map((item, idx) => (
                                <motion.button
                                    key={item.label}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.1, type: "spring", stiffness: 100 }}
                                    onClick={() => scrollToSection(item.target)}
                                    className={`text-2xl font-bold tracking-tight ${activeSection === item.target ? "text-blue-600" : "text-gray-900"
                                        }`}
                                >
                                    {item.label}
                                </motion.button>
                            ))}
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Header;
