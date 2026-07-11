"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { FiMenu, FiX } from "react-icons/fi";
import BreakingNewsTicker from "./BreakingNewsTicker";
import LiveDateTime from "./LiveDateTime";
import ThemeToggle from "./ThemeToggle";
import { navigateToHomeSection } from "../utils/slugify";

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
    const [headerImages, setHeaderImages] = useState<string[]>(["/gramika.png"]);
    const [rotationInterval, setRotationInterval] = useState(20000);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

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

                    if (data.headerImages && Array.isArray(data.headerImages) && data.headerImages.length > 0) {
                        const fetchedUrls = data.headerImages.map((img: { url: string }) => img.url);
                        setHeaderImages(["/gramika.png", ...fetchedUrls]);
                    } else {
                        setHeaderImages(["/gramika.png"]);
                    }

                    if (data.rotationInterval) {
                        setRotationInterval(data.rotationInterval * 1000);
                    }
                })
                .catch(console.error);
        };

        fetchSettings();
        const interval = setInterval(fetchSettings, 10000);
        return () => clearInterval(interval);
    }, []);

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

    useEffect(() => {
        fetch('/api/sanity/localNews')
            .then(res => res.json())
            .then(data => {
                setContentAvailability(prev => ({
                    ...prev,
                    localNews: Array.isArray(data) && data.length > 0
                }));
            })
            .catch(console.error);

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

    useEffect(() => {
        const items = [];
        if (siteSettings.heroSectionVisible) items.push({ label: "Home", target: "home" });
        if (contentAvailability.localNews) items.push({ label: "News", target: "local-news" });
        if (contentAvailability.topStories && siteSettings.topStoriesVisible) items.push({ label: "Features", target: "top-stories" });
        items.push({ label: "Socials", target: "socials" });
        items.push({ label: "About", target: "/about" });
        setMenuItems(items);
    }, [siteSettings, contentAvailability]);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 12);
        const currentPath = window.location.pathname;
        if (currentPath === '/about' || currentPath === '/about/') setActiveSection('/about');
        else if (currentPath === '/' || currentPath === '') setActiveSection('home');
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        const handleScrollSpy = () => {
            const currentPath = window.location.pathname;
            if (currentPath !== '/' && currentPath !== '') {
                if (currentPath === '/about' || currentPath === '/about/') setActiveSection('/about');
                return;
            }

            const scrollPosition = window.scrollY + 150;
            const items = [...menuItems].reverse();

            for (const item of items) {
                let targetId = item.target;
                if (targetId === 'local-news') {
                    const desktop = document.getElementById('local-news-desktop');
                    const mobile = document.getElementById('local-news-mobile');
                    if (desktop && desktop.offsetParent !== null) targetId = 'local-news-desktop';
                    else if (mobile && mobile.offsetParent !== null) targetId = 'local-news-mobile';
                }

                const section = document.getElementById(targetId);
                if (section) {
                    const rect = section.getBoundingClientRect();
                    const absoluteTop = rect.top + window.scrollY;
                    if (scrollPosition >= absoluteTop && scrollPosition < absoluteTop + rect.height) {
                        setActiveSection(item.target);
                        break;
                    }
                }
            }
        };

        window.addEventListener("scroll", handleScrollSpy);
        handleScrollSpy();
        return () => window.removeEventListener("scroll", handleScrollSpy);
    }, [menuItems]);

    const scrollToSection = (targetId: string) => {
        if (targetId.startsWith('/')) {
            window.location.href = targetId;
            return;
        }

        if (targetId === 'home') {
            if (window.location.pathname !== '/' && window.location.pathname !== '') {
                window.location.href = '/';
                return;
            }
            window.scrollTo({ top: 0, behavior: 'smooth' });
            setActiveSection('home');
            setMobileMenuOpen(false);
            return;
        }

        if (window.location.pathname !== '/' && window.location.pathname !== '') {
            navigateToHomeSection(targetId);
            return;
        }

        let actualTargetId = targetId;
        if (targetId === 'local-news') {
            const desktop = document.getElementById('local-news-desktop');
            const mobile = document.getElementById('local-news-mobile');
            if (desktop && desktop.offsetParent !== null) actualTargetId = 'local-news-desktop';
            else if (mobile && mobile.offsetParent !== null) actualTargetId = 'local-news-mobile';
        }

        const section = document.getElementById(actualTargetId);
        if (section) {
            const headerOffset = 120;
            const offsetPosition = section.getBoundingClientRect().top + window.pageYOffset - headerOffset;
            window.scrollTo({ top: offsetPosition, behavior: "smooth" });
            setActiveSection(targetId);
            setMobileMenuOpen(false);
        }
    };

    useEffect(() => {
        const currentPath = window.location.pathname;
        if (currentPath !== '/' && currentPath !== '') return;

        const hash = window.location.hash.slice(1);
        if (!hash || hash.startsWith('news')) return;

        const timer = window.setTimeout(() => {
            let actualTargetId = hash;
            if (hash === 'local-news') {
                const desktop = document.getElementById('local-news-desktop');
                const mobile = document.getElementById('local-news-mobile');
                if (desktop && desktop.offsetParent !== null) actualTargetId = 'local-news-desktop';
                else if (mobile && mobile.offsetParent !== null) actualTargetId = 'local-news-mobile';
            }

            const section = document.getElementById(actualTargetId);
            if (section) {
                const headerOffset = 120;
                const offsetPosition = section.getBoundingClientRect().top + window.pageYOffset - headerOffset;
                window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
                setActiveSection(hash === 'local-news' ? 'local-news' : hash);
            }
        }, 350);

        return () => window.clearTimeout(timer);
    }, []);

    return (
        <>
            <header
                className={`fixed top-0 left-0 right-0 z-50 w-full h-14 sm:h-16 transition-all duration-300 border-b ${
                    isScrolled || mobileMenuOpen
                        ? "bg-[var(--bg-surface)]/95 backdrop-blur-xl border-[var(--border-subtle)] shadow-[var(--shadow-sm)]"
                        : "bg-[var(--bg-surface)]/90 backdrop-blur-md border-[var(--border-subtle)]"
                }`}
            >
                <div className="page-container h-full">
                    <div className="flex items-center justify-between relative h-full">
                        <div className="flex-shrink-0 w-20 sm:w-28 flex justify-start z-10">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentImageIndex}
                                    initial={{ opacity: 0, scale: 0.92 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.92 }}
                                    transition={{ duration: 0.4 }}
                                    className="relative w-10 h-10 sm:w-12 sm:h-12"
                                >
                                    <Image
                                        src={headerImages[currentImageIndex]}
                                        alt="Gramika News"
                                        fill
                                        className="object-contain"
                                    />
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        <button
                            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center cursor-pointer"
                            onClick={() => scrollToSection("home")}
                        >
                            <span className="font-[family-name:var(--font-display)] text-sm sm:text-xl font-semibold tracking-tight text-[var(--text-primary)] whitespace-nowrap">
                                GRAMIKA NEWS ONLINE
                            </span>
                        </button>

                        <div className="flex-shrink-0 flex items-center justify-end gap-1 z-10">
                            <nav className="hidden md:flex items-center gap-1">
                                {menuItems.map((item) => (
                                    <div key={item.label} className="relative">
                                        <button
                                            onClick={() => scrollToSection(item.target)}
                                            className={`px-3 py-2 text-sm font-[family-name:var(--font-display)] font-medium rounded-lg transition-colors duration-200 ${
                                                activeSection === item.target
                                                    ? "text-[var(--accent)]"
                                                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-muted)]"
                                            }`}
                                        >
                                            {item.label}
                                        </button>
                                        {activeSection === item.target && (
                                            <motion.div
                                                layoutId="nav-indicator"
                                                className="absolute bottom-0 left-3 right-3 h-0.5 bg-[var(--accent)] rounded-full"
                                                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                            />
                                        )}
                                    </div>
                                ))}
                            </nav>

                            <ThemeToggle className="hidden sm:flex" />

                            <button
                                className="md:hidden p-2 text-[var(--text-primary)] rounded-lg hover:bg-[var(--bg-muted)]"
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                aria-label="Toggle menu"
                            >
                                {mobileMenuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="pt-14 sm:pt-16">
                <div className="bg-zinc-800 border-b border-zinc-700">
                    <div className="page-container py-1.5 sm:py-2">
                        <LiveDateTime />
                    </div>
                </div>
                <BreakingNewsTicker />
            </div>

            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-40 bg-[var(--bg-surface)]/95 backdrop-blur-xl md:hidden pt-20"
                    >
                        <nav className="flex flex-col gap-1 px-6 py-8">
                            {menuItems.map((item, idx) => (
                                <motion.button
                                    key={item.label}
                                    initial={{ opacity: 0, x: -12 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    onClick={() => scrollToSection(item.target)}
                                    className={`text-left px-4 py-4 text-lg font-[family-name:var(--font-display)] font-medium rounded-xl transition-colors ${
                                        activeSection === item.target
                                            ? "text-[var(--accent)] bg-[var(--accent-muted)]"
                                            : "text-[var(--text-primary)] hover:bg-[var(--bg-muted)]"
                                    }`}
                                >
                                    {item.label}
                                </motion.button>
                            ))}
                            <div className="flex items-center gap-3 px-4 pt-6 mt-4 border-t border-[var(--border-subtle)]">
                                <span className="text-sm text-[var(--text-tertiary)]">Theme</span>
                                <ThemeToggle />
                            </div>
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Header;
