import React, { useState, useEffect } from "react";
import Image from "next/image";

export default function BannerAd() {
    const [ads, setAds] = useState<any[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        fetch(`/api/sanity/advertisement?position=banner&t=${Date.now()}`)
            .then((res) => res.json())
            .then((data) => {
                if (Array.isArray(data) && data.length > 0) {
                    setAds(data);
                }
            })
            .catch((err) => console.error('Banner ad fetch error:', err));
    }, []);

    useEffect(() => {
        if (ads.length <= 1) return;

        const interval = setInterval(() => {
            setIsVisible(false);
            setTimeout(() => {
                setCurrentIndex((prev) => (prev + 1) % ads.length);
                setIsVisible(true);
            }, 500); // Wait for fade out
        }, 60000); // 1 minute

        return () => clearInterval(interval);
    }, [ads]);

    if (ads.length === 0) return null;

    const ad = ads[currentIndex];

    return (
        <div className={`w-full relative rounded-2xl shadow-lg overflow-hidden border border-gray-200 bg-white transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            <div className="relative w-full aspect-video sm:aspect-[21/9] bg-gray-100 flex items-center justify-center">
                {(ad.videoUrl || ad.video) ? (
                    <video
                        key={ad._id} // Key ensures video reloads/plays when ad changes
                        src={ad.videoUrl || ad.video}
                        poster={ad.image || ""}
                        autoPlay
                        loop
                        muted
                        playsInline
                        preload="auto"
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                ) : ad.image ? (
                    <Image
                        src={ad.image}
                        alt={ad.title}
                        fill
                        className="object-cover"
                    />
                ) : null}
            </div>
            {ad.link && (
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
