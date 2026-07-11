import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { FiUser, FiX } from "react-icons/fi";

function getFuneralDetails(person: { funeralDetails?: string | null }) {
    return (person.funeralDetails || "").trim();
}

const Obituaries = () => {
    const [obituaries, setObituaries] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedPerson, setSelectedPerson] = useState<any | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [isExpanded, setIsExpanded] = useState(false);
    const [mounted, setMounted] = useState(false);
    const itemsPerPage = 4;

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        fetch(`/api/sanity/obituaries?t=${Date.now()}`)
            .then((res) => res.json())
            .then((data) => setObituaries(Array.isArray(data) ? data : []))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    if (!loading && obituaries.length === 0) {
        return null;
    }

    const totalPages = Math.ceil(obituaries.length / itemsPerPage);
    const currentObituaries = obituaries.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    const renderObituaryEntry = (person: any, idx: number) => {
        const hasDetails = Boolean(getFuneralDetails(person));

        return (
            <div
                key={person._id || idx}
                onClick={() => hasDetails && setSelectedPerson(person)}
                className={`group relative flex flex-col items-center text-center p-4 transition-all rounded-2xl border border-transparent ${
                    hasDetails
                        ? "hover:bg-[var(--accent-muted)] cursor-pointer hover:border-[var(--border-default)]"
                        : "cursor-default"
                }`}
            >
                <div className="relative w-20 h-20 rounded-full overflow-hidden ring-2 ring-[var(--border-default)] mb-3 transition-all">
                    {person.photo ? (
                        <Image src={person.photo} alt={person.name} fill className="object-cover" />
                    ) : (
                        <div className="w-full h-full bg-[var(--bg-muted)] flex items-center justify-center text-[var(--text-tertiary)]">
                            <FiUser className="w-10 h-10" />
                        </div>
                    )}
                </div>
                <h4 className="font-bold text-[var(--text-primary)] mb-1 group-hover:text-[var(--accent)] transition-colors">
                    {person.name}
                </h4>
                <p className="text-sm text-[var(--text-tertiary)] mb-1">({person.age})</p>
                <p className="text-sm text-[var(--text-secondary)]">{person.place}</p>
                <span className="text-xs font-bold text-[var(--text-tertiary)] bg-[var(--bg-muted)] px-2 py-1 rounded-full mt-2">
                    {new Date(person.dateOfDeath).toLocaleDateString()}
                </span>
                {hasDetails && (
                    <div className="mt-3 flex items-center gap-1 text-[10px] font-bold text-[var(--accent)] bg-[var(--accent-muted)] px-3 py-1.5 rounded-full group-hover:bg-[var(--accent)] group-hover:text-white transition-colors">
                        <span>വിശദവിവരങ്ങൾ</span>
                    </div>
                )}
            </div>
        );
    };

    const modal = selectedPerson ? (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedPerson(null)}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-lg max-h-[90vh] flex flex-col rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] shadow-[var(--shadow-lg)] overflow-hidden"
            >
                <button
                    type="button"
                    onClick={() => setSelectedPerson(null)}
                    className="absolute top-4 right-4 z-10 p-2 bg-[var(--bg-muted)] hover:bg-[var(--bg-surface)] rounded-full transition-colors text-[var(--text-secondary)]"
                    aria-label="Close"
                >
                    <FiX size={22} />
                </button>

                <div className="overflow-y-auto flex-1">
                    <div className="flex flex-col sm:flex-row items-center sm:items-start p-6 sm:p-8 gap-6 sm:gap-8">
                        <div className="relative w-32 h-32 sm:w-40 sm:h-40 shrink-0 rounded-full overflow-hidden ring-4 ring-[var(--border-subtle)]">
                            {selectedPerson.photo ? (
                                <Image src={selectedPerson.photo} alt={selectedPerson.name} fill className="object-cover" />
                            ) : (
                                <div className="w-full h-full bg-[var(--bg-muted)] flex items-center justify-center text-[var(--text-tertiary)]">
                                    <FiUser className="w-16 h-16" />
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col items-center sm:items-start text-center sm:text-left pt-2">
                            <h3 className="text-display text-2xl sm:text-3xl mb-2 leading-tight">
                                {selectedPerson.name}
                            </h3>
                            <div className="flex flex-wrap justify-center sm:justify-start gap-x-4 gap-y-2 text-[var(--text-tertiary)] mb-4 text-sm">
                                <span className="font-semibold text-[var(--text-secondary)] bg-[var(--bg-muted)] px-2 py-0.5 rounded-md">
                                    {selectedPerson.age} Years
                                </span>
                                <span className="flex items-center gap-1">
                                    <span className="w-1 h-1 rounded-full bg-[var(--text-tertiary)]" />
                                    {selectedPerson.place}
                                </span>
                            </div>
                            <p className="text-sm text-[var(--text-tertiary)] font-medium">
                                Date of Death:{" "}
                                <span className="text-[var(--text-primary)]">
                                    {new Date(selectedPerson.dateOfDeath).toLocaleDateString()}
                                </span>
                            </p>
                        </div>
                    </div>

                    <div className="h-px bg-[var(--border-subtle)] w-full" />

                    <div className="p-6 sm:p-8 bg-[var(--bg-muted)]/50">
                        <h4 className="text-eyebrow mb-3">ശവസംസ്കാര വിവരങ്ങൾ</h4>
                        {getFuneralDetails(selectedPerson) ? (
                            <p className="text-sm sm:text-base text-[var(--text-primary)] leading-[1.85] whitespace-pre-wrap break-words">
                                {getFuneralDetails(selectedPerson)}
                            </p>
                        ) : (
                            <p className="text-center text-[var(--text-tertiary)] italic">
                                No additional details available.
                            </p>
                        )}
                    </div>
                </div>
            </motion.div>
        </div>
    ) : null;

    return (
        <>
            <div className="w-full surface-card overflow-hidden relative">
                <div className="p-5 sm:p-6 border-b border-[var(--border-subtle)] bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 flex justify-between items-center">
                    <h3 className="font-[family-name:var(--font-display)] font-black text-lg sm:text-xl">ആദരാഞ്ജലികൾ</h3>
                </div>

                <div className="flex flex-col">
                    {loading ? (
                        <div className="p-6 space-y-4 animate-pulse">
                            <div className="flex flex-col items-center">
                                <div className="w-20 h-20 skeleton rounded-full mb-3" />
                                <div className="h-4 skeleton rounded w-1/2 mb-2" />
                                <div className="h-3 skeleton rounded w-1/3" />
                            </div>
                        </div>
                    ) : (
                        <>
                            {currentPage === 1 && (
                                <div className={`p-4 grid ${obituaries.length === 1 ? "grid-cols-1" : "grid-cols-2"} gap-4`}>
                                    {obituaries.slice(0, 2).map((person, idx) => renderObituaryEntry(person, idx))}
                                </div>
                            )}

                            <AnimatePresence initial={false}>
                                {isExpanded && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                                        className="overflow-hidden"
                                    >
                                        <div className="flex flex-col">
                                            <div className={`p-4 ${currentPage === 1 ? "pt-0" : "pt-4"} grid grid-cols-2 gap-4`}>
                                                {currentObituaries.map((person, idx) => {
                                                    const absoluteIdx = (currentPage - 1) * itemsPerPage + idx;
                                                    if (currentPage === 1) {
                                                        if (absoluteIdx < 2 || absoluteIdx >= 4) return null;
                                                        return renderObituaryEntry(person, absoluteIdx);
                                                    }
                                                    return renderObituaryEntry(person, absoluteIdx);
                                                })}
                                            </div>

                                            {totalPages > 1 && (
                                                <div className="flex justify-center items-center gap-2 p-4 border-t border-[var(--border-subtle)]">
                                                    <button
                                                        type="button"
                                                        onClick={() => handlePageChange(currentPage - 1)}
                                                        disabled={currentPage === 1}
                                                        className={`pagination-btn ${currentPage === 1 ? "pagination-btn-disabled" : "pagination-btn-enabled"}`}
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                                        </svg>
                                                    </button>

                                                    <div className="flex gap-1.5">
                                                        {Array.from({ length: totalPages }).map((_, idx) => (
                                                            <button
                                                                key={idx}
                                                                type="button"
                                                                onClick={() => handlePageChange(idx + 1)}
                                                                className={`pagination-page ${currentPage === idx + 1 ? "pagination-page-current" : "pagination-page-default"}`}
                                                            >
                                                                {idx + 1}
                                                            </button>
                                                        ))}
                                                    </div>

                                                    <button
                                                        type="button"
                                                        onClick={() => handlePageChange(currentPage + 1)}
                                                        disabled={currentPage === totalPages}
                                                        className={`pagination-btn ${currentPage === totalPages ? "pagination-btn-disabled" : "pagination-btn-enabled"}`}
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {obituaries.length > 2 && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsExpanded(!isExpanded);
                                        if (isExpanded) setCurrentPage(1);
                                    }}
                                    className="w-full p-4 flex items-center justify-center gap-2 text-sm font-bold text-[var(--accent)] hover:bg-[var(--accent-muted)] transition-all duration-300 border-t border-[var(--border-subtle)]"
                                >
                                    <span>{isExpanded ? "കുറച്ചു കാണിക്കുക" : "കൂടുതൽ കാണുക"}</span>
                                    <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.3 }}>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </motion.div>
                                </button>
                            )}
                        </>
                    )}
                </div>
            </div>

            {mounted && createPortal(
                <AnimatePresence>{modal}</AnimatePresence>,
                document.body
            )}
        </>
    );
};

export default Obituaries;
