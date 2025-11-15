import React, { useEffect, useState } from "react";
import AdOne from "./AdFirstComponent";
import AdTwo from "./AdSecondComponent";

interface NewsItem {
  date: string; // "2025-11-15"
  heading: string;
  content: string;
}

const Sidebar = () => {
  const [news, setNews] = useState<NewsItem | null>(null);

  useEffect(() => {
    fetch("/api/latestNews")
      .then((res) => res.json())
      .then((data) => {
        setNews(data);
      })
      .catch(console.error);
  }, []);

  // Loader component
  const renderLoader = () => (
    <div className="flex flex-col justify-start w-full bg-white/10 backdrop-blur-2xl border border-white/20 rounded-2xl shadow-lg p-4 gap-4 animate-pulse">
      {/* Header */}
      <div className="w-full flex justify-center">
        <div className="bg-gradient-to-tr from-white/20 via-white/10 to-white/20 backdrop-blur-md rounded-xl py-4 px-4 w-full h-16 sm:h-20 md:h-24"></div>
      </div>

      {/* Date placeholders */}
      <div className="w-full flex justify-end items-center gap-2">
        <div className="w-10 h-8 bg-white/20 backdrop-blur-md rounded-full shadow"></div>
        <div className="w-28 sm:w-32 h-8 bg-white/20 backdrop-blur-md rounded-full shadow"></div>
      </div>

      {/* Content placeholders */}
      <div className="w-full flex flex-col gap-2">
        <div className="h-6 bg-white/20 rounded w-3/4"></div>
        <div className="h-6 bg-white/20 rounded w-full"></div>
        <div className="h-6 bg-white/20 rounded w-5/6"></div>
        <div className="h-4 bg-white/20 rounded w-full"></div>
        <div className="h-4 bg-white/20 rounded w-11/12"></div>
      </div>
    </div>
  );

  let day: number | string = "";
  let month: string = "";
  let year: number | string = "";

  if (news?.date) {
    const dateObj = new Date(news.date);
    if (!isNaN(dateObj.getTime())) {
      day = dateObj.getDate();
      year = dateObj.getFullYear();
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      month = monthNames[dateObj.getMonth()];
    }
  }

  return (
    <div className="flex flex-col items-center justify-center w-full lg:w-1/4 h-full gap-6 px-0 sm:px-4 lg:px-8">
      <AdOne />

      {/* News Card or Loader */}
      {news ? (
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
              {day}
            </div>
            <div className="relative w-28 sm:w-32 h-8 bg-white/40 backdrop-blur-md rounded-full flex items-center justify-center text-gray-900 font-bold text-sm shadow p-2 transform transition-all duration-300 hover:scale-105 hover:shadow-lg overflow-hidden">
              {month} {year}
            </div>
          </div>

          {/* Content Section */}
          <div className="w-full flex flex-col gap-2">
            <h4 className="text-gray-900 font-bold text-lg sm:text-xl leading-snug line-clamp-3 p-2">
              {news.heading}
            </h4>
            <hr className="border-black/20 my-1" />
            <p className="text-gray-700 text-md sm:text-lg leading-relaxed p-2 whitespace-pre-line">
              {news.content}
            </p>
          </div>
        </div>
      ) : (
        renderLoader()
      )}

      <AdTwo />
    </div>
  );
};

export default Sidebar;
