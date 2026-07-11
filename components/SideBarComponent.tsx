import React from "react";
import AdOne from "./AdFirstComponent";
import CategoryNews from "./CategoryNewsComponent";
import Obituaries from "./ObituariesComponent";
import LocalNews from "./LocalNewsComponent";
import VideoGallery from "./VideoGalleryComponent";
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
    <div className="flex flex-col w-full lg:w-[38%] flex-shrink-0 gap-6 sm:gap-5 lg:gap-6">
      {showAds && <AdOne />}

      <div className="flex flex-col gap-6 lg:gap-6">
        {showNews && (
          <div className="w-full lg:sticky lg:top-24 lg:z-30">
            <LatestNewsComponent />
          </div>
        )}

        <div id="local-news-mobile" className="w-full lg:hidden pb-2">
          <LocalNews />
        </div>
      </div>

      <div className="w-full mt-8 lg:mt-0">
        <CategoryNews latestNewsVisible={showNews} />
      </div>
      <VideoGallery />
      <Obituaries />
    </div>
  );
};

export default Sidebar;
