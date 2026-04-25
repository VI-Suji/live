import React, { useState, useEffect } from "react";
import Image from "next/image";

export default function AdOne() {
    const [ads, setAds] = useState<any[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timestamp = new Date().getTime();
        fetch(`/api/sanity/advertisement?position=ad-one&t=${timestamp}`)
            .then((res) => res.json())
            .then((data) => {
                if (Array.isArray(data) && data.length > 0) {
                    setAds(data);
                }
            })
            .catch((err) => console.error('Ad-one fetch error:', err));
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
        <div className={`w-full relative rounded-3xl shadow-xl overflow-hidden aspect-video border border-gray-200 transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
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
                        className="w-full h-full object-cover"
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