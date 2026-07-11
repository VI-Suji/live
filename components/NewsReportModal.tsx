"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { FaArrowLeft, FaCalendarAlt, FaChevronLeft, FaChevronRight, FaTimes, FaUser } from "react-icons/fa";
import { motion } from "framer-motion";
import { getCanonicalNewsShareUrl } from "../utils/shareMeta";
import NewsShareMenu from "./NewsShareMenu";
import ThemeToggle from "./ThemeToggle";

export type NewsReportItem = {
    title: string;
    image: string;
    description?: string;
    author?: string;
    publishedAt: string;
};

type NewsReportModalProps = {
    news: NewsReportItem;
    onClose: () => void;
    onNext?: () => void;
    onPrev?: () => void;
};

export default function NewsReportModal({ news, onClose, onNext, onPrev }: NewsReportModalProps) {
    const shareUrl = getCanonicalNewsShareUrl(news.title);

    const [touchStart, setTouchStart] = useState<number | null>(null);
    const [touchEnd, setTouchEnd] = useState<number | null>(null);
    const minSwipeDistance = 50;

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "ArrowRight" && onNext) onNext();
            if (e.key === "ArrowLeft" && onPrev) onPrev();
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [onNext, onPrev, onClose]);

    const onTouchStart = (e: React.TouchEvent) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    };

    const onTouchMove = (e: React.TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        if (distance > minSwipeDistance && onNext) onNext();
        if (distance < -minSwipeDistance && onPrev) onPrev();
    };

    const formattedDate = new Date(news.publishedAt).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });

    const descriptionContent = (() => {
        if (!news.description) return null;
        const trimmedDesc = news.description.trim();
        const colonIndex = trimmedDesc.indexOf(":");
        if (colonIndex !== -1) {
            const prefix = trimmedDesc.substring(0, colonIndex + 1);
            const rest = trimmedDesc.substring(colonIndex + 1);
            return (
                <>
                    <span className="font-semibold text-[var(--text-primary)] mr-1">{prefix}</span>
                    {rest}
                </>
            );
        }
        return trimmedDesc;
    })();

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-0 sm:p-4 lg:p-8"
            onClick={onClose}
        >
            <motion.div
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 40, opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="bg-[var(--bg-surface)] w-full max-w-4xl h-full sm:h-auto sm:max-h-[90vh] sm:rounded-2xl overflow-hidden relative shadow-[var(--shadow-lg)] flex flex-col border border-[var(--border-subtle)]"
                onClick={(e) => e.stopPropagation()}
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
            >
                <div className="sticky top-0 z-50 bg-[var(--bg-surface)]/95 backdrop-blur-xl border-b border-[var(--border-subtle)] overflow-visible">
                    <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3 px-4 sm:px-6 h-14">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-muted)] rounded-lg transition-colors shrink-0 p-2"
                            title="Back to home"
                            aria-label="Back to home"
                        >
                            <FaArrowLeft className="text-xs sm:hidden" />
                            <span className="text-sm font-[family-name:var(--font-display)] font-medium sm:hidden">Back</span>
                            <FaTimes size={18} className="hidden sm:block" />
                        </button>

                        <span className="font-[family-name:var(--font-display)] text-xs sm:text-sm font-semibold tracking-tight text-[var(--text-primary)] text-center truncate min-w-0">
                            GRAMIKA NEWS ONLINE
                        </span>

                        <div className="shrink-0 justify-self-end">
                            <NewsShareMenu
                                shareUrl={shareUrl}
                                size="sm"
                                variant="prominent"
                                menuPlacement="below"
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between gap-3 px-4 pb-3">
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={onPrev}
                                disabled={!onPrev}
                                className={`w-8 h-8 flex items-center justify-center rounded-full border transition-all ${
                                    onPrev
                                        ? "border-[var(--border-default)] text-[var(--text-secondary)] hover:bg-[var(--bg-muted)] hover:text-[var(--accent)]"
                                        : "border-[var(--border-subtle)] text-[var(--text-tertiary)] cursor-not-allowed opacity-50"
                                }`}
                                title="Previous Story"
                                aria-label="Previous story"
                            >
                                <FaChevronLeft size={12} />
                            </button>
                            <span className="text-[10px] font-[family-name:var(--font-display)] font-medium uppercase tracking-wider text-[var(--text-tertiary)]">
                                Navigate
                            </span>
                            <button
                                type="button"
                                onClick={onNext}
                                disabled={!onNext}
                                className={`w-8 h-8 flex items-center justify-center rounded-full border transition-all ${
                                    onNext
                                        ? "border-[var(--border-default)] text-[var(--text-secondary)] hover:bg-[var(--bg-muted)] hover:text-[var(--accent)]"
                                        : "border-[var(--border-subtle)] text-[var(--text-tertiary)] cursor-not-allowed opacity-50"
                                }`}
                                title="Next Story"
                                aria-label="Next story"
                            >
                                <FaChevronRight size={12} />
                            </button>
                        </div>
                        <ThemeToggle className="shrink-0 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-muted)] dark:hover:bg-[var(--bg-muted)]" />
                    </div>
                </div>

                <div className="overflow-y-auto flex-1">
                    <div className="max-w-3xl mx-auto px-4 sm:px-8 py-8 sm:py-10">
                        <header className="mb-8">
                            <h2 className="text-display text-2xl sm:text-3xl lg:text-4xl leading-[1.12] tracking-tight mb-8">
                                {news.title}
                            </h2>

                            <div className="flex flex-wrap items-center gap-x-6 gap-y-4 pt-6 border-t border-[var(--border-subtle)]">
                                {news.author && (
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-[var(--bg-muted)] flex items-center justify-center text-[var(--accent)] border border-[var(--border-subtle)]">
                                            <FaUser size={16} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-[var(--text-tertiary)] font-[family-name:var(--font-display)] uppercase tracking-wider mb-0.5">
                                                Reported By
                                            </p>
                                            <p className="text-sm font-medium text-[var(--text-primary)]">{news.author}</p>
                                        </div>
                                    </div>
                                )}

                                <div className="flex flex-col">
                                    <p className="text-[10px] text-[var(--text-tertiary)] font-[family-name:var(--font-display)] uppercase tracking-wider mb-0.5">
                                        Published On
                                    </p>
                                    <div className="flex items-center gap-2 text-sm text-[var(--text-primary)] font-medium">
                                        <FaCalendarAlt size={12} className="text-[var(--text-tertiary)]" />
                                        <span>{formattedDate}</span>
                                    </div>
                                </div>
                            </div>
                        </header>

                        <figure className="mb-10 image-frame relative aspect-[16/9]">
                            <Image
                                src={news.image || "/gramika.png"}
                                alt={news.title}
                                fill
                                className="object-cover"
                            />
                        </figure>

                        {descriptionContent && (
                            <p className="text-[1.0625rem] sm:text-lg leading-[1.85] text-[var(--text-secondary)] whitespace-pre-line mb-10">
                                {descriptionContent}
                            </p>
                        )}

                        <div className="pt-8 border-t border-[var(--border-subtle)] pb-8">
                            <div className="story-share-card">
                                <p className="text-xs font-[family-name:var(--font-display)] font-semibold text-[var(--text-tertiary)] uppercase tracking-wider mb-1">
                                    Share this report
                                </p>
                                <p className="text-[var(--text-primary)] font-medium mb-4">Share it with others</p>
                                <NewsShareMenu shareUrl={shareUrl} layout="inline" />
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}
