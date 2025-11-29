import React, { useState, useEffect } from "react";
import Image from "next/image";

export default function BannerAd() {
    const [ad, setAd] = useState<any>(null);

    useEffect(() => {
        console.log('Fetching banner ad...');
        // Add timestamp to prevent caching
        const timestamp = new Date().getTime();
        fetch(`/api/sanity/advertisement?position=banner&t=${timestamp}`)
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
            {ad.video ? (
                <div className="relative w-full aspect-video sm:aspect-[21/9]">
                    <video
                        src={ad.video}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                </div>
            ) : ad.image ? (
                <div className="relative w-full aspect-video sm:aspect-[21/9]">
                    <Image
                        src={ad.image}
                        alt={ad.title}
                        fill
                        className="object-cover"
                    />
                </div>
            ) : null}
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
