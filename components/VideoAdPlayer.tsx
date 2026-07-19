"use client";

import React, { useEffect, useRef, useState } from "react";
import { FaVolumeMute, FaVolumeUp } from "react-icons/fa";

type VideoAdPlayerProps = {
  src: string;
  poster?: string;
  className?: string;
  videoKey?: string;
  link?: string;
  title?: string;
};

export default function VideoAdPlayer({
  src,
  poster = "",
  className = "w-full h-full object-cover",
  videoKey,
  link,
  title = "advertisement",
}: VideoAdPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    // Autoplay requires muted start in most browsers.
    setMuted(true);
    const video = videoRef.current;
    if (!video) return;
    video.muted = true;
    void video.play().catch(() => {});
  }, [src, videoKey]);

  const toggleMute = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const video = videoRef.current;
    if (!video) return;

    const nextMuted = !muted;
    video.muted = nextMuted;
    setMuted(nextMuted);

    if (!nextMuted) {
      void video.play().catch(() => {});
    }
  };

  return (
    <div className="relative w-full h-full">
      <video
        ref={videoRef}
        key={videoKey || src}
        src={src}
        poster={poster}
        autoPlay
        loop
        muted={muted}
        playsInline
        preload="auto"
        className={className}
      />

      {link && (
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute inset-0 z-10"
        >
          <span className="sr-only">Visit {title}</span>
        </a>
      )}

      <button
        type="button"
        onClick={toggleMute}
        className="absolute bottom-3 right-3 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-white/25 bg-black/55 text-white shadow-sm backdrop-blur-sm transition hover:bg-black/70"
        aria-label={muted ? "Unmute video ad" : "Mute video ad"}
        title={muted ? "Unmute" : "Mute"}
      >
        {muted ? <FaVolumeMute size={14} /> : <FaVolumeUp size={14} />}
      </button>
    </div>
  );
}
