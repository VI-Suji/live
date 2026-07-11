"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { FaPhone, FaUsers, FaMapMarkerAlt, FaSearch } from "react-icons/fa";
import Header from "../components/HeaderComponent";
import Footer from "../components/FooterComponent";
import Meta from "../components/Meta";
import SectionHeader from "../components/SectionHeader";

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

const placeTagColors = [
  "bg-emerald-500/10 text-emerald-700 border-emerald-500/25 dark:text-emerald-300",
  "bg-blue-500/10 text-blue-700 border-blue-500/25 dark:text-blue-300",
  "bg-violet-500/10 text-violet-700 border-violet-500/25 dark:text-violet-300",
  "bg-amber-500/10 text-amber-700 border-amber-500/25 dark:text-amber-300",
  "bg-rose-500/10 text-rose-700 border-rose-500/25 dark:text-rose-300",
];

function PersonAvatar({
  person,
  size = "md",
}: {
  person: Person;
  size?: "lg" | "md";
}) {
  const dimensions = size === "lg" ? "w-32 h-32 sm:w-40 sm:h-40" : "w-24 h-24 sm:w-28 sm:h-28";
  const textSize = size === "lg" ? "text-4xl" : "text-2xl";

  return (
    <div className={`relative ${dimensions} shrink-0`}>
      <div className="relative w-full h-full rounded-full ring-1 ring-[var(--border-default)] overflow-hidden bg-[var(--bg-muted)]">
        {person.image ? (
          <Image src={person.image} alt={person.name} fill className="object-cover object-top" />
        ) : (
          <div className="w-full h-full flex items-center justify-center font-semibold font-[family-name:var(--font-display)] text-[var(--text-tertiary)]">
            <span className={textSize}>{person.name?.[0] || "?"}</span>
          </div>
        )}
      </div>
    </div>
  );
}

function MdCard({ person }: { person: Person }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35 }}
      className="surface-elevated p-6 sm:p-10"
    >
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-10">
        <PersonAvatar person={person} size="lg" />
        <div className="flex-1 text-center sm:text-left min-w-0">
          <span className="text-eyebrow mb-2 block">Managing Director</span>
          <h3 className="text-display text-2xl sm:text-3xl leading-tight mb-3">
            {person.name}
          </h3>
          {person.area && person.showArea !== false && (
            <span className="inline-flex px-2.5 py-1 mb-5 text-[10px] font-[family-name:var(--font-display)] font-medium uppercase tracking-wider rounded-md border border-[var(--border-default)] text-[var(--text-secondary)] bg-[var(--bg-muted)]">
              {person.area}
            </span>
          )}
          <a
            href={`tel:${person.phone}`}
            className="inline-flex items-center gap-3 text-base sm:text-lg font-medium text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors"
          >
            <span className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400">
              <FaPhone size={13} />
            </span>
            {person.phone}
          </a>
        </div>
      </div>
    </motion.div>
  );
}

function PersonCard({ person }: { person: Person }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35 }}
      className="surface-card p-5 flex flex-col items-center text-center h-full"
    >
      <PersonAvatar person={person} />
      <div className="mt-4 w-full min-w-0">
        <h3 className="font-medium text-[var(--text-primary)] leading-snug mb-2 line-clamp-2">
          {person.name}
        </h3>
        {person.area && person.showArea !== false && (
          <span className="inline-flex px-2 py-0.5 mb-4 text-[10px] font-[family-name:var(--font-display)] font-medium uppercase tracking-wider rounded-md border border-[var(--border-default)] text-[var(--text-secondary)] bg-[var(--bg-muted)]">
            {person.area}
          </span>
        )}
        <a
          href={`tel:${person.phone}`}
          className="inline-flex items-center justify-center gap-2 w-full pt-4 border-t border-[var(--border-subtle)] text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors"
        >
          <FaPhone size={12} className="text-blue-600 dark:text-blue-400" />
          <span className="truncate">{person.phone}</span>
        </a>
      </div>
    </motion.div>
  );
}

function OperatorCard({ operator, index }: { operator: Operator; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35, delay: (index % 6) * 0.04 }}
      className="surface-card surface-card-interactive p-5 sm:p-6 flex flex-col h-full"
    >
      <div className="flex items-start justify-between gap-3 mb-4">
        <h4 className="font-medium text-[var(--text-primary)] text-lg leading-snug">
          {operator.name}
        </h4>
        <span className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400">
          <FaMapMarkerAlt size={13} />
        </span>
      </div>
      <div className="flex flex-wrap gap-1.5 mb-5">
        {(operator.places || "").split(",").map((place, idx) => (
          <span
            key={idx}
            className={`text-[10px] font-[family-name:var(--font-display)] font-medium uppercase tracking-wide px-2 py-1 rounded-md border ${placeTagColors[(idx + index) % placeTagColors.length]}`}
          >
            {place.trim()}
          </span>
        ))}
      </div>
      <a
        href={`tel:${operator.phone}`}
        className="mt-auto flex items-center gap-3 pt-4 border-t border-[var(--border-subtle)] text-[var(--text-primary)] font-medium hover:text-[var(--accent)] transition-colors"
      >
        <span className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400">
          <FaPhone size={13} />
        </span>
        {operator.phone}
      </a>
    </motion.div>
  );
}

const inputClass =
  "w-full px-4 py-3 text-sm text-[var(--text-primary)] bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-xl placeholder:text-[var(--text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-muted)] focus:border-[var(--border-strong)]";

const AboutUsPage: React.FC = () => {
  const [data, setData] = useState<AboutData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"operators" | "leadership">("operators");
  const [selectedPlace, setSelectedPlace] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetch("/api/sanity/aboutUs")
      .then((res) => res.json())
      .then((fetched) => {
        if (!fetched.error) setData(fetched);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const getUniquePlaces = () => {
    if (!data?.operators) return [];
    const placesSet = new Set<string>();
    data.operators.forEach((op) => {
      if (op.places) {
        op.places.split(",").forEach((p) => {
          const trimmed = p.trim().toUpperCase();
          if (trimmed) placesSet.add(trimmed);
        });
      }
    });
    return Array.from(placesSet).sort();
  };

  const filteredOperators =
    data?.operators?.filter((op) => {
      const matchesPlace =
        !selectedPlace || (op.places || "").toUpperCase().includes(selectedPlace.toUpperCase());
      const matchesSearch =
        !searchQuery ||
        op.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (op.places || "").toLowerCase().includes(searchQuery.toLowerCase());
      return matchesPlace && matchesSearch;
    }) || [];

  if (loading) {
    return (
      <div className="min-h-screen page-bg flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-[var(--border-default)] border-t-[var(--accent)] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="page-bg min-h-screen">
      <Meta
        title="About Gramika | Gramika News"
        description={data?.description || "About the team behind Gramika News."}
      />
      <Header />

      <main className="w-full">
        <section className="page-container pt-6 sm:pt-10 pb-8 sm:pb-12">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <SectionHeader
              eyebrow="About Gramika"
              title="Directory & Team"
              align="center"
              className="mb-4"
            />
            {data?.description && (
              <p className="text-body text-sm sm:text-base max-w-2xl mx-auto text-center whitespace-pre-line">
                {data.description}
              </p>
            )}
          </motion.div>
        </section>

        <section className="page-container pb-8 sm:pb-10">
          <div className="tab-group w-full sm:w-auto mx-auto flex">
            <button
              type="button"
              onClick={() => setActiveTab("operators")}
              className={`tab-item about-tab-operators flex-1 sm:flex-none flex items-center justify-center gap-2 ${activeTab === "operators" ? "tab-item-active" : ""}`}
            >
              <FaMapMarkerAlt size={12} />
              Service Operators
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("leadership")}
              className={`tab-item about-tab-leadership flex-1 sm:flex-none flex items-center justify-center gap-2 ${activeTab === "leadership" ? "tab-item-active" : ""}`}
            >
              <FaUsers size={12} />
              Leadership Team
            </button>
          </div>
        </section>

        <section className="page-container pb-16 sm:pb-24">
          <AnimatePresence mode="wait">
            {activeTab === "operators" ? (
              <motion.div
                key="operators-tab"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
              >
                <SectionHeader
                  title="Local Service Operators"
                  description="Search for authorized operators in your region by village or town name."
                  compact
                  className="mb-6"
                />

                <div className="flex flex-col lg:flex-row gap-3 mb-10">
                  <select
                    value={selectedPlace}
                    onChange={(e) => setSelectedPlace(e.target.value)}
                    className={`${inputClass} lg:w-56 font-[family-name:var(--font-display)]`}
                  >
                    <option value="">All Regions</option>
                    {getUniquePlaces().map((place) => (
                      <option key={place} value={place}>
                        {place}
                      </option>
                    ))}
                  </select>

                  <div className="relative flex-1">
                    <FaSearch
                      size={14}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600/70 dark:text-emerald-400/70"
                    />
                    <input
                      type="text"
                      placeholder="Search operator or place..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className={`${inputClass} pl-10`}
                    />
                  </div>
                </div>

                {filteredOperators.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {filteredOperators.map((op, idx) => (
                      <OperatorCard key={`${op.name}-${idx}`} operator={op} index={idx} />
                    ))}
                  </div>
                ) : (
                  <div className="surface-card p-12 sm:p-16 text-center">
                    <div className="w-12 h-12 mx-auto mb-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                      <FaMapMarkerAlt size={18} />
                    </div>
                    <h3 className="text-display text-xl mb-2">No operators found</h3>
                    <p className="text-body text-sm max-w-sm mx-auto">
                      We couldn&apos;t find an operator for &quot;{searchQuery || selectedPlace}&quot;. Try a different search.
                    </p>
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="leadership-tab"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                className="space-y-12 sm:space-y-16"
              >
                {data?.md?.name && (
                  <section>
                    <SectionHeader title="Managing Director" compact className="mb-6" />
                    <MdCard person={data.md} />
                  </section>
                )}

                {data?.executiveDirectors && data.executiveDirectors.length > 0 && (
                  <section>
                    <SectionHeader title="Executive Directors" compact className="mb-6" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                      {data.executiveDirectors.map((person, idx) => (
                        <PersonCard key={`ed-${idx}`} person={person} />
                      ))}
                    </div>
                  </section>
                )}

                {data?.directors && data.directors.length > 0 && (
                  <section>
                    <SectionHeader title="General Directors" compact className="mb-6" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                      {data.directors.map((person, idx) => (
                        <PersonCard key={`dir-${idx}`} person={person} />
                      ))}
                    </div>
                  </section>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default AboutUsPage;
