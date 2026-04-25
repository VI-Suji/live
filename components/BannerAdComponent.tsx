import React, { useState, useEffect } from "react";
import Image from "next/image";

export default function BannerAd() {
    const [ad, setAd] = useState<any>(null);

    useEffect(() => {
        console.log('Fetching banner ad...');
        // Add timestamp to prevent caching
        fetch(`/api/sanity/advertisement?position=banner`)
            .then((res) => {
                console.log('Banner ad response status:', res.status);
                if (res.status === 404) {
                    console.log('Banner ad not found (404)');
                    return null;
                }
                return res.json();
            })
            .then((data) => {
                console.log('Banner ad data:', data);
                // Only set ad if we have valid data (not null and not an error object)
                if (data && !data.error) {
                    setAd(data);
                }
            })
            .catch((err) => {
                console.error('Banner ad fetch error:', err);
            });
    }, []);

    if (!ad || !ad.active) {
        return null; // Don't show anything if no banner ad is active
    }

    return (
        <div className="w-full relative rounded-2xl shadow-lg overflow-hidden border border-gray-200 bg-white">
            <div className="relative w-full aspect-video sm:aspect-[21/9] bg-gray-100 flex items-center justify-center">
                {ad.video ? (
                    <video
                        src={ad.video}
                        poster={ad.image || ""}
                        autoPlay
                        loop
                        muted
                        playsInline
                        preload="auto"
                        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
                        onLoadedData={(e) => (e.currentTarget.style.opacity = "1")}
                        style={{ opacity: ad.image ? 1 : 0 }}
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
