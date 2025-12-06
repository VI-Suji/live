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