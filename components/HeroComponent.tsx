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
        greeting: "GRAMIKA",
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
        <div className="w-full bg-white rounded-[2.5rem] sm:rounded-[3.5rem] shadow-2xl shadow-blue-100/30 border border-gray-100 overflow-hidden">
            <div className="flex flex-col lg:flex-row items-stretch">
                {/* Main Content Area */}
                <div className={`flex-1 p-8 sm:p-12 lg:p-14 flex flex-col gap-8 ${!showLive ? 'lg:pr-14 justify-center' : ''}`}>
                    <div className="space-y-6">
                        <div className="space-y-4">
                            <h1 className="text-5xl sm:text-7xl font-black text-gray-900 leading-[0.9] tracking-tighter">
                                {heroData.greeting}
                            </h1>
                            <p className="text-xl sm:text-2xl text-gray-600 font-bold leading-tight">
                                {heroData.welcomeMessage}
                            </p>
                            <p className="text-gray-900 font-bold text-lg">
                                {heroData.tagline}
                            </p>
                        </div>

                        <p className="text-gray-500 text-sm sm:text-base max-w-xl leading-relaxed">
                            {heroData.description}
                        </p>
                    </div>

                    {/* LARGE LIVE SECTION (Instead of View Stories Button) */}
                    {showLive ? (
                        <div className="w-full relative group">
                            <div className="relative rounded-[2rem] overflow-hidden shadow-2xl shadow-blue-900/10 border-4 border-white aspect-video bg-gray-900 group-hover:shadow-3xl transition-all duration-500">
                                <LiveNow channelId="UCgkLuDaFGUrfljjp7cNtQcw" />

                                {/* Overlay Pulse */}
                                <div className="absolute top-4 left-4 z-30 flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">
                                    <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse shadow-[0_0_10px_rgba(220,38,38,0.8)]"></div>
                                    <span className="text-[10px] font-black text-white uppercase tracking-widest">Live Now</span>
                                </div>
                            </div>

                            {/* Decorative element behind player */}
                            <div className="absolute -inset-2 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-[2.5rem] -z-10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        </div>
                    ) : (
                        <div className="flex flex-col sm:flex-row items-center gap-6">
                            <button
                                onClick={onReadMore}
                                className="group flex items-center justify-center gap-3 px-8 py-4 bg-gray-900 text-white rounded-2xl font-bold text-base shadow-xl hover:bg-black hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 w-full sm:w-auto"
                            >
                                {heroData.ctaButtonText}
                                <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    )}

                </div>

                {/* Socials Sidebar (Integrated into Hero) */}
                <div className="lg:w-[320px] bg-gray-50/50 border-t lg:border-t-0 lg:border-l border-gray-100 p-6 lg:p-10 flex flex-col gap-4 lg:gap-6 justify-center">
                    <div className="grid grid-cols-4 lg:grid-cols-1 gap-3 lg:gap-4">
                        {socialItems.map((social) => (
                            <a
                                key={social.id}
                                href={social.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex flex-col lg:flex-row items-center gap-2 lg:gap-4 bg-white p-2.5 lg:p-4 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-100 transition-all duration-300"
                            >
                                <div className={`w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-gradient-to-br ${social.gradient} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}>
                                    <div className="text-sm lg:text-xl">
                                        {social.icon}
                                    </div>
                                </div>
                                <div className="flex-1 min-w-0 hidden lg:block">
                                    <h4 className="font-bold text-gray-900 text-sm">{social.title}</h4>
                                    <p className="text-[10px] text-gray-400 font-medium truncate">{social.subtitle}</p>
                                </div>
                                <FaArrowRight className="text-gray-300 text-xs group-hover:text-blue-500 transition-colors hidden lg:block" />
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Hero;
