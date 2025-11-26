import React from "react";
import Image from "next/image";

const DOCTORS = [
    {
        name: "Dr. Sarah Thomas",
        specialty: "Cardiologist",
        time: "9:00 AM - 1:00 PM",
        available: true
    },
    {
        name: "Dr. Rajesh Kumar",
        specialty: "Pediatrician",
        time: "10:00 AM - 2:00 PM",
        available: true
    },
    {
        name: "Dr. Priya Nair",
        specialty: "General Medicine",
        time: "2:00 PM - 6:00 PM",
        available: false
    },
    {
        name: "Dr. Mohanlal",
        specialty: "Orthopedic Surgeon",
        time: "2:00 PM - 6:00 PM",
        available: false
    }
];

const DoctorsAvailable = () => {
    return (
        <div className="w-full bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-50 bg-blue-50/50 flex justify-between items-center">
                <h3 className="font-black text-xl text-gray-900">ഇന്ന് ലഭ്യമായ ഡോക്ടർമാർ</h3>
                <span className="text-xs font-bold text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                    26/11/2025
                </span>
            </div>

            <div className="divide-y divide-gray-50">
                {DOCTORS.map((doc, idx) => (
                    <div key={idx} className="p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors">
                        <div className="flex-1">
                            <h4 className="font-bold text-gray-900">{doc.name}</h4>
                            <p className="text-sm text-gray-500">{doc.specialty}</p>
                        </div>
                        <div className="text-right">
                            <div className={`text-xs font-bold px-2 py-1 rounded-full mb-1 inline-block ${doc.available ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                                }`}>
                                {doc.available ? "ലഭ്യമാണ്" : "ഡ്യൂട്ടിയില്ല"}
                            </div>
                            <p className="text-xs text-gray-400 font-medium">{doc.time}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DoctorsAvailable;
