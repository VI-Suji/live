import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { FiUser } from "react-icons/fi";

const Obituaries = () => {
    const [obituaries, setObituaries] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/sanity/obituaries")
            .then((res) => res.json())
            .then((data) => setObituaries(data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const gridClass = obituaries.length === 1
        ? "grid-cols-1"
        : "grid grid-cols-2 gap-4";

    if (!loading && obituaries.length === 0) {
        return null;
    }

    return (
        <div className="w-full bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
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
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: idx * 0.1 }}
                                className="flex flex-col items-center text-center p-4 hover:bg-gray-50 transition-colors rounded-2xl"
                            >
                                <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-gray-200 grayscale mb-3">
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
                                <h4 className="font-bold text-gray-900 mb-1">
                                    {person.name}
                                </h4>
                                <p className="text-sm text-gray-500 mb-1">({person.age})</p>
                                <p className="text-sm text-gray-600">{person.place}</p>
                                {person.funeralDetails?.trim() && (
                                    <div className="mt-3 w-full bg-gray-50 rounded-xl p-3 border border-gray-100 text-left">

                                        <p className="text-sm text-gray-700 leading-relaxed font-medium">
                                            {person.funeralDetails}
                                        </p>
                                    </div>
                                )}
                                <span className="text-xs font-bold text-gray-400 bg-gray-100 px-2 py-1 rounded-full mt-2">
                                    {new Date(person.dateOfDeath).toLocaleDateString()}
                                </span>
                            </motion.div>
                        ))}
                    </>
                )}
            </div>
        </div>
    );
};

export default Obituaries;
