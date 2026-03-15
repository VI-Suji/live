import React, { useEffect, useState, useRef } from "react";
import AdOne from "./AdFirstComponent";
import AdTwo from "./AdSecondComponent";
import BannerAd from "./BannerAdComponent";
import CategoryNews from "./CategoryNewsComponent";
import Obituaries from "./ObituariesComponent";
import LocalNews from "./LocalNewsComponent";
import VideoGallery from "./VideoGalleryComponent";
import Image from "next/image";

import LatestNewsComponent from "./LatestNewsComponent";

interface SidebarProps {
  siteSettings?: {
    advertisementsVisible: boolean;
    latestNewsVisible: boolean;
  };
}

const Sidebar: React.FC<SidebarProps> = ({ siteSettings }) => {
  const showAds = siteSettings?.advertisementsVisible ?? true;
  const showNews = siteSettings?.latestNewsVisible ?? true;

  return (
    <div className="flex flex-col items-start justify-start w-full lg:w-[35%] flex-shrink-0 gap-6">
      {showAds && <AdOne />}

      {/* Latest News Widget */}
      {showNews && (
        <div className="w-full sticky top-12 z-30">
          <LatestNewsComponent />
        </div>
      )}

      {showAds && <AdTwo />}


      {/* Local News Widget - Mobile Only */}
      <div id="local-news-mobile" className="w-full lg:hidden">
        <LocalNews />
      </div>

      {showAds && (
        <div className="w-full lg:hidden">
          <BannerAd />
        </div>
      )}

      <CategoryNews latestNewsVisible={showNews} />
      <VideoGallery />
      <Obituaries />
    </div>
  );
};

export default Sidebar;
