"use client";

import React, { useState, useEffect } from "react";
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
                })
                .catch(console.error);
        };

        // Initial fetch
        fetchSettings();

        // Refresh settings every 10 seconds
        const interval = setInterval(fetchSettings, 10000);

        return () => clearInterval(interval);
    }, []);

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

        // Show TOP STORIES only if content exists AND setting is enabled
        if (contentAvailability.topStories && siteSettings.topStoriesVisible) {
            items.push({ label: "TOP STORIES", target: "top-stories" });
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

    // Smooth scroll handler
    const scrollToSection = (targetId: string) => {
        const section = document.getElementById(targetId);
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
            {/* Fixed Container for both Ticker and Header */}
            <div className="fixed top-0 left-0 right-0 z-50 flex flex-col">
                {/* Main Header */}
                <header
                    className={`relative w-full transition-all duration-300 ${isScrolled || mobileMenuOpen
                        ? "bg-white/80 backdrop-blur-xl shadow-sm border-b border-white/20 py-3"
                        : "bg-transparent py-5"
                        }`}
                >
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between">
                            {/* Logo */}
                            <div
                                className="cursor-pointer z-50 relative"
                                onClick={() => scrollToSection("home")}
                            >
                                <h1 className={`text-2xl sm:text-3xl font-extrabold tracking-tight transition-colors duration-300 ${isScrolled || mobileMenuOpen ? "text-gray-900" : "text-gray-900"
                                    }`}>
                                    ഗ്രാമിക
                                </h1>
                            </div>

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
                                className="md:hidden z-50 p-2 text-gray-900 focus:outline-none"
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                aria-label="Toggle menu"
                            >
                                {mobileMenuOpen ? <FiX size={28} /> : <FiMenu size={28} />}
                            </button>
                        </div>
                    </div>
                </header>

                {/* Breaking News Ticker */}
                <div className="relative z-[60]">
                    <BreakingNewsTicker />
                </div>

                {/* Live Date & Time */}
                <div className={`transition-all duration-300 ${isScrolled ? "bg-white/80 backdrop-blur-xl shadow-sm" : "bg-white/95 backdrop-blur-md"} border-b border-white/20`}>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
                        <LiveDateTime />
                    </div>
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
