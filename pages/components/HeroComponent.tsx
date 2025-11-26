import React from "react";
import { FiArrowRight, FiPlay } from "react-icons/fi";

interface Props {
    onReadMore: () => void;
}

const Hero: React.FC<Props> = ({ onReadMore }) => {
    return (
        <div className="flex flex-col gap-8 w-full py-8 sm:py-2">
            {/* Badge */}
            {/* <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-gray-200 shadow-sm w-fit">
                <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-600"></span>
                </span>
                <span className="text-xs font-bold text-gray-900 tracking-wider uppercase">Live Updates</span>
            </div> */}

            {/* Text Content */}
            <div className="space-y-6">
                <h2 className="text-6xl sm:text-8xl font-black text-gray-900 leading-none tracking-tighter">
                    നമസ്കാരം,
                </h2>
                <div className="space-y-4">
                    <p className="text-xl sm:text-2xl text-gray-600 leading-relaxed max-w-2xl font-medium">
                        ഗ്രാമിക ചാനലിലേക് നിങ്ങൾക് ഹൃദയം നിറഞ്ഞ സ്വാഗതം! <br />
                        <span className="text-gray-900 font-bold">ഗ്രാമിക</span> — ഗ്രാമീണതയുടെ ഹൃദയതാളം.
                    </p>
                    <p className="text-gray-500 text-lg leading-relaxed max-w-xl">
                        നമ്മുടെ നാട്ടിൻപുറങ്ങളുടെ നന്മയും നിഷ്‌കളങ്കതയും അടയാളപ്പെടുത്തുന്ന നിങ്ങളുടെ വിശ്വസനീയ വാർത്താ സ്രോതസ്സ്.
                    </p>
                </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-wrap gap-4 pt-4">
                <button
                    onClick={onReadMore}
                    className="group flex items-center gap-3 px-8 py-4 bg-gray-900 text-white rounded-2xl font-bold text-lg shadow-xl hover:bg-black hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
                >
                    Start Reading
                    <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                    onClick={() => document.getElementById('live-section')?.scrollIntoView({ behavior: 'smooth' })}
                    className="group flex items-center gap-3 px-8 py-4 bg-white text-gray-900 border border-gray-200 rounded-2xl font-bold text-lg hover:bg-gray-50 hover:border-gray-300 transition-all duration-300"
                >
                    <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center group-hover:bg-red-100 transition-colors">
                        <FiPlay className="text-red-600 text-sm ml-0.5" />
                    </div>
                    Watch Live
                </button>
            </div>
        </div>
    );
};

export default Hero;
