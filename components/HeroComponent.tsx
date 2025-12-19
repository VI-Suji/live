import React from "react";
import { FiArrowRight } from "react-icons/fi";

interface Props {
    onReadMore: () => void;
}

const Hero: React.FC<Props> = ({ onReadMore }) => {
    const [heroData, setHeroData] = React.useState({
        greeting: "GRAMIKA",
        welcomeMessage: "സ്വാഗതം ഗ്രാമികയിലേക്ക്",
        tagline: "ഗ്രാമിക — ഗ്രാമീണതയുടെ ഹൃദയതാളം.",
        description: "ഗ്രാമീണതയുടെ ഹൃദയതാളമായ ഗ്രാമിക ന്യൂസ് ചാനല്‍ അതിന്റെ വെബ്സൈറ്റ് കൂടി ആരംഭിച്ചിരിക്കുകയാണ്. നാടിന്റെ കുതിപ്പിനും കിതപ്പിനുമൊപ്പം എന്നും കൈകോര്‍ത്തിട്ടുള്ള ഗ്രാമികയുടെ വെബ്സൈറ്റിനെയും നിങ്ങള്‍ രണ്ടുകൈയും നീട്ടി സ്വീകരിക്കുമെന്ന് ഞങ്ങള്‍ക്ക് ആത്മവിശ്വാസമുണ്ട്. നിങ്ങളുടെ വിശ്വാസവും ഞങ്ങളുടെ അര്‍പ്പണബോധവും തോളോടു തോള്‍ ചേർന്ന് ഇനുയുള്ള നാളുകള്‍ . വാര്‍ത്തകള്‍ എത്രയുംപെട്ടെന്നു നിങ്ങളുടെ വിരല്‍ത്തുമ്പിലെത്തിക്കാന്‍ ഞങ്ങള്‍ പ്രതിജ്ഞാബദ്ധമാണ്. വിശ്വസ്തയോടെ ഗ്രാമിക ന്യൂസ് ടീം",
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
                <h2 className="text-3xl sm:text-5xl lg:text-7xl font-black text-gray-900 leading-none tracking-tighter sm:mt-0">
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
                    className="group flex items-center justify-center gap-3 px-6 sm:px-8 py-3 sm:py-4 bg-gray-900 text-white rounded-2xl font-bold text-sm sm:text-base shadow-xl hover:bg-black hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 w-full sm:w-auto"
                >
                    {heroData.ctaButtonText}
                    <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                </button>

            </div>
        </div>
    );
};

export default Hero;
