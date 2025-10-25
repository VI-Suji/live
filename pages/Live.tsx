"use client";

import React, { useEffect, useRef, useState } from "react";
import { FiYoutube } from "react-icons/fi";

interface LiveNowProps {
    channelId: string;
}

const POLL_INTERVAL = 30_000; // 30s

const LiveNow: React.FC<LiveNowProps> = ({ channelId }) => {
    const [isLive, setIsLive] = useState(false);
    const [liveVideoId, setLiveVideoId] = useState<string | null>(null);
    const [checking, setChecking] = useState(false);
    const mountedRef = useRef(true);
    const inflightRef = useRef(false);

    useEffect(() => {
        mountedRef.current = true;
        return () => {
            mountedRef.current = false;
        };
    }, []);

    useEffect(() => {
        if (!channelId) return;

        const check = async () => {
            if (!mountedRef.current || inflightRef.current) return;
            inflightRef.current = true;
            setChecking(true);

            try {
                const url = `/api/live?channelId=${encodeURIComponent(channelId)}`;
                const res = await fetch(url, { cache: "no-store" });
                if (!res.ok) throw new Error(`Status ${res.status}`);
                const data = await res.json();
                if (!mountedRef.current) return;

                if (data?.live && data?.videoId) {
                    setLiveVideoId(data.videoId);
                    setIsLive(true);
                } else {
                    setLiveVideoId(null);
                    setIsLive(false);
                }
            } catch (err) {
                console.error("Live check failed:", err);
                if (mountedRef.current) {
                    setIsLive(false);
                    setLiveVideoId(null);
                }
            } finally {
                inflightRef.current = false;
                if (mountedRef.current) setChecking(false);
            }
        };

        check();
        const id = window.setInterval(check, POLL_INTERVAL);

        // re-check when tab becomes visible
        const onVisibility = () => {
            if (document.visibilityState === "visible") check();
        };
        document.addEventListener("visibilitychange", onVisibility);

        return () => {
            clearInterval(id);
            document.removeEventListener("visibilitychange", onVisibility);
        };
    }, [channelId]);

    return (
        <div className="w-full flex justify-center items-center mt-1 px-1">
            <div className="flex flex-col lg:flex-row items-center gap-4 w-full max-w-5xl p-3 rounded-3xl transition-all duration-300">
                {/* Left: YouTube Icon */}
                <div
                    className={`relative flex items-center justify-center rounded-full text-white flex-shrink-0 shadow-md transform transition-all duration-300 cursor-pointer
                        ${isLive ? "w-40 h-14 ml-4 bg-gradient-to-br from-blue-400 to-purple-500 hover:from-blue-500 hover:to-purple-600" : "w-12 h-12 bg-gradient-to-b from-gray-300 to-gray-200 text-gray-700"}`}
                    title={isLive ? "Live Now" : "Not Live"}
                >
                    <FiYoutube className={isLive ? "text-3xl" : "text-xl"} />
                    {isLive && (
                        <>
                            <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-red-500 rounded-full animate-ping" />
                            <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-red-500 rounded-full" />
                        </>
                    )}
                </div>

                {/* Center: Live Video or Liquid Glass Placeholder */}
                <div className="flex-1 w-full flex justify-center">
                    <div
                        className={`relative w-full max-w-4xl aspect-video rounded-2xl overflow-hidden border shadow-xl transition-all duration-300
                            ${isLive ? "border-white/20 bg-black" : "border-white/8 bg-white/6"}`}
                        style={
                            isLive
                                ? undefined
                                : {
                                      WebkitBackdropFilter: "blur(12px) saturate(120%)",
                                      backdropFilter: "blur(12px) saturate(120%)",
                                      background:
                                          "linear-gradient(135deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))",
                                  }
                        }
                    >
                        {isLive && liveVideoId ? (
                            <iframe
                                src={`https://www.youtube.com/embed/${liveVideoId}?autoplay=1&muted=1`}
                                className="w-full h-full"
                                title="Live Now"
                                allow="autoplay; encrypted-media"
                                allowFullScreen
                            />
                        ) : checking ? (
                            <div className="w-full h-full flex items-center justify-center text-yellow-700 font-medium text-lg bg-yellow-50">
                                Checking live status...
                            </div>
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-800 font-semibold text-lg">
                                <div className="max-w-lg text-center px-6 z-10">
                                    <div className="mb-3 text-2xl">No live stream right now</div>
                                    <div className="text-sm text-gray-600">
                                        We'll automatically update when the channel goes live.
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Liquid glass decorative layers ONLY when not live */}
                        {!isLive && (
                            <>
                                {/* soft blurred highlights */}
                                <div
                                    aria-hidden
                                    className="pointer-events-none absolute inset-0 rounded-2xl"
                                    style={{
                                        background:
                                            "linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.015))",
                                    }}
                                />

                                {/* subtle glossy ellipse (top-left) */}
                                <div
                                    aria-hidden
                                    className="pointer-events-none absolute -left-16 -top-12 w-72 h-36 rounded-full opacity-40 blur-2xl"
                                    style={{
                                        background:
                                            "radial-gradient(closest-side, rgba(255,255,255,0.28), rgba(255,255,255,0.03))",
                                        transform: "rotate(-12deg)",
                                    }}
                                />

                                {/* soft bottom sheen */}
                                <div
                                    aria-hidden
                                    className="pointer-events-none absolute left-0 right-0 bottom-0 h-14 rounded-b-2xl opacity-25"
                                    style={{
                                        background: "linear-gradient(180deg, rgba(255,255,255,0), rgba(255,255,255,0.06))",
                                    }}
                                />

                                {/* animated subtle color wash for life */}
                                <div
                                    aria-hidden
                                    className="pointer-events-none absolute inset-0 rounded-2xl opacity-6"
                                    style={{
                                        background:
                                            "linear-gradient(90deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01) 30%, rgba(255,255,255,0.02))",
                                        mixBlendMode: "overlay",
                                    }}
                                />

                                {/* very subtle noise (SVG overlay) */}
                                <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none" aria-hidden>
                                    <filter id="grain-filter">
                                        <feTurbulence baseFrequency="0.8" numOctaves="2" stitchTiles="stitch" result="turb" />
                                        <feColorMatrix type="saturate" values="0" />
                                        <feBlend in="SourceGraphic" in2="turb" mode="overlay" />
                                    </filter>
                                    <rect width="100%" height="100%" fill="transparent" filter="url(#grain-filter)" opacity="0.02" />
                                </svg>

                                {/* subtle inner shadow to give depth */}
                                <div
                                    aria-hidden
                                    className="pointer-events-none absolute inset-0 rounded-2xl"
                                    style={{
                                        boxShadow: "inset 0 6px 30px rgba(0,0,0,0.18), inset 0 -6px 20px rgba(255,255,255,0.02)",
                                    }}
                                />
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LiveNow;
