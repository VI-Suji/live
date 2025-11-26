import React from "react";
import Image from "next/image";

const OBITUARIES = [
    {
        name: "K. Madhavan",
        age: 82,
        place: "Thodupuzha",
        image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop",
        date: "Today"
    },
    {
        name: "Saraswathi Amma",
        age: 75,
        place: "Muvattupuzha",
        image: "https://images.unsplash.com/photo-1551843021-d7563d0f0f28?q=80&w=200&auto=format&fit=crop",
        date: "Yesterday"
    }
];

const Obituaries = () => {
    const gridClass = OBITUARIES.length === 1
        ? "grid-cols-1"
        : OBITUARIES.length === 2
            ? "grid grid-cols-2 gap-4"
            : "grid grid-cols-2 gap-4";

    return (
        <div className="w-full bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-50 bg-gray-900 text-white flex justify-between items-center">
                <h3 className="font-black text-xl">സ്മരണാഞ്ജലികൾ</h3>
            </div>

            <div className={`p-4 ${gridClass}`}>
                {OBITUARIES.map((person, idx) => (
                    <div key={idx} className="flex flex-col items-center text-center p-4 hover:bg-gray-50 transition-colors rounded-2xl">
                        <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-gray-200 grayscale mb-3">
                            <Image
                                src={person.image}
                                alt={person.name}
                                fill
                                className="object-cover"
                            />
                        </div>
                        <h4 className="font-bold text-gray-900 mb-1">
                            {person.name}
                        </h4>
                        <p className="text-sm text-gray-500 mb-1">({person.age})</p>
                        <p className="text-sm text-gray-600">{person.place}</p>
                        <span className="text-xs font-bold text-gray-400 bg-gray-100 px-2 py-1 rounded-full mt-2">
                            {person.date}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Obituaries;
