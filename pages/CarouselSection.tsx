"use client";

import React, { useRef } from "react";
import { FaNewspaper, FaChevronLeft, FaChevronRight } from "react-icons/fa";

type Story = {
    id: number;
    title: string;
    img: string;
    text: string;
};

const stories: Story[] = [
    {
        id: 1,
        title: "Breaking News",
        img: "https://images.unsplash.com/photo-1602777926593-0043d8e0c805?w=1280&h=720&q=80&auto=format&fit=crop",
        text: "മലയാളം, തമിഴ്, കന്നഡ, തെലുങ്ക്, ഹിന്ദി സിനിമാ മേഖലകളിൽ പ്രശസ്തനായ ഒരു സംവിധായകൻ കലയരവിയാണ്. പുതിയ ചിത്രത്തിൽ ശ്രീലക്ഷ്മി അഭിനയിക്കുന്നു.",
    },
    {
        id: 2,
        title: "Latest Economic News",
        img: "https://images.unsplash.com/photo-1593642634315-48f5414c3ad9?w=1280&h=720&q=80&auto=format&fit=crop",
        text: "ഇന്ത്യയുടെ സാമ്പത്തിക വളർച്ചയുടെ റിപ്പോർട്ടിൽ അനുകൂല സൂചനകൾ. വിദേശ നിക്ഷേപങ്ങൾ ഉയർന്നതോടെ വിപണിയിൽ ആത്മവിശ്വാസം വർദ്ധിക്കുന്നു.",
    },
    {
        id: 3,
        title: "Global Highlights",
        img: "https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?w=1280&h=720&q=80&auto=format&fit=crop",
        text: "സിംഗപ്പൂരിന്റെ ഓഹരി വിപണിയിൽ ഉച്ചതിരിഞ്ഞ് ഇടിവ് രേഖപ്പെടുത്തി. എന്നാൽ വിദഗ്ധർ ഇത് താൽക്കാലികമാണെന്ന് വിലയിരുത്തുന്നു.",
    },
    {
        id: 4,
        title: "Live 24 News",
        img: "https://images.unsplash.com/photo-1581092334646-4f6c5a8eafc0?w=1280&h=720&q=80&auto=format&fit=crop",
        text: "വിപണിയിലെ മുൻനിര കമ്പനികളുടെ ഓഹരികൾ ഉയരുന്നു. വിദഗ്ധർ അടുത്ത ആഴ്ച വിപണിയിൽ കൂടുതൽ വളർച്ച പ്രതീക്ഷിക്കുന്നു.",
    },
    {
        id: 5,
        title: "Global Highlights",
        img: "https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?w=1280&h=720&q=80&auto=format&fit=crop",
        text: "സിംഗപ്പൂരിന്റെ ഓഹരി വിപണിയിൽ ഉച്ചതിരിഞ്ഞ് ഇടിവ് രേഖപ്പെടുത്തി. എന്നാൽ വിദഗ്ധർ ഇത് താൽക്കാലികമാണെന്ന് വിലയിരുത്തുന്നു.",
    },
];

export default function CarouselSection() {
    const containerRef = useRef<HTMLDivElement | null>(null);

    function scrollNext() {
        const el = containerRef.current;
        if (!el) return;
        const scrollAmount =
            window.innerWidth >= 1024 ? el.clientWidth / 4 : el.clientWidth;
        el.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }

    function scrollPrev() {
        const el = containerRef.current;
        if (!el) return;
        const scrollAmount =
            window.innerWidth >= 1024 ? el.clientWidth / 4 : el.clientWidth;
        el.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    }

    return (
        <>
            <style>{`
        /* Hide scrollbar for Chrome, Safari and Opera */
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        /* Hide scrollbar for IE, Edge and Firefox */
        .no-scrollbar {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
      `}</style>
            <div className="w-11/12 md:w-5/6 mx-auto flex flex-col gap-6">
                {/* Carousel Wrapper */}
                <div className="relative">
                    {/* Prev Button */}
                    <button
                        onClick={scrollPrev}
                        aria-label="Previous"
                        className="hidden md:flex items-center justify-center absolute left-0 top-1/2 -translate-y-1/2 z-40 w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 text-black shadow-md transition-all duration-200"
                    >
                        <FaChevronLeft />
                    </button>

                    {/* Scrollable Container */}
                    <div
                        ref={containerRef}
                        className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth gap-4 no-scrollbar pb-4"
                        style={{ WebkitOverflowScrolling: "touch" }}
                    >
                        {stories.map((story) => (
                            <article
                                key={story.id}
                                className="snap-start flex-shrink-0 w-[90%] sm:w-[85%] md:w-1/2 lg:w-1/3 bg-[#f8f8f8] text-gray-900 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300"
                            >
                                {/* Image */}
                                <div className="aspect-[16/9] w-full">
                                    <img
                                        src={story.img}
                                        alt={story.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                {/* Content */}
                                <div className="p-5 flex flex-col justify-between min-h-[260px]">
                                    <div className="flex items-center gap-2 text-red-600 mb-2">
                                        <FaNewspaper className="text-lg" />
                                        <h3 className="text-xl sm:text-2xl font-extrabold uppercase tracking-tight">
                                            {story.title}
                                        </h3>
                                    </div>

                                    <p className="text-[15px] sm:text-[16px] leading-relaxed text-gray-800">
                                        {story.text}
                                    </p>

                                    <a
                                        href="#"
                                        className="mt-4 text-sm sm:text-md font-semibold text-red-600 hover:underline flex items-center gap-1"
                                    >
                                        Read More...
                                        <FaChevronRight className="text-xs" />
                                    </a>
                                </div>
                            </article>
                        ))}
                    </div>

                    {/* Next Button */}
                    <button
                        onClick={scrollNext}
                        aria-label="Next"
                        className="hidden md:flex items-center justify-center absolute right-0 top-1/2 -translate-y-1/2 z-40 w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 text-black shadow-md transition-all duration-200"
                    >
                        <FaChevronRight />
                    </button>
                </div>

                {/* View More Button */}
                <div className="flex justify-center m-6">
                    {/* <button
                        className="flex items-center gap-2 px-10 py-3 bg-gradient-to-br from-blue-300 to-purple-200 
             hover:from-blue-400 hover:to-purple-300 shadow-md hover:shadow-lg 
             rounded-full hover:rounded-xl active:rounded-md 
             transition-all duration-100 ease-linear active:scale-95 text-gray-900 font-bold text-lg"
                    >
                        View More
                        <FaChevronRight className="text-lg transition-transform duration-100 ease-linear group-hover:translate-x-1" />
                    </button> */}
                </div>
            </div>
        </>
    );
}
