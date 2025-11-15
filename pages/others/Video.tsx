"use client";

import React, { useState } from "react";

type VideoPlayerProps = {
  src: string;
  title?: string;
};

export default function VideoPlayer({ src, title = "Local Video" }: VideoPlayerProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="sm:w-5/6 w-full mx-auto">
      <div className="flex flex-col md:flex-row md:items-center gap-4 w-full">
        {/* Icon */}
        <div
          aria-hidden
          className="hidden md:flex flex-shrink-0 rounded-lg grid place-items-center
                     bg-gradient-to-br from-blue-400 to-purple-500 hover:from-blue-500 hover:to-purple-600 shadow-md"
        >
          <svg
            width="36"
            height="36"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="block"
          >
            <circle cx="12" cy="12" r="3.2" fill="#fff" />
            <path
              d="M4 12c0-4.418 3.582-8 8-8"
              stroke="rgba(255,255,255,0.6)"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M20 12c0 4.418-3.582 8-8 8"
              stroke="rgba(255,255,255,0.6)"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* Video */}
        <div className="relative w-full md:flex-1 rounded-xl overflow-hidden aspect-video shadow-2xl no-underline max-w-full">
          {/* fallback background */}
          <div
            aria-hidden
            className={`absolute inset-0 bg-cover bg-center transition-all duration-300 ${
              loaded ? "filter-none" : "blur-md saturate-105"
            }`}
            style={{
              backgroundImage:
                "linear-gradient(135deg, rgba(15,23,42,1) 0%, rgba(7,16,40,1) 100%)",
            }}
          />

          {/* HTML5 video element */}
          <video
            src={src}
            title={title}
            controls
            onCanPlay={() => setLoaded(true)}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
              loaded ? "opacity-100" : "opacity-100"
            }`}
          />

          {/* subtle overlay */}
          <div className="absolute inset-0 rounded-xl pointer-events-none"
               style={{
                 boxShadow:
                   "inset 0 1px 0 rgba(255,255,255,0.02), inset 0 -1px 8px rgba(0,0,0,0.06)",
               }}
          />
        </div>
      </div>
    </div>
  );
}
