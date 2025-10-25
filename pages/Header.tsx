"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { FiSearch, FiBell, FiX } from "react-icons/fi";

const MENU_ITEMS = ["HOME", "TECHNOLOGY", "BUSINESS"];

const Header: React.FC = () => {
    const [active, setActive] = useState<string>(MENU_ITEMS[0]);
    const [positions, setPositions] = useState<{ left: number; width: number }>({ left: 0, width: 0 });

    const itemRefs = useRef<Array<HTMLButtonElement | null>>([]);
    const navRef = useRef<HTMLElement | null>(null);

    const [searchOpen, setSearchOpen] = useState(false);
    const searchInputRef = useRef<HTMLInputElement | null>(null);

    const updatePositions = useCallback(() => {
        const idx = MENU_ITEMS.indexOf(active);
        const el = itemRefs.current[idx];
        const navEl = navRef.current;
        if (!el || !navEl) return;
        setPositions({
            left: el.offsetLeft - navEl.scrollLeft,
            width: el.offsetWidth,
        });
    }, [active]);

    useEffect(() => {
        updatePositions();
        const handleResize = () => updatePositions();
        const navEl = navRef.current;

        window.addEventListener("resize", handleResize);
        navEl?.addEventListener("scroll", handleResize, { passive: true });

        // ensure measurements after layout / font load
        const rafId = requestAnimationFrame(updatePositions);

        return () => {
            window.removeEventListener("resize", handleResize);
            navEl?.removeEventListener("scroll", handleResize);
            cancelAnimationFrame(rafId);
        };
    }, [updatePositions]);

    // focus input when opening
    useEffect(() => {
        if (!searchOpen) return;
        const t = setTimeout(() => searchInputRef.current?.focus(), 120);
        return () => clearTimeout(t);
    }, [searchOpen]);

    // close search with Escape key
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") setSearchOpen(false);
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, []);

    const handleItemClick = (idx: number, item: string) => {
        setActive(item);
        const navEl = navRef.current;
        const el = itemRefs.current[idx];
        if (navEl && el) {
            const elLeft = el.offsetLeft;
            const elRight = elLeft + el.offsetWidth;
            if (elLeft < navEl.scrollLeft) {
                navEl.scrollTo({ left: elLeft, behavior: "smooth" });
            } else if (elRight > navEl.scrollLeft + navEl.clientWidth) {
                navEl.scrollTo({ left: elRight - navEl.clientWidth, behavior: "smooth" });
            }
        }
    };

    return (
        <header className="w-full bg-[#f8f8f8] backdrop-blur-2xl border-b border-white/30 shadow-sm">
            {/* Top row */}
            <div className="flex items-center justify-between px-3 md:px-6 py-3 relative">
                {/* left spacer for md+ */}
                <div className="hidden md:block w-24" />

                {/* Title: left on mobile, centered on md+; hide on mobile when search open */}
                <h1
                    className={`${
                        searchOpen ? "hidden md:block" : "block"
                    } md:absolute md:left-1/2 md:-translate-x-1/2 text-left md:text-center text-2xl md:text-4xl font-bold text-gray-900 pl-2 md:pl-0`}
                >
                    THE NEWS DAILY
                </h1>

                {/* right controls */}
                <div className="flex items-center gap-2 md:gap-3 ml-auto">
                    {/* desktop inline search */}
                    <div className="hidden md:flex items-center w-56 bg-gray-100 hover:bg-gray-200 rounded-full px-2 py-1.5 shadow-sm hover:shadow-md transition-all duration-200">
                        <FiSearch className="text-gray-700 text-lg" />
                        <input
                            type="text"
                            placeholder="Search..."
                            className="bg-transparent outline-none px-2 text-sm text-gray-800 placeholder-gray-500"
                            aria-label="Search"
                        />
                    </div>

                    {/* mobile search: expands from icon (icon stays where other icons are) */}
                    <div className="relative md:hidden h-10">
                        <motion.div
                            initial={false}
                            animate={searchOpen ? { width: 220 } : { width: 40 }}
                            transition={{ type: "spring", stiffness: 380, damping: 28 }}
                            style={{ transformOrigin: "right center" }}
                            className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center"
                        >
                            <div
                                className="relative bg-gray-100 rounded-full shadow-sm overflow-hidden flex items-center h-10"
                                style={{ width: "100%", minWidth: 40 }}
                            >
                                <motion.input
                                    ref={searchInputRef}
                                    type="text"
                                    placeholder="Search..."
                                    onBlur={() => setTimeout(() => setSearchOpen(false), 120)}
                                    initial={false}
                                    animate={
                                        searchOpen
                                            ? { width: 160, opacity: 1, paddingLeft: 10 }
                                            : { width: 0, opacity: 0, paddingLeft: 0 }
                                    }
                                    transition={{ type: "spring", stiffness: 380, damping: 28 }}
                                    className="h-10 bg-transparent outline-none text-sm text-gray-800 placeholder-gray-500"
                                    aria-label="Search"
                                />

                                <motion.button
                                    onClick={() => setSearchOpen((s) => !s)}
                                    aria-label={searchOpen ? "Close search" : "Open search"}
                                    aria-expanded={searchOpen}
                                    onMouseDown={(e) => e.preventDefault()}
                                    className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center justify-center w-10 h-10 p-0 text-gray-700"
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <motion.div
                                        key={searchOpen ? "x" : "search"}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                        className="w-8 h-8 flex items-center justify-center text-gray-700"
                                    >
                                        {searchOpen ? <FiX className="text-xl" /> : <FiSearch className="text-xl" />}
                                    </motion.div>
                                </motion.button>
                            </div>
                        </motion.div>
                    </div>

                    {/* notification */}
                    <button
                        type="button"
                        aria-label="Notifications"
                        className="relative w-10 h-10 md:w-10 md:h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center shadow-sm hover:shadow-md cursor-pointer transition-all duration-200 flex-shrink-0"
                    >
                        <FiBell className="text-gray-700 text-xl" />
                        <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-red-500 rounded-full border border-white" />
                    </button>

                    {/* profile */}
                    <button
                        type="button"
                        aria-label="Profile"
                        className="w-10 h-10 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold text-base shadow-sm hover:shadow-md cursor-pointer flex-shrink-0"
                    >
                        S
                    </button>
                </div>
            </div>

            {/* navigation / menu */}
            <nav
                ref={navRef}
                aria-label="Primary"
                className="w-full max-w-full md:max-w-lg relative flex md:justify-between px-2 md:px-3 py-2 mx-3 md:mx-6 my-2 overflow-x-auto md:overflow-hidden"
            >
                {/* sliding highlight */}
                <motion.div
                    layout
                    animate={{ left: positions.left, width: positions.width }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    className="absolute top-1.5 bottom-1.5 bg-white/60 backdrop-blur-2xl rounded-lg shadow-[inset_0_1px_4px_rgba(255,255,255,0.8),0_4px_8px_rgba(0,0,0,0.05)] border border-black/20 z-10"
                />

                <div className="flex gap-1 md:gap-0 md:flex-1 items-center w-max md:w-full">
                    {MENU_ITEMS.map((item, i) => (
                        <button
                            key={item}
                            ref={(el) => (itemRefs.current[i] = el)}
                            onClick={() => handleItemClick(i, item)}
                            className={`relative z-10 flex-none md:flex-1 text-center px-2 py-1 text-sm font-semibold transition-colors duration-300 ${
                                active === item ? "text-gray-900" : "text-gray-600 hover:text-gray-900"
                            }`}
                            aria-current={active === item ? "page" : undefined}
                        >
                            {item}
                        </button>
                    ))}
                </div>
            </nav>
        </header>
    );
};

export default Header;
