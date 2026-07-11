"use client";

import React from "react";
import { socialItems } from "./SocialsComponent";
import LiveNow from "./LiveComponent";
import { FaArrowRight } from "react-icons/fa";
import { motion } from "framer-motion";

interface Props {
    onReadMore: () => void;
    showLive: boolean;
}

const Hero: React.FC<Props> = ({ onReadMore, showLive }) => {
    const [heroData, setHeroData] = React.useState({
        greeting: "GRAMIKA NEWS ONLINE",
        tagline: "ഗ്രാമിക — ഗ്രാമീണതയുടെ ഹൃദയതാളം."
    });

    React.useEffect(() => {
        const fetchHeroData = async () => {
            try {
                const res = await fetch('/api/sanity/heroContent');
                if (res.ok) {
                    const data = await res.json();
                    if (data && !data.error) {
                        setHeroData({
                            greeting: data.greeting || "GRAMIKA NEWS ONLINE",
                            tagline: data.tagline || "ഗ്രാമിക — ഗ്രാമീണതയുടെ ഹൃദയതാളം."
                        });
                    }
                }
            } catch (error) {
                console.error("Error fetching hero content:", error);
            }
        };

        fetchHeroData();
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="surface-elevated w-full overflow-hidden"
        >
            <div className="flex flex-col lg:flex-row">
                {/* Main content */}
                <div className={`flex-1 p-6 sm:p-10 lg:p-12 flex flex-col gap-8 justify-center ${!showLive ? 'lg:pr-8' : ''}`}>
                    <div className="space-y-4 max-w-2xl">
                        <h1 className="text-display text-3xl sm:text-5xl lg:text-6xl leading-[1.05] tracking-tight text-[var(--text-primary)]">
                            {heroData.greeting}
                        </h1>
                        {!showLive && (
                            <p className="text-body text-base sm:text-lg max-w-lg">
                                {heroData.tagline}
                            </p>
                        )}
                    </div>

                    {/* Mobile socials */}
                    <div className="flex lg:hidden flex-row flex-wrap gap-3">
                        {socialItems.map((social) => (
                            <a
                                key={social.id}
                                href={social.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group w-10 h-10 rounded-lg flex items-center justify-center text-white transition-transform duration-200 hover:scale-105"
                                style={{ background: social.color }}
                                aria-label={social.title}
                            >
                                <span className="text-base">{social.icon}</span>
                            </a>
                        ))}
                    </div>

                    {showLive ? (
                        <div className="w-full max-w-2xl">
                            <div className="relative rounded-xl overflow-hidden border border-[var(--border-subtle)] aspect-video bg-zinc-900 group">
                                <LiveNow channelId="UCgkLuDaFGUrfljjp7cNtQcw" />
                                <div className="absolute top-4 left-4 z-30 flex items-center gap-2 bg-red-600/90 backdrop-blur-sm px-3 py-1.5 rounded-full">
                                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                                    <span className="text-[10px] font-semibold text-white uppercase tracking-widest font-[family-name:var(--font-display)]">Live</span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <button onClick={onReadMore} className="btn-primary w-full sm:w-auto">
                            View Stories
                            <FaArrowRight className="text-xs opacity-70 group-hover:translate-x-0.5 transition-transform" />
                        </button>
                    )}
                </div>

                {/* Desktop social sidebar */}
                <div className="hidden lg:flex lg:w-72 flex-col justify-center gap-1 p-8 border-l border-[var(--border-subtle)] bg-[var(--bg-muted)]/50">
                    {socialItems.map((social) => (
                        <a
                            key={social.id}
                            href={social.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex items-center gap-3 p-3 rounded-lg hover:bg-[var(--bg-surface)] transition-all duration-200"
                        >
                            <div
                                className="w-9 h-9 rounded-lg flex items-center justify-center text-white flex-shrink-0 transition-transform duration-200 group-hover:scale-105"
                                style={{ background: social.color }}
                            >
                                <span className="text-sm">{social.icon}</span>
                            </div>
                            <div className="min-w-0">
                                <h4 className="font-[family-name:var(--font-display)] font-medium text-sm text-[var(--text-primary)]">{social.title}</h4>
                                <p className="text-xs text-[var(--text-tertiary)] truncate">{social.subtitle}</p>
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};

export default Hero;
