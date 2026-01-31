import React from "react";
import { socialItems } from "./SocialsComponent";
import LiveNow from "./LiveComponent";
import { FaArrowRight } from "react-icons/fa";

interface Props {
    onReadMore: () => void;
    showLive: boolean;
}

const Hero: React.FC<Props> = ({ onReadMore, showLive }) => {
    const [heroData, setHeroData] = React.useState({
        greeting: "GRAMIKA NEWS",
        welcomeMessage: "സ്വാഗതം ഗ്രാമികയിലേക്ക്",
        tagline: "ഗ്രാമിക — ഗ്രാമീണതയുടെ ഹൃദയതാളം.",
        description: "ഗ്രാമീണതയുടെ ഹൃദയതാളമായ ഗ്രാമിക ന്യൂസ് ചാനൽ അതിന്റെ വെബ്സൈറ്റ് കൂടി ആരംഭിച്ചിരിക്കുകയാണ്. വാര്‍ത്തകള്‍ എത്രയുംപെട്ടെന്നു നിങ്ങളുടെ വിരല്‍ത്തുമ്പിലെത്തിക്കാന്‍ ഞങ്ങള്‍ പ്രതിജ്ഞാബദ്ധമാണ്.",
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
                            greeting: (data.greeting === "GRAMIKA" ? "GRAMIKA NEWS" : data.greeting) || "GRAMIKA NEWS",
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
        <div className="w-full relative rounded-[2.5rem] sm:rounded-[3.5rem] overflow-hidden shadow-2xl shadow-gray-200 border border-white">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-gray-100" />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src="https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=2000&auto=format&fit=crop"
                    alt="Background"
                    className="w-full h-full object-cover"
                    loading="eager"
                />

                {/* Visual Overlay - Minimal gradient to ensure text readability only on the very left */}
                <div className="absolute inset-0 bg-gradient-to-r from-white/80 via-white/20 to-transparent z-10" />
                <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent sm:hidden z-10" />
            </div>

            <div className="relative z-20 flex flex-col lg:flex-row items-stretch h-auto lg:min-h-[500px]">
                {/* Main Content Area */}
                <div className={`flex-1 p-6 sm:p-12 lg:p-16 flex flex-col gap-6 lg:gap-8 justify-center ${!showLive ? 'lg:pr-14' : ''}`}>
                    <div className="space-y-4 lg:space-y-6 max-w-2xl">
                        {/* <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50/80 backdrop-blur-sm border border-blue-100 rounded-full w-fit">
                            <span className="w-2 h-2 rounded-full bg-blue-600" />
                            <span className="text-[10px] font-bold text-blue-900 uppercase tracking-widest">{heroData.welcomeMessage}</span>
                        </div> */}

                        <div className="space-y-3 lg:space-y-4">
                            <h1 className="text-4xl sm:text-7xl lg:text-8xl font-black text-gray-900 leading-[0.9] tracking-tighter drop-shadow-sm">
                                {heroData.greeting}
                                <span className="text-blue-600">.</span>
                            </h1>

                            {!showLive && (
                                <p className="text-gray-500 text-base sm:text-xl font-medium leading-relaxed max-w-lg">
                                    {heroData.tagline}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Mobile Socials - Swapped to be above Button */}
                    <div className="flex lg:hidden flex-row flex-wrap gap-4 items-center justify-center">
                        {socialItems.map((social) => (
                            <a
                                key={social.id}
                                href={social.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex items-center bg-transparent p-0 rounded-full hover:scale-110 transition-all duration-300"
                            >
                                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${social.gradient} flex items-center justify-center text-white shadow-lg group-hover:rotate-6 transition-transform`}>
                                    <div className="text-xl">
                                        {social.icon}
                                    </div>
                                </div>
                            </a>
                        ))}
                    </div>

                    {/* Content Section (Live or Button) */}
                    {showLive ? (
                        <div className="w-full">
                            <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-blue-900/20 border-4 border-white aspect-video bg-gray-900 max-w-2xl group">
                                <LiveNow channelId="UCgkLuDaFGUrfljjp7cNtQcw" />

                                <div className="absolute top-4 left-4 z-30 flex items-center gap-2 bg-red-600/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-lg">
                                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                                    <span className="text-[10px] font-black text-white uppercase tracking-widest">Live</span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col sm:flex-row items-center gap-4 lg:gap-6">
                            <button
                                onClick={onReadMore}
                                className="group flex items-center justify-center gap-3 px-8 py-3.5 lg:py-4 bg-gray-900 text-white rounded-2xl font-bold text-base shadow-xl hover:bg-blue-600 hover:shadow-blue-600/30 hover:-translate-y-1 transition-all duration-300 w-full sm:w-auto"
                            >
                                {heroData.ctaButtonText}
                                <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    )}
                </div>

                {/* Socials Sidebar - Hidden on mobile, shown on Desktop */}
                <div className="hidden lg:flex lg:w-[340px] px-6 pb-8 lg:p-12 flex-col justify-center gap-4 lg:gap-5 border-t lg:border-t-0 lg:border-l border-white/40 bg-white/20 backdrop-blur-sm">
                    <div className="hidden lg:block mb-2">
                        <h3 className="text-xs font-black text-gray-500 uppercase tracking-[0.2em] drop-shadow-sm">Socials</h3>
                    </div>

                    <div className="flex flex-row lg:flex-col flex-wrap gap-3 justify-center lg:justify-start items-center lg:items-stretch">
                        {socialItems.map((social) => (
                            <a
                                key={social.id}
                                href={social.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex items-center gap-3 lg:gap-4 bg-transparent lg:bg-white/90 lg:hover:bg-white p-0 lg:p-3 rounded-full lg:rounded-2xl lg:shadow-sm hover:scale-110 lg:hover:scale-[1.02] transition-all duration-300"
                            >
                                <div className={`w-10 h-10 lg:w-10 lg:h-10 rounded-full lg:rounded-xl bg-gradient-to-br ${social.gradient} flex items-center justify-center text-white shadow-lg lg:shadow-md group-hover:rotate-6 transition-transform`}>
                                    <div className="text-xl lg:text-lg">
                                        {social.icon}
                                    </div>
                                </div>
                                <div className="hidden lg:block">
                                    <h4 className="font-bold text-gray-900 text-sm">{social.title}</h4>
                                    <p className="text-[10px] text-gray-400 font-bold group-hover:text-blue-500 transition-colors">Connect</p>
                                </div>
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Hero;
