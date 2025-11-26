import React from "react";
import Image from "next/image";

const LOCAL_NEWS = [
    {
        id: 1,
        title: "New Bridge Inaugurated in Thodupuzha",
        image: "https://images.unsplash.com/photo-1513828583688-c52646db42da?q=80&w=400&auto=format&fit=crop"
    },
    {
        id: 2,
        title: "Local School Wins State Championship",
        image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=400&auto=format&fit=crop"
    },
    {
        id: 3,
        title: "Farmers Market Opens This Weekend",
        image: "https://images.unsplash.com/photo-1488459716781-31db52582fe9?q=80&w=400&auto=format&fit=crop"
    }
];

const LocalNews = () => {
    return (
        <div className="w-full mt-12">
            <div className="flex items-center gap-3 mb-8">
                <div className="w-1.5 h-8 bg-blue-600 rounded-full"></div>
                <h2 className="text-3xl font-black text-gray-900 tracking-tight">Local News</h2>
            </div>

            <div className="flex flex-col gap-6">
                {LOCAL_NEWS.map((news) => (
                    <div key={news.id} className="group cursor-pointer bg-white rounded-3xl p-4 hover:shadow-xl transition-all duration-300 border border-transparent hover:border-gray-100 flex flex-col sm:flex-row gap-6 items-center">
                        <div className="relative h-48 sm:h-40 w-full sm:w-64 flex-shrink-0 rounded-2xl overflow-hidden">
                            <Image
                                src={news.image}
                                alt={news.title}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight group-hover:text-blue-600 transition-colors mb-3">
                                {news.title}
                            </h3>
                            <p className="text-gray-500 line-clamp-4 mb-4">
                                സംഭവത്തിന്റെ വിശദമായ കവറേജ്, പ്രധാന വ്യക്തികളുമായുള്ള അഭിമുഖങ്ങൾ, ചടങ്ങിൽ പങ്കെടുത്ത പ്രാദേശിക നിവാസികൾ എന്നിവ ഉൾപ്പെടുന്നു.
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LocalNews;
