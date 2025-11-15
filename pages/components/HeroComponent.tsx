import React from "react";
import { FiArrowRight } from "react-icons/fi";

interface Props {
    onReadMore: () => void;
}

const Hero: React.FC<Props> = ({ onReadMore }) => {
    return (
        <div className="flex flex-col gap-6 w-full">
            <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight">
                നമസ്കാരം,
            </h2>
            <p className="text-gray-700 text-lg sm:text-xl">
                ഗ്രാമിക ചാനലിലേക് നിങ്ങൾക് ഹൃദയം നിറഞ്ഞ സ്വാഗതം! ഗ്രാമിക — ഗ്രാമീണതയുടെ ഹൃദയതാളം, നമ്മുടെ നാട്ടിൻപുറങ്ങളുടെ നന്മയും നിഷ്‌കളങ്കതയും അടയാളപ്പെടുത്തുന്ന നിങ്ങളുടെ വിശ്വസനീയ വാർത്താ സ്രോതസ്സ്.
            </p>

            <button
                onClick={onReadMore}
                className="flex items-center gap-2 px-5 py-3 bg-gradient-to-br from-blue-400 to-purple-500 hover:from-blue-500 hover:to-purple-600 shadow-md hover:shadow-lg rounded-full hover:rounded-xl active:rounded-md transition-all duration-300 ease-in-out active:scale-95 text-white font-semibold w-max"
            >
                Read More
                <FiArrowRight className="text-lg" />
            </button>
        </div>
    );
};

export default Hero;
