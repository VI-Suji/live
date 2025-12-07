import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { FiUser, FiX } from "react-icons/fi";

const Obituaries = () => {
    const [obituaries, setObituaries] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedPerson, setSelectedPerson] = useState<any | null>(null);

    useEffect(() => {
        fetch("/api/sanity/obituaries")
            .then((res) => res.json())
            .then((data) => setObituaries(data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const gridClass = obituaries.length === 1 ? "grid grid-cols-1 gap-4" : "grid grid-cols-2 gap-4";

    if (!loading && obituaries.length === 0) {
        return null;
    }

    return (
        <div className="w-full bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden relative">
            <div className="p-6 border-b border-gray-50 bg-gray-900 text-white flex justify-between items-center">
                <h3 className="font-black text-xl">ആദരാഞ്ജലികൾ</h3>
            </div>

            <div className={`p-4 ${loading ? 'block' : gridClass}`}>
                {loading ? (
                    <div className="space-y-4 animate-pulse">
                        <div className="flex flex-col items-center">
                            <div className="w-20 h-20 bg-gray-200 rounded-full mb-3"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                            <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                        </div>
                    </div>
                ) : (
                    <>
                        {obituaries.map((person, idx) => (
                            <div
                                key={idx}
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
                                        <span>More Details</span>
                                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                )}
                            </div>
                        ))}
                    </>
                )}
            </div>

            {/* Popup Modal */}
            <AnimatePresence>
                {selectedPerson && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 px-4 sm:px-6">
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedPerson(null)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />

                        {/* Modal Content */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden"
                        >
                            {/* Close Button - More visible */}
                            <button
                                onClick={() => setSelectedPerson(null)}
                                className="absolute top-4 right-4 z-10 p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors text-gray-600"
                            >
                                <FiX size={24} />
                            </button>

                            <div className="flex flex-col sm:flex-row items-center sm:items-start p-6 sm:p-8 gap-6 sm:gap-8 bg-white">
                                {/* Large Photo */}
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

                                {/* Header Info */}
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

                            {/* Divider */}
                            <div className="h-px bg-gray-100 w-full"></div>

                            {/* Details Section */}
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
