"use client";

import React, { useState, useEffect } from "react";

const LiveDateTime: React.FC = () => {
    const [currentTime, setCurrentTime] = useState<Date | null>(null);

    useEffect(() => {
        setCurrentTime(new Date());
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    if (!currentTime) return null;

    const formatDate = (date: Date) => {
        const options: Intl.DateTimeFormatOptions = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        };
        return date.toLocaleDateString('en-US', options);
    };

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        });
    };

    return (
        <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-6 text-gray-600">
            <div className="flex items-center gap-2">
                <span className="text-[10px] sm:text-sm font-medium uppercase tracking-wider">{formatDate(currentTime)}</span>
            </div>
            <div className="hidden sm:block w-px h-4 bg-gray-300"></div>
            <div className="flex items-center gap-1.5 sm:gap-2">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-red-500 animate-pulse"></div>
                <span className="text-[10px] sm:text-sm font-bold tabular-nums text-gray-900">{formatTime(currentTime)}</span>
            </div>
        </div>
    );
};

export default LiveDateTime;
