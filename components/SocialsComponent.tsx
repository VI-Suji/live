"use client";

import React from "react";
import { FaFacebookF, FaInstagram, FaYoutube, FaWhatsapp, FaArrowRight } from "react-icons/fa";

const socialItems = [
  {
    id: 1,
    title: "YouTube",
    subtitle: "Subscribe for daily news & updates",
    icon: <FaYoutube className="text-3xl" />,
    link: "https://www.youtube.com/@GramikaTv",
    gradient: "from-red-500 to-red-600",
    hoverGlow: "group-hover:shadow-red-500/50",
  },
  {
    id: 2,
    title: "Facebook",
    subtitle: "Join our community discussion",
    icon: <FaFacebookF className="text-3xl" />,
    link: "https://www.facebook.com/GRAMIKATV/",
    gradient: "from-blue-500 to-blue-600",
    hoverGlow: "group-hover:shadow-blue-500/50",
  },
  {
    id: 3,
    title: "Instagram",
    subtitle: "Behind the scenes & stories",
    icon: <FaInstagram className="text-3xl" />,
    link: "https://www.instagram.com/gramikatv/reels/",
    gradient: "from-pink-500 to-purple-600",
    hoverGlow: "group-hover:shadow-pink-500/50",
  },
  {
    id: 4,
    title: "WhatsApp",
    subtitle: "Join our WhatsApp group",
    icon: <FaWhatsapp className="text-3xl" />,
    link: "https://chat.whatsapp.com/Hyue1YLgww0E3DYtgQK97J",
    gradient: "from-green-400 to-green-600",
    hoverGlow: "group-hover:shadow-green-500/50",
  },
];

export default function Socials() {
  return (
    <section id="socials" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
      <div className="text-center mb-12">
        <div className="inline-block mb-4">
          <span className="text-sm font-bold text-blue-600 uppercase tracking-wider bg-blue-50 px-4 py-2 rounded-full">
            Stay Connected
          </span>
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 tracking-tight mb-4">
          Connect With Us
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Follow us on social media for the latest updates and exclusive content
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {socialItems.map((item) => (
          <a
            key={item.id}
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className={`group relative bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:-translate-y-2 overflow-hidden ${item.hoverGlow}`}
          >
            {/* Gradient Background Effect */}
            <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>

            {/* Icon */}
            <div className={`relative w-16 h-16 rounded-2xl bg-gradient-to-br ${item.gradient} flex items-center justify-center text-white mb-6 shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6`}>
              {item.icon}
            </div>

            {/* Content */}
            <div className="relative">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {item.title}
              </h3>
              <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                {item.subtitle}
              </p>

              <div className="flex items-center gap-2 text-sm font-bold text-gray-400 group-hover:text-gray-900 transition-colors">
                Follow <FaArrowRight className="text-xs transition-transform group-hover:translate-x-1" />
              </div>
            </div>

            {/* Decorative Corner */}
            <div className="absolute top-0 right-0 w-20 h-20 bg-gray-50 rounded-bl-full -mr-4 -mt-4 opacity-50 group-hover:opacity-100 transition-opacity"></div>
          </a>
        ))}
      </div>
    </section>
  );
}
