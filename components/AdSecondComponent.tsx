import React, { useState, useEffect } from "react";
import Image from "next/image";

export default function AdTwo() {
    const [ad, setAd] = useState<any>(null);

    useEffect(() => {
        console.log('Fetching ad-two...');
        // Add timestamp to prevent caching
        const timestamp = new Date().getTime();
        fetch(`/api/sanity/advertisement?position=ad-two&t=${timestamp}`)
            .then((res) => {
                console.log('Ad-two response status:', res.status);
                if (res.status === 404) {
                    console.log('Ad-two not found (404)');
                    return null;
                }
                return res.json();
            })
            .then((data) => {
                console.log('Ad-two data:', data);
                // Only set ad if we have valid data (not null and not an error object)
                if (data && !data.error) {
                    setAd(data);
                }
            })
            .catch((err) => {
                console.error('Ad-two fetch error:', err);
            });
    }, []);

    if (!ad || !ad.active) {
        return (
            <div className="w-full relative rounded-3xl shadow-xl overflow-hidden aspect-video border border-gray-100">
                <Image
                    src="/gramika.png"
                    alt="Gramika"
                    fill
                    className="object-cover"
                />
            </div>
        );
    }

    return (
        <div className="w-full relative rounded-3xl shadow-xl overflow-hidden aspect-video border border-gray-100">
            {ad.video ? (
                <video
                    src={ad.video}
                    autoPlay
                    loop
                    muted
                    playsInline
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