"use client";

import React from "react";
import { FaFacebookF, FaInstagram, FaYoutube, FaWhatsapp } from "react-icons/fa";

const socialItems = [
  {
    id: 1,
    title: "YouTube",
    subtitle: "Watch our videos",
    icon: <FaYoutube className="text-4xl md:text-5xl" />,
    link: "#",
    size: "medium",
    color: "from-red-500 to-red-700",
  },
  {
    id: 2,
    title: "Facebook",
    subtitle: "Follow us for updates",
    icon: <FaFacebookF className="text-4xl md:text-5xl" />,
    link: "#",
    size: "large",
    color: "from-blue-400 to-blue-600",
  },
  {
    id: 3,
    title: "Whatsapp",
    subtitle: "Stay in the loop",
    icon: <FaWhatsapp className="text-4xl md:text-5xl" />,
    link: "#",
    size: "small",
    color: "from-green-400 to-green-400",
  },
  {
    id: 4,
    title: "Instagram",
    subtitle: "Explore our stories",
    icon: <FaInstagram className="text-4xl md:text-5xl" />,
    link: "#",
    size: "small",
    color: "from-pink-400 to-pink-600",
  },
  
];

export default function Socials() {
  return (
    <section className="w-11/12 md:w-5/6 mx-auto p-10 mt-16 grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-3">
      {socialItems.map((item) => {
        let gridClass = `relative rounded-3xl overflow-hidden shadow-lg cursor-pointer group flex items-center justify-center text-white 
                        bg-gradient-to-br ${item.color} bg-opacity-40 backdrop-blur-lg border border-white/20`;

        if (item.size === "large") {
          gridClass += " md:col-span-2 md:row-span-2";
        } else if (item.size === "medium") {
          gridClass += " md:col-span-2 md:row-span-1";
        } else {
          gridClass += " md:col-span-1 md:row-span-1";
        }

        return (
          <a
            key={item.id}
            href={item.link}
            className={gridClass}
            aria-label={item.title}
          >
            <div className="relative z-10 flex flex-col items-center justify-center p-6 text-center transition-transform duration-300 group-hover:scale-105">
              {item.icon}
              <h3 className="mt-4 text-2xl md:text-3xl font-extrabold">{item.title}</h3>
              <p className="mt-2 text-sm md:text-base font-medium">{item.subtitle}</p>
            </div>

            {/* Overlay hover effect */}
            <div className="absolute inset-0 rounded-3xl bg-white/10 group-hover:bg-white/20 transition-all duration-300"></div>
          </a>
        );
      })}
    </section>
  );
}
