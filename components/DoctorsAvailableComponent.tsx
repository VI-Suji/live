import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const DoctorsAvailable = () => {
    const [doctors, setDoctors] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentDate, setCurrentDate] = useState("");

    useEffect(() => {
        setCurrentDate(new Date().toLocaleDateString());
        fetch("/api/sanity/doctors")
            .then((res) => res.json())
            .then((data) => setDoctors(data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    if (!loading && doctors.length === 0) {
        return null;
    }

    return (
        <div className="w-full bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-50 bg-blue-50/50 flex justify-between items-center">
                <h3 className="font-black text-xl text-gray-900">ഇന്ന് ലഭ്യമായ ഡോക്ടർമാർ</h3>
                <span className="text-xs font-bold text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                    {currentDate}
                </span>
            </div>

            <div className="divide-y divide-gray-50">
                {loading ? (
                    <div className="p-6 space-y-4 animate-pulse">
                        {[1, 2].map((i) => (
                            <div key={i} className="flex gap-4">
                                <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <>
                        {doctors.map((doc, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors"
                            >
                                <div className="flex-1">
                                    <h4 className="font-bold text-gray-900">{doc.name}</h4>
                                    <p className="text-sm text-gray-500">{doc.specialization}</p>
                                    {doc.hospital && <p className="text-xs text-gray-400">{doc.hospital}</p>}
                                </div>
                                <div className="text-right">
                                    <div className="text-xs font-bold px-2 py-1 rounded-full mb-1 inline-block bg-green-100 text-green-700">
                                        ലഭ്യമാണ്
                                    </div>
                                    <p className="text-xs text-gray-400 font-medium">{doc.availability || "On Call"}</p>
                                </div>
                            </motion.div>
                        ))}
                    </>
                )}
            </div>
        </div>
    );
};

export default DoctorsAvailable;
