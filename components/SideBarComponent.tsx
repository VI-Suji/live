import React, { useEffect, useState } from "react";
import AdOne from "./AdFirstComponent";
import AdTwo from "./AdSecondComponent";
import BannerAd from "./BannerAdComponent";
import DoctorsAvailable from "./DoctorsAvailableComponent";
import Obituaries from "./ObituariesComponent";
import LocalNews from "./LocalNewsComponent";

interface NewsItem {
  date: string; // "2025-11-15"
  heading: string;
  content: string;
}

interface SidebarProps {
  siteSettings?: {
    advertisementsVisible: boolean;
    latestNewsVisible: boolean;
  };
}

const Sidebar: React.FC<SidebarProps> = ({ siteSettings }) => {
  const [news, setNews] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/sanity/latestNews")
      .then((res) => res.json())
      .then((data) => {
        if (!data.error) {
          setNews(data);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Loader component
  const renderLoader = () => (
    <div className="flex flex-col justify-start w-full bg-white rounded-3xl shadow-xl border border-gray-100 p-6 gap-6 animate-pulse">
      {/* Header */}
      <div className="w-full flex justify-between items-center border-b border-gray-100 pb-6">
        <div className="h-8 bg-gray-200 rounded-lg w-1/3"></div>
        <div className="h-3 w-3 bg-red-200 rounded-full"></div>
      </div>

      {/* Content placeholders */}
      <div className="w-full flex flex-col gap-4">
        <div className="flex gap-4">
          <div className="w-16 h-16 bg-gray-200 rounded-2xl flex-shrink-0"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
          </div>
        </div>
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

  // Default to true if settings aren't provided yet
  const showAds = siteSettings?.advertisementsVisible ?? true;
  const showNews = siteSettings?.latestNewsVisible ?? true;

  return (
    <div className="flex flex-col items-center justify-start w-full lg:w-[35%] h-full gap-8 mt-8 lg:mt-0">
      {showAds && <AdOne />}



      {/* Latest News Widget - Now Second */}
      {showNews && (
        <div className="w-full bg-white rounded-3xl shadow-xl shadow-gray-100/50 border border-gray-100 overflow-hidden sticky top-24 z-30">
          <div className="p-6 border-b border-gray-50 bg-gray-50/50 flex justify-between items-center">
            <h3 className="font-black text-xl text-gray-900">Latest News</h3>
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
          </div>

          {loading ? (
            renderLoader()
          ) : news ? (
            <div className="p-6 flex flex-col gap-6">
              <div className="flex flex-col md:flex-row items-start gap-4">
                {/* Mobile Date - Full Width */}
                <div className="md:hidden w-1/2 self-end bg-blue-50/50 rounded-xl px-4 py-2 text-blue-600 font-bold text-center text-sm uppercase tracking-wide">
                  {day} {month} {year}
                </div>

                {/* Desktop Date - Box */}
                <div className="hidden md:flex flex-shrink-0 flex-col items-center justify-center w-16 h-16 bg-blue-50 rounded-2xl text-blue-600">
                  <span className="text-xl font-black">{day}</span>
                  <span className="text-xs font-bold uppercase">{month}</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900 text-lg leading-tight mb-2">
                    {news.heading}
                  </h4>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    {news.content}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6 text-center text-gray-500">
              No latest news available
            </div>
          )}
        </div>
      )}



      {showAds && <AdTwo />}

      {/* Local News Widget - Mobile Only (Swapped with Latest News) */}
      <div id="local-news-mobile" className="w-full lg:hidden">
        <LocalNews />
      </div>

      {/* Banner Ad - Between Local News and Doctors - Mobile Only */}
      {showAds && (
        <div className="w-full lg:hidden">
          <BannerAd />
        </div>
      )}

      <DoctorsAvailable />
      <Obituaries />
    </div>
  );
};

export default Sidebar;
