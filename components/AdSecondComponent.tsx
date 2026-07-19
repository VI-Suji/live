import React, { useState, useEffect } from "react";
import Image from "next/image";
import VideoAdPlayer from "./VideoAdPlayer";

export default function AdTwo() {
    const [ad, setAd] = useState<any>(null);

    useEffect(() => {
        const timestamp = new Date().getTime();
        fetch(`/api/sanity/advertisement?position=ad-two&t=${timestamp}`)
            .then((res) => {
                if (res.status === 404) return null;
                return res.json();
            })
            .then((data) => {
                if (data && !data.error) {
                    setAd(data);
                }
            })
            .catch((err) => {
                console.error('Ad-two fetch error:', err);
            });
    }, []);

    if (!ad || !ad.active) {
        return null;
    }

    const hasVideo = !!(ad.videoUrl || ad.video);

    return (
        <div className="w-full relative rounded-3xl shadow-[var(--shadow-md)] overflow-hidden aspect-video border border-[var(--border-default)]">
            <div className="w-full h-full bg-[var(--bg-muted)] flex items-center justify-center">
                {hasVideo ? (
                    <VideoAdPlayer
                        src={ad.videoUrl || ad.video}
                        poster={ad.image || ""}
                        link={ad.link}
                        title={ad.title}
                    />
                ) : ad.image ? (
                    <div className="relative w-full h-full">
                        <Image
                            src={ad.image}
                            alt={ad.title}
                            fill
                            className="object-cover"
                        />
                    </div>
                ) : null}
            </div>
            {!hasVideo && ad.link && (
                <a
                    href={ad.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute inset-0 z-10"
                >
                    <span className="sr-only">Visit {ad.title}</span>
                </a>
            )}
        </div>
    );
}
