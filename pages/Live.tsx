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
            <style>{`
                @keyframes glass-shimmer {
                    0% { transform: translateX(-40%); opacity: 0.08; }
                    50% { transform: translateX(40%); opacity: 0.14; }
                    100% { transform: translateX(-40%); opacity: 0.08; }
                }
                @keyframes subtle-wash {
                    0% { transform: translateX(-10%); }
                    50% { transform: translateX(10%); }
                    100% { transform: translateX(-10%); }
                }
            `}</style>

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

                {/* Center: Live Video or Enhanced Liquid Glass Placeholder */}
                <div className="flex-1 w-full flex justify-center">
                    <div
                        className={`relative w-full ${isLive ? "max-w-4xl" : "max-w-[calc(100vw-24px)] sm:max-w-4xl"} aspect-video rounded-2xl overflow-hidden border shadow-xl transition-all duration-300 mx-auto
                            ${isLive ? "border-white/20 bg-black" : "border-white/10 bg-transparent"}`}
                        style={
                            isLive
                                ? undefined
                                : {
                                      WebkitBackdropFilter: "blur(20px) saturate(140%)",
                                      backdropFilter: "blur(20px) saturate(140%)",
                                      background:
                                          "linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.015))",
                                      boxShadow: "inset 0 8px 30px rgba(255,255,255,0.02), 0 8px 30px rgba(2,6,23,0.12)",
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
                            <div className="w-full h-full flex items-center justify-center text-gray-800 font-semibold text-lg z-10 relative">
                                <div className="max-w-lg text-center px-4">
                                    <div className="mb-3 text-2xl">No live stream right now</div>
                                    <div className="text-sm text-gray-600">
                                        We will automatically update when the channel goes live.
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Enhanced liquid glass layers when not live */}
                        {!isLive && (
                            <>
                                {/* heavy frosted layer */}
                                <div
                                    aria-hidden
                                    className="pointer-events-none absolute inset-0 rounded-2xl"
                                    style={{
                                        background:
                                            "linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))",
                                    }}
                                />

                                {/* moving shimmer wash */}
                                <div
                                    aria-hidden
                                    className="pointer-events-none absolute inset-0 rounded-2xl overflow-hidden"
                                    style={{
                                        mixBlendMode: "overlay",
                                    }}
                                >
                                    <div
                                        style={{
                                            position: "absolute",
                                            top: "-40%",
                                            left: "-40%",
                                            width: "180%",
                                            height: "180%",
                                            background:
                                                "linear-gradient(90deg, rgba(255,255,255,0.02), rgba(255,255,255,0.06) 20%, rgba(255,255,255,0.01) 60%, rgba(255,255,255,0.02))",
                                            transform: "translateZ(0)",
                                            animation: "glass-shimmer 4.8s linear infinite",
                                        }}
                                    />
                                    <div
                                        style={{
                                            position: "absolute",
                                            top: 0,
                                            left: "-20%",
                                            width: "140%",
                                            height: "100%",
                                            background:
                                                "linear-gradient(120deg, rgba(255,255,255,0.015), rgba(200,200,255,0.01), rgba(255,255,255,0.015))",
                                            opacity: 0.7,
                                            filter: "blur(20px)",
                                            transform: "translateZ(0)",
                                            animation: "subtle-wash 6s ease-in-out infinite",
                                        }}
                                    />
                                </div>

                                {/* glossy highlight (top-left) */}
                                <div
                                    aria-hidden
                                    className="pointer-events-none absolute -left-16 -top-12 w-80 h-40 rounded-full opacity-50 blur-3xl"
                                    style={{
                                        background:
                                            "radial-gradient(closest-side, rgba(255,255,255,0.32), rgba(255,255,255,0.02))",
                                        transform: "rotate(-12deg)",
                                    }}
                                />

                                {/* bottom soft reflection */}
                                <div
                                    aria-hidden
                                    className="pointer-events-none absolute left-0 right-0 bottom-0 h-16 rounded-b-2xl opacity-30"
                                    style={{
                                        background: "linear-gradient(180deg, rgba(255,255,255,0), rgba(255,255,255,0.06))",
                                    }}
                                />

                                {/* inner depth shadow */}
                                <div
                                    aria-hidden
                                    className="pointer-events-none absolute inset-0 rounded-2xl"
                                    style={{
                                        boxShadow: "inset 0 10px 40px rgba(0,0,0,0.22), inset 0 -6px 20px rgba(255,255,255,0.02)",
                                    }}
                                />

                                {/* subtle grain overlay */}
                                <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none" aria-hidden>
                                    <filter id="grain-filter-lg">
                                        <feTurbulence baseFrequency="0.6" numOctaves="2" stitchTiles="stitch" result="turb" />
                                        <feColorMatrix type="saturate" values="0" />
                                        <feBlend in="SourceGraphic" in2="turb" mode="overlay" />
                                    </filter>
                                    <rect width="100%" height="100%" fill="transparent" filter="url(#grain-filter-lg)" opacity="0.02" />
                                </svg>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LiveNow;
