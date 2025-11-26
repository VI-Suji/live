"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiMenu, FiX } from "react-icons/fi";

const MENU_ITEMS = [
    { label: "HOME", target: "home" },
    { label: "LOCAL NEWS", target: "local-news" },
    { label: "TOP STORIES", target: "top-stories" },
    { label: "SOCIALS", target: "socials" },
];

const Header: React.FC = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [activeSection, setActiveSection] = useState("home");

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
            // Offset for sticky header
            const headerOffset = 80;
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
            <header
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled || mobileMenuOpen
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
                            {MENU_ITEMS.map((item) => (
                                <button
                                    key={item.label}
                                    onClick={() => scrollToSection(item.target)}
                                    className={`text-sm font-bold tracking-wide transition-all duration-300 hover:text-blue-600 ${activeSection === item.target ? "text-blue-600" : "text-gray-600"
                                        }`}
                                >
                                    {item.label}
                                </button>
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

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-40 bg-white/95 backdrop-blur-3xl md:hidden pt-24 px-6"
                    >
                        <nav className="flex flex-col gap-6 items-center justify-center h-full pb-24">
                            {MENU_ITEMS.map((item, idx) => (
                                <motion.button
                                    key={item.label}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    onClick={() => scrollToSection(item.target)}
                                    className={`text-2xl font-bold tracking-tight ${activeSection === item.target ? "text-blue-600" : "text-gray-900"
                                        }`}
                                >
                                    {item.label}
                                </motion.button>
                            ))}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="mt-8"
                            >
                                <button className="px-8 py-3 bg-blue-600 text-white text-lg font-bold rounded-full shadow-lg hover:bg-blue-700 transition-colors">
                                    Subscribe Now
                                </button>
                            </motion.div>
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Header;
