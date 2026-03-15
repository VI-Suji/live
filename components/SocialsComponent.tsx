"use client";

import React from "react";
import { FaFacebookF, FaInstagram, FaYoutube, FaWhatsapp, FaArrowRight } from "react-icons/fa";

export const socialItems = [
  {
    id: 1,
    title: "YouTube",
    subtitle: "Subscribe for daily news updates",
    icon: <FaYoutube />,
    link: "https://www.youtube.com/@GramikaTv",
    gradient: "from-red-500 to-red-600",
    hoverGlow: "group-hover:shadow-red-500/50",
  },
  {
    id: 2,
    title: "Facebook",
    subtitle: "Join our community discussion",
    icon: <FaFacebookF />,
    link: "https://www.facebook.com/GRAMIKATV/",
    gradient: "from-blue-500 to-blue-600",
    hoverGlow: "group-hover:shadow-blue-500/50",
  },
  {
    id: 3,
    title: "Instagram",
    subtitle: "Behind the scenes & stories",
    icon: <FaInstagram />,
    link: "https://www.instagram.com/gramikatv/reels/",
    gradient: "from-pink-500 to-purple-600",
    hoverGlow: "group-hover:shadow-pink-500/50",
  },
  {
    id: 4,
    title: "WhatsApp",
    subtitle: "Join our WhatsApp group",
    icon: <FaWhatsapp />,
    link: "https://chat.whatsapp.com/Hyue1YLgww0E3DYtgQK97J",
    gradient: "from-green-400 to-green-600",
    hoverGlow: "group-hover:shadow-green-500/50",
  },
];

export default function Socials() {
  return (
    <section id="socials" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-20">
      <div className="text-center mb-12">
        <div className="inline-block mb-4">
          <span className="text-sm font-bold text-blue-600 uppercase tracking-wider bg-blue-50 px-4 py-2 rounded-full">
            Stay Connected
          </span>
        </div>
        <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-gray-900 tracking-tight mb-4">
          Connect With Us
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Follow us on social media for the latest updates and exclusive content
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        {socialItems.map((item) => (
          <a
            key={item.id}
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className={`group relative bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-sm hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:-translate-y-1 sm:hover:-translate-y-2 overflow-hidden flex flex-col items-center sm:items-start text-center sm:text-left ${item.hoverGlow}`}
          >
            {/* Gradient Background Effect */}
            <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>

            {/* Icon */}
            <div className={`relative flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br ${item.gradient} flex items-center justify-center text-white mb-3 sm:mb-6 shadow-md transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6`}>
              <div className="text-xl sm:text-3xl">
                {item.icon}
              </div>
            </div>

            {/* Content */}
            <div className="relative flex flex-col flex-1 w-full">
              <h3 className="text-sm sm:text-xl font-bold text-gray-900 mb-1 sm:mb-2">
                {item.title}
              </h3>
              <p className="text-gray-500 text-[10px] sm:text-sm mb-3 sm:mb-6 leading-relaxed flex-1">
                {item.subtitle}
              </p>

              <div className="flex items-center justify-center sm:justify-start gap-1.5 sm:gap-2 text-[10px] sm:text-sm font-bold text-gray-400 group-hover:text-gray-900 transition-colors mt-auto">
                <span className="hidden sm:inline">Follow</span> <FaArrowRight className="text-[10px] sm:text-xs transition-transform group-hover:translate-x-1" />
              </div>
            </div>

            {/* Decorative Corner */}
            <div className="absolute top-0 right-0 w-12 h-12 sm:w-20 sm:h-20 bg-gray-50 rounded-bl-full -mr-3 -mt-3 sm:-mr-4 sm:-mt-4 opacity-50 group-hover:opacity-100 transition-opacity"></div>
          </a>
        ))}
      </div>
    </section>
  );
}
