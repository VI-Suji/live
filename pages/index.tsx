import React from "react";
import Header from "../components/HeaderComponent";
import MainSection from "../components/MainSection";
import Meta from "../components/Meta";

export default function Home() {
  return (
    <div className="page-bg min-h-screen">
      <Meta />
      <Header />
      <MainSection />
    </div>
  );
}
