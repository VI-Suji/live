"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { FaPhone, FaUsers, FaMapMarkerAlt } from "react-icons/fa";
import Header from "../components/HeaderComponent";
import Footer from "../components/FooterComponent";
import Meta from "../components/Meta";

interface Person {
  name: string;
  designation: string;
  area: string;
  showArea?: boolean;
  phone: string;
  image: string;
}

interface Operator {
  name: string;
  places: string;
  phone: string;
}

interface AboutData {
  description?: string;
  md: Person;
  executiveDirectors: Person[];
  directors: Person[];
  operators: Operator[];
}

const AboutUsPage: React.FC = () => {
  const [data, setData] = useState<AboutData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'operators' | 'leadership'>('operators');
  const [selectedPlace, setSelectedPlace] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");

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
        <div className="relative h-64 sm:h-auto sm:w-[28%] shrink-0 flex items-center justify-center p-6 sm:p-8 bg-slate-100/50 border-r border-slate-100">
          <div className="relative w-40 h-40 sm:w-48 sm:h-48 group/img">
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
        <div className="p-6 sm:p-12 flex flex-col justify-center flex-1 relative z-10">
          <div className="absolute -top-20 -right-20 w-60 h-60 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="mb-5">
            <h3 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 leading-tight uppercase tracking-tight">{person.name}</h3>
          </div>
          {person.area && person.showArea !== false && (
            <div className="mb-6">
              <span className="inline-block bg-blue-600/5 border border-blue-600/10 text-[13px] font-black px-5 py-2 rounded-full uppercase tracking-wider text-blue-600 shadow-sm">
                {person.area}
              </span>
            </div>
          )}
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
        <div className={`absolute top-0 left-0 right-0 h-1 bg-${theme.accent}-500/20 opacity-0 group-hover:opacity-100 transition-opacity`} />
        <div className={`absolute -bottom-10 -right-10 w-40 h-40 ${theme.glow} rounded-full blur-3xl pointer-events-none`} />
        <div className={`relative h-40 sm:h-48 shrink-0 flex items-center justify-center bg-gradient-to-br ${theme.placeholder} overflow-hidden`}>
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-black/20 via-transparent to-transparent" />
          <div className="relative w-28 h-28 sm:w-32 sm:h-32 group/img">
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

  const getUniquePlaces = () => {
    if (!data?.operators) return [];
    const placesSet = new Set<string>();
    data.operators.forEach(op => {
      if (op.places) {
        op.places.split(',').forEach(p => {
          const trimmed = p.trim().toUpperCase();
          if (trimmed) placesSet.add(trimmed);
        });
      }
    });
    return Array.from(placesSet).sort();
  };

  const filteredOperators = data?.operators?.filter(op => {
    const matchesPlace = !selectedPlace || (op.places || "").toUpperCase().includes(selectedPlace.toUpperCase());
    const matchesSearch = !searchQuery ||
      op.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (op.places || "").toLowerCase().includes(searchQuery.toLowerCase());
    return matchesPlace && matchesSearch;
  }) || [];

  const SectionHeading = ({ label, color }: { label: string; color: string }) => (
    <div className="flex items-center gap-4 mb-6 sm:mb-10">
      <div className={`h-8 sm:h-10 w-1 sm:w-1.5 rounded-full ${color}`} />
      <h2 className="text-xl sm:text-3xl font-black text-slate-900 tracking-tight leading-none">{label}</h2>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-emerald-600/20 border-t-emerald-600 rounded-full animate-spin" />
          <p className="font-black text-[10px] text-slate-400 uppercase tracking-widest">Loading Details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <Meta
        title={`About Gramika | Gramika News`}
        description={data?.description || `About the team behind Gramika News.`}
      />
      <Header />

      <div className="bg-[#0f172a] px-4 py-12 sm:py-20 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-800/20 via-transparent to-transparent pointer-events-none" />
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <span className="inline-block text-[11px] font-black text-emerald-400 uppercase tracking-[0.3em] bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-full mb-5">
            About Gramika
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-white mb-4 tracking-tighter">Directory & Team</h1>
          <div className="h-1 w-16 bg-gradient-to-r from-emerald-500 to-teal-500 mx-auto rounded-full mb-6" />
          {data?.description && (
            <div className="max-w-4xl mx-auto mt-8 relative">
              <p className="text-lg sm:text-xl text-slate-300 font-medium leading-[1.8] whitespace-pre-line relative z-10 drop-shadow-md px-4">
                {data.description}
              </p>
            </div>
          )}
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-8 sm:-mt-10 relative z-10 mb-20">
        <div className="bg-white p-2 sm:p-3 rounded-[2rem] shadow-2xl flex flex-row gap-2 max-w-lg mx-auto border border-white/10">
          <button
            onClick={() => setActiveTab('operators')}
            className={`flex-1 flex items-center justify-center gap-2 sm:gap-3 py-4 sm:py-5 px-4 rounded-2xl transition-all duration-300 font-black text-xs sm:text-sm uppercase tracking-widest ${activeTab === 'operators'
                ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-500/30'
                : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
              }`}
          >
            <FaMapMarkerAlt /> <span>Service Operators</span>
          </button>
          <button
            onClick={() => setActiveTab('leadership')}
            className={`flex-1 flex items-center justify-center gap-2 sm:gap-3 py-4 sm:py-5 px-4 rounded-2xl transition-all duration-300 font-black text-xs sm:text-sm uppercase tracking-widest ${activeTab === 'leadership'
                ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/30'
                : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
              }`}
          >
            <FaUsers /> <span>Leadership Team</span>
          </button>
        </div>
      </div>

      <div className="pb-28 px-4">
        <div className="max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            {activeTab === 'operators' ? (
              <motion.div
                key="operators-tab"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.4 }}
              >
                <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 mb-12">
                  <div>
                    <SectionHeading label="Local Service Operators" color="bg-emerald-500" />
                    <p className="text-slate-500 font-medium text-sm mt-2 max-w-xl">
                      Search for authorized operators in your region by entering your village or town name.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative group">
                      <select
                        value={selectedPlace}
                        onChange={(e) => setSelectedPlace(e.target.value)}
                        className="appearance-none bg-white border-2 border-slate-100 text-slate-900 text-sm font-black rounded-3xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 block w-full sm:w-64 px-8 py-5 transition-all pr-14 shadow-lg cursor-pointer"
                      >
                        <option value="">All Regions</option>
                        {getUniquePlaces().map(place => (
                          <option key={place} value={place}>{place}</option>
                        ))}
                      </select>
                      <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>

                    <div className="relative shadow-lg rounded-3xl overflow-hidden">
                      <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-slate-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>
                      <input
                        type="text"
                        placeholder="Search operator or place..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-white border-2 border-slate-100 text-slate-900 text-sm font-black rounded-3xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 block w-full sm:w-80 px-16 py-5 transition-all"
                      />
                    </div>
                  </div>
                </div>

                {filteredOperators.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredOperators.map((op, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="bg-white rounded-[2.5rem] p-8 border-2 border-slate-50 shadow-xl hover:shadow-2xl hover:shadow-emerald-500/10 transition-all group flex flex-col h-full relative"
                      >
                        <div className="absolute top-8 right-8 w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 opacity-20 group-hover:opacity-100 transition-opacity">
                          <FaMapMarkerAlt size={20} />
                        </div>
                        <div className="mb-6">
                          <h4 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-4 group-hover:text-emerald-600 transition-colors pr-10">
                            {op.name}
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {(op.places || "").split(',').map((p, pIdx) => (
                              <span key={pIdx} className="text-[11px] font-black uppercase tracking-[0.1em] px-4 py-1.5 bg-slate-100 text-slate-600 rounded-xl group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
                                {p.trim().toUpperCase()}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="mt-auto pt-8 border-t border-slate-100">
                          <a
                            href={`tel:${op.phone}`}
                            className="flex items-center gap-4 text-xl font-black text-slate-900 hover:text-emerald-600 transition-colors group/tel"
                          >
                            <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/30 group-hover/tel:rotate-12 transition-transform">
                              <FaPhone size={16} />
                            </div>
                            <span className="tracking-tight">{op.phone}</span>
                          </a>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-[3rem] p-24 text-center shadow-xl border-2 border-dashed border-slate-100">
                    <div className="w-24 h-24 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-8 text-slate-200">
                      <FaMapMarkerAlt size={40} />
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 mb-4">Village Not Found</h3>
                    <p className="text-slate-500 font-bold max-w-sm mx-auto">We couldn't find an operator for "{searchQuery || selectedPlace}". Try searching with a different town name.</p>
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="leadership-tab"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
                className="space-y-24"
              >
                {data?.md?.name && (
                  <section>
                    <SectionHeading label="Managing Director" color="bg-blue-600" />
                    {renderMdCard(data.md)}
                  </section>
                )}

                {data?.executiveDirectors && data.executiveDirectors.length > 0 && (
                  <section>
                    <SectionHeading label="Executive Directors" color="bg-indigo-500" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                      {data.executiveDirectors.map((person, idx) => (
                        <div key={idx}>{renderPersonCard(person, "ed")}</div>
                      ))}
                    </div>
                  </section>
                )}

                {data?.directors && data.directors.length > 0 && (
                  <section>
                    <SectionHeading label="General Directors" color="bg-rose-500" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                      {data.directors.map((person, idx) => (
                        <div key={idx}>{renderPersonCard(person, "dir")}</div>
                      ))}
                    </div>
                  </section>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AboutUsPage;
