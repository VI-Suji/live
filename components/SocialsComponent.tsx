"use client";

import React from "react";
import { FaFacebookF, FaInstagram, FaYoutube, FaWhatsapp, FaArrowRight } from "react-icons/fa";

export const socialItems = [
  {
    id: 1,
    title: "YouTube",
    subtitle: "Daily news updates",
    icon: <FaYoutube />,
    link: "https://www.youtube.com/@GramikaTv",
    color: "#FF0000",
    gradient: "from-red-500 to-red-600",
    hoverGlow: "group-hover:shadow-red-500/20",
  },
  {
    id: 2,
    title: "Facebook",
    subtitle: "Community discussions",
    icon: <FaFacebookF />,
    link: "https://www.facebook.com/GRAMIKATV/",
    color: "#1877F2",
    gradient: "from-blue-500 to-blue-600",
    hoverGlow: "group-hover:shadow-blue-500/20",
  },
  {
    id: 3,
    title: "Instagram",
    subtitle: "Behind the scenes",
    icon: <FaInstagram />,
    link: "https://www.instagram.com/gramikatv/reels/",
    color: "#E4405F",
    gradient: "from-pink-500 to-purple-600",
    hoverGlow: "group-hover:shadow-pink-500/20",
  },
  {
    id: 4,
    title: "WhatsApp",
    subtitle: "Join our group",
    icon: <FaWhatsapp />,
    link: "https://chat.whatsapp.com/Hyue1YLgww0E3DYtgQK97J",
    color: "#25D366",
    gradient: "from-green-400 to-green-600",
    hoverGlow: "group-hover:shadow-green-500/20",
  },
];

export default function Socials() {
  return (
    <section className="w-full">
      <div className="text-center mb-10 sm:mb-14">
        <h2 className="text-display text-2xl sm:text-4xl mt-2 mb-3">
          Connect With Us
        </h2>
        <p className="text-body text-sm sm:text-base max-w-xl mx-auto">
          Follow us for the latest updates, exclusive content, and community stories
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {socialItems.map((item) => (
          <a
            key={item.id}
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className={`group surface-card surface-card-interactive p-5 sm:p-7 flex flex-col items-center sm:items-start text-center sm:text-left ${item.hoverGlow}`}
          >
            <div
              className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center text-white mb-4 transition-transform duration-300 group-hover:scale-105"
              style={{ background: item.color }}
            >
              <span className="text-lg sm:text-xl">{item.icon}</span>
            </div>

            <h3 className="font-[family-name:var(--font-display)] font-medium text-sm sm:text-base text-[var(--text-primary)] mb-1">
              {item.title}
            </h3>
            <p className="text-xs sm:text-sm text-[var(--text-tertiary)] mb-4 flex-1 leading-relaxed">
              {item.subtitle}
            </p>

            <div className="flex items-center gap-1.5 text-xs font-[family-name:var(--font-display)] font-medium text-[var(--text-tertiary)] group-hover:text-[var(--accent)] transition-colors mt-auto">
              <span className="hidden sm:inline">Follow</span>
              <FaArrowRight className="text-[10px] transition-transform group-hover:translate-x-0.5" />
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
