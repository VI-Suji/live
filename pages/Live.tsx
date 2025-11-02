"use client";

import React, { useState } from "react";

type LiveNowProps = {
    channelId: string;
};

export default function LiveNow({ channelId }: LiveNowProps) {
    const [loaded, setLoaded] = useState(false);
    const embedSrc = `https://www.youtube.com/embed/live_stream?channel=${channelId}&autoplay=0`;

    return (
        <div className="sm:w-5/6 w-full mx-auto">
            <div className="flex flex-col md:flex-row md:items-center gap-4 w-full">
                {/* Icon (hidden on mobile, wider, vertically centered) */}
                <div
                    aria-hidden
                    className="hidden md:flex flex-shrink-0 rounded-lg grid place-items-center
                               bg-gradient-to-br from-blue-400 to-purple-500 hover:from-blue-500 hover:to-purple-600 shadow-md"
                >
                    <svg
                        width="36"
                        height="36"
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
                    className="relative w-full md:flex-1 rounded-xl overflow-hidden aspect-video md:aspect-video shadow-2xl no-underline max-w-full"
                >

                    {/* fallback background */}
                    <div
                        aria-hidden
                        className={`absolute inset-0 bg-cover bg-center transition-all duration-300 ${loaded ? "filter-none" : "blur-md saturate-105"
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
                        className={`absolute inset-0 w-full h-full border-0 z-20 bg-transparent transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"
                            }`}
                    />

                    {/* corner shadows */}
                    <div className="absolute inset-0 pointer-events-none z-30">
                        <div
                            style={{
                                top: -12,
                                left: -12,
                                width: 120,
                                height: 120,
                                borderRadius: 999,
                                filter: "blur(28px)",
                                background:
                                    "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.12), rgba(255,255,255,0.02) 30%, transparent 60%)",
                            }}
                            className="absolute"
                        />
                        <div
                            style={{
                                top: -8,
                                right: -8,
                                width: 100,
                                height: 100,
                                borderRadius: 999,
                                filter: "blur(22px)",
                                background:
                                    "radial-gradient(circle at 80% 20%, rgba(255,255,255,0.08), transparent 50%)",
                            }}
                            className="absolute"
                        />
                        <div
                            style={{
                                bottom: -10,
                                left: -10,
                                width: 120,
                                height: 120,
                                borderRadius: 999,
                                filter: "blur(28px)",
                                background:
                                    "radial-gradient(circle at 20% 80%, rgba(0,0,0,0.12), rgba(0,0,0,0.04) 35%, transparent 60%)",
                            }}
                            className="absolute"
                        />
                        <div
                            style={{
                                bottom: -14,
                                right: -14,
                                width: 160,
                                height: 160,
                                borderRadius: 999,
                                filter: "blur(36px)",
                                background:
                                    "radial-gradient(circle at 80% 80%, rgba(0,0,0,0.16), rgba(0,0,0,0.06) 35%, transparent 60%)",
                            }}
                            className="absolute"
                        />
                        <div
                            className="absolute inset-0 rounded-xl pointer-events-none"
                            style={{
                                boxShadow:
                                    "inset 0 1px 0 rgba(255,255,255,0.02), inset 0 -1px 8px rgba(0,0,0,0.06)",
                            }}
                        />
                    </div>
                </a>
            </div>
        </div>
    );
}