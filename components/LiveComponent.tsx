"use client";

import React, { useState } from "react";

type LiveNowProps = {
    channelId: string;
};

export default function LiveNow({ channelId }: LiveNowProps) {
    const [loaded, setLoaded] = useState(false);
    const embedSrc = `https://www.youtube.com/embed/live_stream?channel=${channelId}&autoplay=0`;

    return (
        <div id="live-section" className="w-full max-w-3xl mx-auto">
            <div className="relative rounded-3xl overflow-hidden shadow-xl bg-black border border-gray-200 aspect-video group">
                {/* Status Bar */}
                <div className="absolute top-4 left-4 z-30 flex items-center gap-3">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-red-600 rounded-full shadow-lg">
                        <span className="relative flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
                        </span>
                        <span className="text-white text-xs font-bold uppercase tracking-wider">Live Now</span>
                    </div>
                </div>

                {/* Fallback & Iframe */}
                <div className="absolute inset-0 bg-gray-900">
                    <iframe
                        title="Live preview"
                        src={embedSrc}
                        frameBorder={0}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        onLoad={() => setLoaded(true)}
                        className={`absolute inset-0 w-full h-full z-20 transition-opacity duration-700 ${loaded ? "opacity-100" : "opacity-0"}`}
                    />
                </div>

                {/* Loading State */}
                {!loaded && (
                    <div className="absolute inset-0 z-10 flex items-center justify-center bg-gray-900">
                        <div className="flex flex-col items-center gap-4">
                            <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                            <p className="text-gray-400 text-sm font-medium animate-pulse">Connecting to Live Stream...</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}