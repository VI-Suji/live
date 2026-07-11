"use client";

import React, { useState, useEffect } from "react";

const LiveDateTime: React.FC = () => {
    const [currentTime, setCurrentTime] = useState<Date | null>(null);

    useEffect(() => {
        setCurrentTime(new Date());
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    if (!currentTime) return null;

    const formatDate = (date: Date) =>
        date.toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
            year: "numeric",
        });

    const formatTime = (date: Date) =>
        date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true });

    return (
        <div className="flex flex-row items-center justify-center gap-3 sm:gap-4">
            <span className="text-xs sm:text-sm font-[family-name:var(--font-display)] font-medium text-white tracking-wide">
                {formatDate(currentTime)}
            </span>
            <div className="w-px h-3.5 bg-zinc-500" />
            <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                <span className="text-xs sm:text-sm font-[family-name:var(--font-display)] font-semibold tabular-nums text-white">
                    {formatTime(currentTime)}
                </span>
            </div>
        </div>
    );
};

export default LiveDateTime;
