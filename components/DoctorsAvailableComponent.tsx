import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const DoctorsAvailable = () => {
    const [doctors, setDoctors] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentDate, setCurrentDate] = useState("");
    const [isExpanded, setIsExpanded] = useState(false);

    useEffect(() => {
        setCurrentDate(new Date().toLocaleDateString());
        setLoading(true);
        fetch("/api/sanity/doctors")
            .then((res) => res.json())
            .then((data) => setDoctors(data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    if (!loading && doctors.length === 0) return null;

    return (
        <div className="w-full bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden transition-all duration-500">
            <div className="p-6 border-b border-gray-50 bg-blue-50/50 flex justify-between items-center">
                <h3 className="font-black text-xl text-gray-900">ലഭ്യമായ ഡോക്ടർമാർ</h3>
                <span className="text-xs font-bold text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                    {currentDate}
                </span>
            </div>


            <div className="flex flex-col">
                {loading ? (
                    <div className="p-6 space-y-4 animate-pulse">
                        <div className="flex gap-4">
                            <div className="w-10 h-10 bg-gray-100 rounded-full"></div>
                            <div className="flex-1 space-y-2">
                                <div className="h-4 bg-gray-100 rounded w-3/4"></div>
                                <div className="h-3 bg-gray-100 rounded w-1/2"></div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Always show the first doctor */}
                        {doctors.length > 0 && (
                            <div className="p-4 flex items-center gap-4">
                                <div className="flex-1">
                                    <h4 className="font-bold text-gray-900">{doctors[0].name}</h4>
                                    <p className="text-sm text-gray-500 font-medium">{doctors[0].specialization}</p>
                                    {doctors[0].hospital && (
                                        <p className="text-xs text-gray-400 mt-0.5">{doctors[0].hospital}</p>
                                    )}
                                </div>
                                <div className="text-right">
                                    <div className="text-[10px] font-bold px-2 py-0.5 rounded-full mb-1 inline-block bg-green-100 text-green-700 uppercase">
                                        Active
                                    </div>
                                    <p className="text-xs text-gray-400 font-medium">{doctors[0].availability || "On Call"}</p>
                                </div>
                            </div>
                        )}

                        {/* Hidden/Expanded doctors */}
                        <motion.div
                            initial={false}
                            animate={{ height: isExpanded ? "auto" : 0, opacity: isExpanded ? 1 : 0 }}
                            transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
                            className="overflow-hidden divide-y divide-gray-50 bg-gray-50/30"
                        >
                            {doctors.slice(1).map((doc: any, idx: number) => (
                                <div
                                    key={idx}
                                    className="p-4 flex items-center gap-4 transition-colors"
                                >
                                    <div className="flex-1">
                                        <h4 className="font-bold text-gray-900">{doc.name}</h4>
                                        <p className="text-sm text-gray-500">{doc.specialization}</p>
                                        {doc.hospital && <p className="text-xs text-gray-400">{doc.hospital}</p>}
                                    </div>
                                    <div className="text-right">
                                        <div className="text-[10px] font-bold px-2 py-0.5 rounded-full mb-1 inline-block bg-green-100 text-green-700">
                                            Active
                                        </div>
                                        <p className="text-xs text-gray-400 font-medium">{doc.availability || "On Call"}</p>
                                    </div>
                                </div>
                            ))}
                        </motion.div>

                        {/* Toggle Button */}
                        {doctors.length > 1 && (
                            <button
                                onClick={() => setIsExpanded(!isExpanded)}
                                className="w-full p-3 flex items-center justify-center gap-2 text-sm font-bold text-blue-600 hover:bg-blue-50 transition-colors border-t border-gray-50"
                            >
                                <span>{isExpanded ? "കുറച്ചു കാണിക്കുക" : `${doctors.length - 1} ഡോക്ടർമാരെ കൂടി കാണാൻ`}</span>
                                <motion.div
                                    animate={{ rotate: isExpanded ? 180 : 0 }}
                                    transition={{ duration: 0.4 }}
                                >
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
    );
};


export default DoctorsAvailable;
