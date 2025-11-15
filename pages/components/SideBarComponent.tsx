import React from "react";

const Sidebar = () => {
    return (
        <div className="flex flex-col items-center justify-center w-full lg:w-1/4 h-full gap-6 px-0 sm:px-4 lg:px-8">
            {/* Image / Video Block */}
            <div className="w-full relative rounded-xl shadow-lg overflow-hidden bg-black flex items-center justify-center text-gray-400 font-bold text-lg aspect-video">
                Image/Thumbnail
                <div className="absolute inset-0 flex items-center justify-center bg-gray-800 text-white">
                    This is an ad section can be rented
                </div>
            </div>
            {/* News Card */}
            <div className="flex flex-col justify-start w-full bg-white/10 backdrop-blur-2xl border border-white/20 rounded-2xl shadow-lg p-4 gap-4">
                {/* Header */}
                <div className="w-full flex justify-center">
                    <h3 className="bg-gradient-to-tr from-blue-200 to-purple-200 backdrop-blur-md rounded-xl py-4 px-4 text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 w-full text-center">
                        Latest News
                    </h3>
                </div>

                {/* Right-aligned Date */}
                <div className="w-full flex justify-end items-center gap-2">
                    <div className="relative w-10 h-8 bg-white/40 backdrop-blur-md rounded-full flex items-center justify-center text-gray-900 font-bold shadow transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
                        25
                        <div className="absolute top-0 left-0 w-full h-full rounded-full pointer-events-none bg-gradient-to-tr from-white/50 via-white/20 to-white/0 opacity-0 hover:opacity-30 animate-pulse"></div>
                    </div>
                    <div className="relative w-28 sm:w-32 h-8 bg-white/40 backdrop-blur-md rounded-full flex items-center justify-center text-gray-900 font-bold text-sm shadow p-2 transform transition-all duration-300 hover:scale-105 hover:shadow-lg overflow-hidden">
                        Oct 2025
                        <div className="absolute top-0 left-0 w-full h-full rounded-full pointer-events-none bg-gradient-to-r from-white/40 via-white/10 to-white/0 opacity-0 hover:opacity-30 animate-pulse"></div>
                    </div>
                </div>

                {/* Content Section */}
                <div className="w-full flex flex-col gap-2">
                    <h4 className="text-gray-900 font-bold text-lg sm:text-xl leading-snug line-clamp-3 p-2">
                        Breaking: Major Tech Innovations Unveiled at Annual Conference
                    </h4>
                    <hr className="border-black/20 my-1" />
                    <p className="text-gray-700 text-md sm:text-lg leading-relaxed p-2">
                        ഇവിടെ നമ്മൾ പങ്കുവെയ്ക്കുന്നത് നമ്മുടെ ഗ്രാമങ്ങളിലെ സംഭവങ്ങൾ, സംസ്കാരങ്ങൾ, കർഷകരുടെ ജീവിതരേഖകൾ, നാട്ടുവാർത്തകൾ, സാമൂഹിക വിഷയങ്ങൾ, പ്രാദേശിക വികസനങ്ങൾ എന്നിവയാണ്. ഗ്രാമിക ചാനൽ നിങ്ങളുടെ ശബ്ദമാണ് — നാട്ടിൻപുറങ്ങളുടെ സ്വരമായി, വിശ്വാസത്തോടെയും സത്യസന്ധതയോടെയും മുന്നോട്ട് പോകുന്ന മാധ്യമം 🌾📢
                    </p>
                </div>
            </div>

            {/* Image / Video Block */}
            <div className="w-full relative rounded-xl shadow-lg overflow-hidden bg-black flex items-center justify-center text-gray-400 font-bold text-lg aspect-video">
                Image/Thumbnail
                <div className="absolute inset-0 flex items-center justify-center bg-gray-800 text-white">
                    This is an ad section can be rented
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
