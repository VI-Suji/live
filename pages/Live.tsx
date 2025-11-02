"use client";

import React, { useState } from "react";

type LiveNowProps = {
    channelId: string;
};

export default function LiveNow({ channelId }: LiveNowProps) {
    const [loaded, setLoaded] = useState(false);
    const embedSrc = `https://www.youtube.com/embed/live_stream?channel=${channelId}&autoplay=0`;

    return (
        <div className="w-full">
            <div className="flex flex-col md:flex-row md:items-center gap-4 w-full">
                {/* Icon (top on small, left on md+) */}
                <div
                    aria-hidden
                    className="flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-lg grid place-items-center
                               bg-gradient-to-br from-rose-500 to-amber-300 shadow-md"
                >
                    <svg
                        width="28"
                        height="28"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="block"
                    >
                        <circle cx="12" cy="12" r="3.2" fill="#fff" />
                        <path
                            d="M4 12c0-4.418 3.582-8 8-8"
                            stroke="rgba(255,255,255,0.6)"
                            strokeWidth="1.4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <path
                            d="M20 12c0 4.418-3.582 8-8 8"
                            stroke="rgba(255,255,255,0.6)"
                            strokeWidth="1.4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </div>

                {/* Preview (fills available width) */}
                <a
                    href={`https://www.youtube.com/channel/${channelId}/live`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative flex-1 rounded-xl overflow-hidden min-h-[140px] aspect-video
                               shadow-2xl no-underline w-full"
                >
                    {/* fallback background (blurred until iframe loads) */}
                    <div
                        aria-hidden
                        className={`absolute inset-0 bg-cover bg-center transition-all duration-300 ${
                            loaded ? "filter-none" : "blur-md saturate-105"
                        }`}
                        style={{
                            backgroundImage:
                                "linear-gradient(135deg, rgba(15,23,42,1) 0%, rgba(7,16,40,1) 100%), url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"600\" height=\"400\"><rect width=\"100%\" height=\"100%\" fill=\"#071028\"/></svg>')",
                        }}
                    />

                    {/* iframe */}
                    <iframe
                        title="Live preview"
                        src={embedSrc}
                        frameBorder={0}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        onLoad={() => setLoaded(true)}
                        className={`absolute inset-0 w-full h-full border-0 z-20 bg-transparent transition-opacity duration-300 ${
                            loaded ? "opacity-100" : "opacity-0"
                        }`}
                    />

                    {/* Liquid glass overlay */}
                    <div
                        aria-hidden
                        className="absolute left-3 bottom-3 md:left-6 md:bottom-6 z-30 flex items-center gap-2.5
                                   px-3 py-2 rounded-lg bg-white/5 border border-white/10 shadow-lg backdrop-blur-md text-white min-w-[120px]"
                        style={{
                            boxShadow:
                                "0 6px 24px rgba(2,6,23,0.45), inset 0 1px 0 rgba(255,255,255,0.03)",
                        }}
                    >
                        <div
                            className="w-2.5 h-2.5 rounded-full bg-red-500"
                            style={{ boxShadow: "0 0 10px rgba(255,59,48,0.8)" }}
                        />
                        <div className="text-sm font-semibold">LIVE NOW</div>
                        <div className="text-xs font-medium opacity-80 ml-2">Watch</div>
                    </div>
                </a>
            </div>
        </div>
    );
}