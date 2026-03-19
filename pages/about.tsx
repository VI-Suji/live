"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { FaPhone } from "react-icons/fa";
import Header from "../components/HeaderComponent";
import Footer from "../components/FooterComponent";

interface Person {
  name: string;
  designation: string;
  area: string;
  showArea?: boolean;
  phone: string;
  image: string;
}

interface AboutData {
  description?: string;
  md: Person;
  executiveDirectors: Person[];
  directors: Person[];
}

const AboutUsPage: React.FC = () => {
  const [data, setData] = useState<AboutData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/sanity/aboutUs")
      .then((res) => res.json())
      .then((data) => {
        if (!data.error) setData(data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const renderMdCard = (person: Person) => (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden rounded-3xl shadow-2xl max-w-4xl mx-auto border border-slate-200 bg-gradient-to-br from-white via-slate-50 to-blue-50/30"
    >
      <div className="flex flex-col sm:flex-row">
        {/* Photo Section */}
        <div className="relative h-64 sm:h-auto sm:w-[28%] shrink-0 flex items-center justify-center p-6 sm:p-8 bg-slate-100/50 border-r border-slate-100">
          <div className="relative w-40 h-40 sm:w-48 sm:h-48 group/img">
            {/* Soft shadow ring */}
            <div className="absolute -inset-2 bg-blue-100/40 rounded-full blur-xl opacity-0 group-hover/img:opacity-100 transition-opacity" />
            
            <div className="relative w-full h-full rounded-full border-4 border-white shadow-2xl overflow-hidden ring-1 ring-slate-200">
              {person.image ? (
                <Image
                  src={person.image}
                  alt={person.name}
                  fill
                  className="object-cover object-top transition-transform duration-700 group-hover:scale-110"
                  priority
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center">
                  <span className="text-slate-400 font-black text-7xl uppercase">{person.name?.[0] || "?"}</span>
                </div>
              )}
            </div>
          </div>
        </div>
 
        {/* Content */}
        <div className="p-6 sm:p-12 flex flex-col justify-center flex-1 relative z-10">
          {/* Decorative glow */}
          <div className="absolute -top-20 -right-20 w-60 h-60 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
 
          {/* Name */}
          <div className="mb-5">
            <h3 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 leading-tight uppercase tracking-tight">{person.name}</h3>
          </div>
 
          {/* Area badge */}
          {person.area && person.showArea !== false && (
            <div className="mb-6">
              <span className="inline-block bg-blue-600/5 border border-blue-600/10 text-[13px] font-black px-5 py-2 rounded-full uppercase tracking-wider text-blue-600 shadow-sm">
                {person.area}
              </span>
            </div>
          )}
 
          {/* Divider */}
          <div className="w-12 h-1 bg-blue-600 rounded-full mb-6 hidden sm:block" />
 
          <div>
            <a
              href={`tel:${person.phone}`}
              className="inline-flex items-center gap-2.5 text-2xl sm:text-3xl font-black text-slate-900 hover:text-blue-600 transition-colors"
            >
              <div className="w-10 h-10 bg-blue-50 border border-blue-100 rounded-full flex items-center justify-center shrink-0 shadow-sm group-hover:rotate-12 transition-transform">
                <FaPhone size={16} className="text-blue-600" />
              </div>
              {person.phone}
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const renderPersonCard = (person: Person, variant: 'ed' | 'dir') => {
    const theme = variant === 'ed'
      ? {
        accent: 'indigo',
        bg: 'from-slate-50 via-white to-white',
        border: 'border-indigo-100/80',
        shadow: 'hover:shadow-indigo-500/10',
        glow: 'bg-indigo-500/5',
        placeholder: 'from-indigo-50 to-blue-50',
        placeholderText: 'text-indigo-200',
        name: 'text-slate-900',
        area: 'text-indigo-600',
        areaBg: 'bg-indigo-50/50',
        divider: 'border-indigo-50',
        phone: 'text-black',
        phoneBg: 'bg-black-500/10 border-black-500/20',
        phoneIcon: 'text-black-600',
      }
      : {
        accent: 'rose',
        bg: 'from-slate-50 via-white to-white',
        border: 'border-rose-100/80',
        shadow: 'hover:shadow-rose-500/10',
        glow: 'bg-rose-500/5',
        placeholder: 'from-rose-50 to-pink-50',
        placeholderText: 'text-rose-200',
        name: 'text-slate-900',
        area: 'text-rose-600',
        areaBg: 'bg-rose-50/50',
        divider: 'border-rose-50',
        phone: 'text-black',
        phoneBg: 'bg-black-500/10 border-black-500/20',
        phoneIcon: 'text-black-600',
      };

    return (
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className={`relative overflow-hidden rounded-3xl border ${theme.border} bg-gradient-to-br ${theme.bg} flex flex-row sm:flex-col group hover:shadow-2xl ${theme.shadow} hover:-translate-y-1 transition-all duration-500 shadow-sm`}
      >
        {/* Top accent line */}
        <div className={`absolute top-0 left-0 right-0 h-1 bg-${theme.accent}-500/20 opacity-0 group-hover:opacity-100 transition-opacity`} />

        {/* Decorative background glow */}
        <div className={`absolute -bottom-10 -right-10 w-40 h-40 ${theme.glow} rounded-full blur-3xl pointer-events-none`} />

        {/* Photo Header */}
        <div className={`relative h-40 sm:h-48 shrink-0 flex items-center justify-center bg-gradient-to-br ${theme.placeholder} overflow-hidden`}>
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-black/20 via-transparent to-transparent" />
          
          <div className="relative w-28 h-28 sm:w-32 sm:h-32 group/img">
            {/* Soft shadow ring */}
            <div className="absolute -inset-1 bg-black/5 rounded-full blur-sm" />
            
            <div className={`relative w-full h-full rounded-full border-4 border-white shadow-xl overflow-hidden`}>
              {person.image ? (
                <Image
                  src={person.image}
                  alt={person.name}
                  fill
                  className="object-cover object-top transition-transform duration-700 group-hover:scale-110"
                />
              ) : (
                <div className={`w-full h-full bg-gradient-to-br ${theme.placeholder} flex items-center justify-center`}>
                  <span className={`font-black text-5xl uppercase ${theme.placeholderText}`}>{person.name?.[0] || "?"}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 flex-1 flex flex-col gap-3 justify-center min-w-0 relative z-10">
          <div className="space-y-1.5">
            <h3 className={`text-base sm:text-xl font-black ${theme.name} leading-tight uppercase tracking-tight line-clamp-2 transition-colors group-hover:text-${theme.accent}-600`}>
              {person.name}
            </h3>
            {person.area && person.showArea !== false && (
              <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-black ${theme.area} ${theme.areaBg} backdrop-blur-sm border ${theme.border} border-opacity-30 uppercase tracking-widest`}>
                {person.area}
              </span>
            )}
          </div>

          <div className={`mt-auto pt-4 border-t ${theme.divider}`}>
            <a
              href={`tel:${person.phone}`}
              className={`flex items-center gap-3 font-black text-sm ${theme.phone} transition-all group/link`}
            >
              <div className={`w-8 h-8 sm:w-10 sm:h-10 ${theme.phoneBg} border rounded-2xl flex items-center justify-center shrink-0 transition-all group-hover:rounded-xl group-hover:rotate-12`}>
                <FaPhone size={12} className={theme.phoneIcon} />
              </div>
              <span className="truncate tracking-tight">{person.phone}</span>
            </a>
          </div>
        </div>
      </motion.div>
    );
  };

  const SectionHeading = ({ label, color }: { label: string; color: string }) => (
    <div className="flex items-center gap-4 mb-6 sm:mb-10">
      <div className={`h-8 sm:h-10 w-1 sm:w-1.5 rounded-full ${color}`} />
      <h2 className="text-xl sm:text-3xl font-black text-slate-900 tracking-tight">{label}</h2>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin" />
          <p className="font-black text-[10px] text-slate-400 uppercase tracking-widest">Loading Team...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      {/* Hero banner */}
      <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 px-4 py-12 sm:py-20 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-800/20 via-transparent to-transparent pointer-events-none" />
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <span className="inline-block text-[11px] font-black text-blue-400 uppercase tracking-[0.3em] bg-blue-500/10 border border-blue-500/20 px-4 py-2 rounded-full mb-5">
            Leadership Team
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-white mb-4 tracking-tighter">About Us</h1>
          <div className="h-1 w-16 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto rounded-full mb-6" />
          {data?.description && (
            <div className="max-w-4xl mx-auto mt-8 relative">
              <div className="absolute inset-0 bg-blue-500/5 blur-3xl pointer-events-none" />
              <p className="text-lg sm:text-xl text-slate-300 font-medium leading-[1.8] whitespace-pre-line relative z-10 drop-shadow-md">
                {data.description}
              </p>
            </div>
          )}
        </motion.div>
      </div>

      <div className="py-10 sm:py-16 px-4">
        <div className="max-w-7xl mx-auto space-y-14 sm:space-y-24">

          {/* Managing Director */}
          {data?.md?.name && (
            <section>
              <SectionHeading label="Managing Director" color="bg-blue-600" />
              {renderMdCard(data.md)}
            </section>
          )}

          {/* Executive Directors */}
          {data?.executiveDirectors && data.executiveDirectors.length > 0 && (
            <section>
              <SectionHeading label="Executive Directors" color="bg-indigo-500" />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
                {data.executiveDirectors.map((person, idx) => (
                  <div key={idx}>{renderPersonCard(person, "ed")}</div>
                ))}
              </div>
            </section>
          )}

          {/* Directors */}
          {data?.directors && data.directors.length > 0 && (
            <section>
              <SectionHeading label="Directors" color="bg-violet-500" />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
                {data.directors.map((person, idx) => (
                  <div key={idx}>{renderPersonCard(person, "dir")}</div>
                ))}
              </div>
            </section>
          )}

        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AboutUsPage;
