"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import Header from "../components/HeaderComponent";
import Footer from "../components/FooterComponent";

interface Person {
  name: string;
  designation: string;
  area: string;
  phone: string;
  image: string;
}

interface AboutData {
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
        if (!data.error) {
          setData(data);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const renderMdCard = (person: Person) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white rounded-3xl shadow-xl overflow-hidden group hover:shadow-2xl transition-all duration-500 border border-gray-100 max-w-4xl mx-auto"
    >
      <div className="flex flex-col md:flex-row">
        <div className="relative h-80 md:h-[400px] md:w-2/5 grayscale group-hover:grayscale-0 transition-all duration-700 shrink-0">
          {person.image ? (
            <Image
              src={person.image}
              alt={person.name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              priority
            />
          ) : (
            <div className="w-full h-full bg-gray-50 flex items-center justify-center text-gray-300">No Photo</div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-40" />
        </div>
        <div className="p-8 md:p-12 flex flex-col justify-center flex-1">
          <div className="mb-6">
            <h3 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight">{person.name}</h3>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Designation</p>
              <p className="text-gray-900 font-bold text-lg">{person.designation}</p>
            </div>
            {person.area && (
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Area</p>
                <p className="text-gray-900 font-bold text-lg">{person.area}</p>
              </div>
            )}
          </div>

          <div className="pt-6 border-t border-gray-100">
             <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Direct Contact</p>
             <a href={`tel:${person.phone}`} className="text-2xl font-black text-blue-600 hover:text-blue-700 transition-colors">
               {person.phone}
             </a>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const renderPersonCard = (person: Person, _title: string) => (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white rounded-2xl shadow-lg overflow-hidden group hover:shadow-xl transition-all duration-300 h-full border border-gray-100 flex flex-col"
    >
      <div className="relative h-72 w-full grayscale group-hover:grayscale-0 transition-all duration-500 overflow-hidden shrink-0">
        {person.image ? (
          <Image
            src={person.image}
            alt={person.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gray-50 flex items-center justify-center text-gray-300 text-xs font-bold uppercase tracking-widest">
            No Photo
          </div>
        )}
      </div>
      
      <div className="p-6 flex-1 flex flex-col">
        <div className="mb-5 pb-4 border-b border-gray-50">
           <h3 className="text-xl font-black text-gray-900 leading-tight tracking-tight uppercase tracking-[0.05em]">{person.name}</h3>
        </div>

        <div className="space-y-4 flex-1">
          <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Designation</p>
                <p className="text-gray-900 font-bold text-sm leading-tight">{person.designation}</p>
              </div>
              {person.area && (
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Area</p>
                    <p className="text-gray-900 font-bold text-sm leading-tight">{person.area}</p>
                  </div>
              )}
          </div>
          <div className="pt-3 border-t border-gray-100 mt-auto">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Contact</p>
            <a href={`tel:${person.phone}`} className="text-blue-600 font-black text-base hover:text-blue-700 transition-colors">
              {person.phone}
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-3">
          <div className="h-10 w-10 bg-blue-600 rounded-full" />
          <p className="font-black text-[10px] text-gray-400 uppercase tracking-widest">Loading Team...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fcfcfc]">
        <Header />
        <div className="py-16 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                  <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-4 tracking-tighter">About Us</h1>
                  <div className="h-1.5 w-20 bg-blue-600 mx-auto rounded-full" />
                  <p className="mt-8 text-lg text-gray-500 max-w-2xl mx-auto font-medium leading-relaxed">
                      Meet the leadership team driving our vision forward with expertise and dedication.
                  </p>
                </div>

                {data?.md && (
                    <div className="mb-24">
                         <h2 className="text-3xl font-black text-gray-900 border-l-8 border-blue-600 pl-6 mb-12">Managing Director</h2>
                         {renderMdCard(data.md)}
                    </div>
                )}

                {data?.executiveDirectors && data.executiveDirectors.length > 0 && (
                    <div className="mb-24">
                        <h2 className="text-3xl font-black text-gray-900 border-l-8 border-indigo-600 pl-6 mb-12">Executive Directors</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {data.executiveDirectors.map((person, idx) => (
                            <div key={idx}>
                                {renderPersonCard(person, "Executive Director")}
                            </div>
                        ))}
                        </div>
                    </div>
                )}

                {data?.directors && data.directors.length > 0 && (
                    <div className="mb-24">
                        <h2 className="text-3xl font-black text-gray-900 border-l-8 border-purple-600 pl-6 mb-12">Directors</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {data.directors.map((person, idx) => (
                            <div key={idx}>
                                {renderPersonCard(person, "Director")}
                            </div>
                        ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
        <Footer />
    </div>
  );
};

export default AboutUsPage;
