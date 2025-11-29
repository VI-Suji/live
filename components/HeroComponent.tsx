import React from "react";
import { FiArrowRight } from "react-icons/fi";

interface Props {
    onReadMore: () => void;
}

const Hero: React.FC<Props> = ({ onReadMore }) => {
    const [heroData, setHeroData] = React.useState({
        greeting: "നമസ്കാരം,",
        welcomeMessage: "ഗ്രാമിക ചാനലിലേക് നിങ്ങൾക് ഹൃദയം നിറഞ്ഞ സ്വാഗതം!",
        tagline: "ഗ്രാമിക — ഗ്രാമീണതയുടെ ഹൃദയതാളം.",
        description: "നമ്മുടെ നാട്ടിൻപുറങ്ങളുടെ നന്മയും നിഷ്‌കളങ്കതയും അടയാളപ്പെടുത്തുന്ന നിങ്ങളുടെ വിശ്വസനീയ വാർത്താ സ്രോതസ്സ്.",
        ctaButtonText: "View Stories"
    });

    React.useEffect(() => {
        const fetchHeroData = async () => {
            try {
                const res = await fetch('/api/sanity/heroContent');
                if (res.ok) {
                    const data = await res.json();
                    if (data && !data.error) {
                        setHeroData({
                            greeting: data.greeting || "നമസ്കാരം,",
                            welcomeMessage: data.welcomeMessage || "ഗ്രാമിക ചാനലിലേക് നിങ്ങൾക് ഹൃദയം നിറഞ്ഞ സ്വാഗതം!",
                            tagline: data.tagline || "ഗ്രാമിക — ഗ്രാമീണതയുടെ ഹൃദയതാളം.",
                            description: data.description || "നമ്മുടെ നാട്ടിൻപുറങ്ങളുടെ നന്മയും നിഷ്‌കളങ്കതയും അടയാളപ്പെടുത്തുന്ന നിങ്ങളുടെ വിശ്വസനീയ വാർത്താ സ്രോതസ്സ്.",
                            ctaButtonText: data.ctaButtonText || "View Stories"
                        });
                    }
                }
            } catch (error) {
                console.error("Error fetching hero content:", error);
            }
        };

        fetchHeroData();
    }, []);

    return (
        <div className="flex flex-col gap-6 sm:gap-8 w-full py-4 sm:py-8">
            {/* Text Content */}
            <div className="space-y-4 sm:space-y-6">
                <h2 className="text-4xl sm:text-6xl lg:text-8xl font-black text-gray-900 leading-none tracking-tighter sm:mt-0">
                    {heroData.greeting}
                </h2>
                <div className="space-y-3 sm:space-y-4">
                    <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 leading-relaxed max-w-2xl font-medium">
                        {heroData.welcomeMessage} <br className="hidden sm:block" />
                        <span className="text-gray-900 font-bold">{heroData.tagline}</span>
                    </p>
                    <p className="text-base sm:text-lg text-gray-500 leading-relaxed max-w-xl">
                        {heroData.description}
                    </p>
                </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 pt-2 sm:pt-4">
                <button
                    onClick={onReadMore}
                    className="group flex items-center justify-center gap-3 px-6 sm:px-8 py-3 sm:py-4 bg-gray-900 text-white rounded-2xl font-bold text-base sm:text-lg shadow-xl hover:bg-black hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 w-full sm:w-auto"
                >
                    {heroData.ctaButtonText}
                    <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                </button>

            </div>
        </div>
    );
};

export default Hero;
