"use client";

import React from "react";
import { FaFacebookF, FaInstagram, FaYoutube, FaWhatsapp, FaArrowRight } from "react-icons/fa";

const socialItems = [
  {
    id: 1,
    title: "YouTube",
    subtitle: "Subscribe for daily news & updates",
    icon: <FaYoutube className="text-4xl" />,
    link: "https://www.youtube.com/@GramikaTv",
    color: "bg-red-600",
    hoverColor: "group-hover:text-red-600",
  },
  {
    id: 2,
    title: "Facebook",
    subtitle: "Join our community discussion",
    icon: <FaFacebookF className="text-4xl" />,
    link: "https://www.facebook.com/GRAMIKATV/",
    color: "bg-blue-600",
    hoverColor: "group-hover:text-blue-600",
  },
  {
    id: 3,
    title: "Instagram",
    subtitle: "Behind the scenes & stories",
    icon: <FaInstagram className="text-4xl" />,
    link: "https://www.instagram.com/gramikatv/reels/",
    color: "bg-pink-600",
    hoverColor: "group-hover:text-pink-600",
  },
  {
    id: 4,
    title: "WhatsApp",
    subtitle: "Get instant news alerts",
    icon: <FaWhatsapp className="text-4xl" />,
    link: "#",
    color: "bg-green-500",
    hoverColor: "group-hover:text-green-500",
  },
];

export default function Socials() {
  return (
    <section id="socials" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
      <div className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight mb-4">
          Connect Us
        </h2>
        {/* <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          ഏറ്റവും പുതിയ വാർത്തകൾ, എക്സ്ക്ലൂസീവ് ഉള്ളടക്കം, കമ്മ്യൂണിറ്റി സ്റ്റോറികൾ എന്നിവയുമായി അപ്ഡേറ്റ് ചെയ്യാൻ സോഷ്യൽ മീഡിയയിൽ ഗ്രാമിക പിന്തുടരുക.
        </p> */}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {socialItems.map((item) => (
          <a
            key={item.id}
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:-translate-y-1 overflow-hidden"
          >
            <div className={`absolute top-0 right-0 w-24 h-24 bg-gray-50 rounded-bl-full -mr-4 -mt-4 transition-colors duration-300 ${item.hoverColor.replace('text', 'bg').replace('group-hover:', 'group-hover:').replace('text', 'bg') + '/10'}`}></div>

            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white mb-6 shadow-md transition-transform duration-300 group-hover:scale-110 ${item.color}`}>
              {item.icon}
            </div>

            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-gray-900">
              {item.title}
            </h3>
            <p className="text-gray-500 text-sm mb-6 leading-relaxed">
              {item.subtitle}
            </p>

            <div className={`flex items-center gap-2 text-sm font-bold ${item.hoverColor} text-gray-400 transition-colors`}>
              Follow <FaArrowRight className="text-xs transition-transform group-hover:translate-x-1" />
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
