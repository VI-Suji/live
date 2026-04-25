import React, { useState, useEffect } from "react";
import Image from "next/image";

export default function AdOne() {
    const [ad, setAd] = useState<any>(null);

    useEffect(() => {
        console.log('Fetching ad-one...');
        // Add timestamp to prevent caching
        const timestamp = new Date().getTime();
        fetch(`/api/sanity/advertisement?position=ad-one&t=${timestamp}`)
            .then((res) => {
                console.log('Ad-one response status:', res.status);
                if (res.status === 404) {
                    console.log('Ad-one not found (404)');
                    return null;
                }
                return res.json();
            })
            .then((data) => {
                console.log('Ad-one data:', data);
                // Only set ad if we have valid data (not null and not an error object)
                if (data && !data.error) {
                    setAd(data);
                }
            })
            .catch((err) => {
                console.error('Ad-one fetch error:', err);
            });
    }, []);

    if (!ad || !ad.active) {
        return null; // Hide if no ad is active
    }

    return (
        <div className="w-full relative rounded-3xl shadow-xl overflow-hidden aspect-video border border-gray-200">
            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                {(ad.videoUrl || ad.video) ? (
                    <video
                        src={ad.videoUrl || ad.video}
                        poster={ad.image || ""}
                        autoPlay
                        loop
                        muted
                        playsInline
                        preload="auto"
                        className="w-full h-full object-cover transition-opacity duration-500"
                        onLoadedData={(e) => (e.currentTarget.style.opacity = "1")}
                        style={{ opacity: ad.image ? 1 : 0 }}
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