import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { FiUser, FiX } from "react-icons/fi";

const Obituaries = () => {
    const [obituaries, setObituaries] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedPerson, setSelectedPerson] = useState<any | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [isExpanded, setIsExpanded] = useState(false);
    const itemsPerPage = 4;

    useEffect(() => {
        fetch("/api/sanity/obituaries")
            .then((res) => res.json())
            .then((data) => setObituaries(data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    if (!loading && obituaries.length === 0) {
        return null;
    }

    // Pagination logic
    const totalPages = Math.ceil(obituaries.length / itemsPerPage);

    // Determine which obituaries to show for the current page when expanded
    const currentObituaries = obituaries.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    const renderObituaryEntry = (person: any, idx: number) => (
        <div
            key={person._id || idx}
            onClick={() => person.funeralDetails?.trim() && setSelectedPerson(person)}
            className={`group relative flex flex-col items-center text-center p-4 transition-all rounded-2xl border border-transparent 
                ${person.funeralDetails?.trim() ? 'hover:bg-blue-50/50 cursor-pointer hover:border-blue-100' : 'cursor-default'}`}
        >
            <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-gray-200 mb-3 transition-all">
                {person.photo ? (
                    <Image
                        src={person.photo}
                        alt={person.name}
                        fill
                        className="object-cover"
                    />
                ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
                        <FiUser className="w-10 h-10 text-gray-300" />
                    </div>
                )}
            </div>
            <h4 className="font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                {person.name}
            </h4>
            <p className="text-sm text-gray-500 mb-1">({person.age})</p>
            <p className="text-sm text-gray-600">{person.place}</p>
            <span className="text-xs font-bold text-gray-400 bg-gray-100 px-2 py-1 rounded-full mt-2">
                {new Date(person.dateOfDeath).toLocaleDateString()}
            </span>
            {person.funeralDetails?.trim() && (
                <div className="mt-3 flex items-center gap-1 text-[10px] font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <span>വിശദവിവരങ്ങൾ</span>
                </div>
            )}
        </div>
    );

    return (
        <div className="w-full bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden relative">
            <div className="p-6 border-b border-gray-50 bg-gray-900 text-white flex justify-between items-center">
                <h3 className="font-black text-xl">ആദരാഞ്ജലികൾ</h3>
            </div>

            <div className="flex flex-col">
                {loading ? (
                    <div className="p-6 space-y-4 animate-pulse">
                        <div className="flex flex-col items-center">
                            <div className="w-20 h-20 bg-gray-200 rounded-full mb-3"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                            <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Always visible items (first 2) - only shown on page 1 */}
                        {currentPage === 1 && (
                            <div className={`p-4 grid ${obituaries.length === 1 ? 'grid-cols-1' : 'grid-cols-2'} gap-4`}>
                                {obituaries.slice(0, 2).map((person, idx) => renderObituaryEntry(person, idx))}
                            </div>
                        )}

                        {/* Expandable Section */}
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
                                        {/* Paginated Grid Content */}
                                        <div className={`p-4 ${currentPage === 1 ? 'pt-0' : 'pt-4'} grid grid-cols-2 gap-4`}>
                                            {currentObituaries.map((person, idx) => {
                                                const absoluteIdx = (currentPage - 1) * itemsPerPage + idx;

                                                // On Page 1, only render items 2 and 3 in this section (0 and 1 are handled above)
                                                if (currentPage === 1) {
                                                    if (absoluteIdx < 2 || absoluteIdx >= 4) return null;
                                                    return renderObituaryEntry(person, absoluteIdx);
                                                }

                                                // On other pages, render all items belonging to that page
                                                return renderObituaryEntry(person, absoluteIdx);
                                            })}
                                        </div>

                                        {/* Pagination Controls */}
                                        {totalPages > 1 && (
                                            <div className="flex justify-center items-center gap-2 p-4 border-t border-gray-50 bg-gray-50/10">
                                                <button
                                                    onClick={() => handlePageChange(currentPage - 1)}
                                                    disabled={currentPage === 1}
                                                    className={`p-2 rounded-xl transition-all duration-300 ${currentPage === 1
                                                        ? "text-gray-200 cursor-not-allowed"
                                                        : "text-gray-600 hover:bg-white hover:shadow-sm"}`}
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                                    </svg>
                                                </button>

                                                <div className="flex gap-1.5">
                                                    {Array.from({ length: totalPages }).map((_, idx) => (
                                                        <button
                                                            key={idx}
                                                            onClick={() => handlePageChange(idx + 1)}
                                                            className={`w-8 h-8 rounded-lg text-xs font-bold transition-all duration-300 ${currentPage === idx + 1
                                                                ? "bg-gray-900 text-white shadow-lg"
                                                                : "text-gray-500 hover:bg-white border border-transparent"}`}
                                                        >
                                                            {idx + 1}
                                                        </button>
                                                    ))}
                                                </div>

                                                <button
                                                    onClick={() => handlePageChange(currentPage + 1)}
                                                    disabled={currentPage === totalPages}
                                                    className={`p-2 rounded-xl transition-all duration-300 ${currentPage === totalPages
                                                        ? "text-gray-200 cursor-not-allowed"
                                                        : "text-gray-600 hover:bg-white hover:shadow-sm"}`}
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                    </svg>
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Toggle Button */}
                        {obituaries.length > 2 && (
                            <button
                                onClick={() => {
                                    setIsExpanded(!isExpanded);
                                    if (isExpanded) setCurrentPage(1); // Reset to page 1 when collapsing
                                }}
                                className="w-full p-4 flex items-center justify-center gap-2 text-sm font-bold text-blue-600 hover:bg-blue-50 transition-all duration-300 border-t border-gray-50 bg-gray-50/30 group"
                            >
                                <span className="group-hover:tracking-wide transition-all duration-300">
                                    {isExpanded ? "കുറച്ചു കാണിക്കുക" : "കൂടുതൽ കാണുക"}
                                </span>
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

            {/* Popup Modal */}
            <AnimatePresence>
                {selectedPerson && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 px-4 sm:px-6">
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
                            className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden"
                        >
                            <button
                                onClick={() => setSelectedPerson(null)}
                                className="absolute top-4 right-4 z-10 p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors text-gray-600"
                            >
                                <FiX size={24} />
                            </button>

                            <div className="flex flex-col sm:flex-row items-center sm:items-start p-6 sm:p-8 gap-6 sm:gap-8 bg-white">
                                <div className="relative w-32 h-32 sm:w-40 sm:h-40 shrink-0 rounded-full overflow-hidden border-4 border-gray-50 shadow-inner">
                                    {selectedPerson.photo ? (
                                        <Image
                                            src={selectedPerson.photo}
                                            alt={selectedPerson.name}
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
                                            <FiUser className="w-16 h-16 text-gray-300" />
                                        </div>
                                    )}
                                </div>

                                <div className="flex flex-col items-center sm:items-start text-center sm:text-left pt-2">
                                    <h3 className="text-3xl font-black text-gray-900 mb-2 leading-tight">
                                        {selectedPerson.name}
                                    </h3>
                                    <div className="flex flex-wrap justify-center sm:justify-start gap-x-4 gap-y-2 text-gray-500 mb-4 text-sm">
                                        <span className="font-semibold text-gray-700 bg-gray-100 px-2 py-0.5 rounded-md">{selectedPerson.age} Years</span>
                                        <span className="flex items-center gap-1">
                                            <span className="w-1 h-1 rounded-full bg-gray-400"></span>
                                            {selectedPerson.place}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-500 font-medium">
                                        Date of Death: <span className="text-gray-900">{new Date(selectedPerson.dateOfDeath).toLocaleDateString()}</span>
                                    </p>
                                </div>
                            </div>

                            <div className="h-px bg-gray-100 w-full"></div>

                            <div className="p-6 sm:p-8 bg-gray-50/50">
                                {selectedPerson.funeralDetails?.trim() ? (
                                    <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed font-medium">
                                        <p>{selectedPerson.funeralDetails}</p>
                                    </div>
                                ) : (
                                    <p className="text-center text-gray-400 italic">No additional details available.</p>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Obituaries;
