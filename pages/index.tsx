import React from 'react';
import Header from '../components/HeaderComponent';
import MainSection from '../components/MainSection';
import Meta from '../components/Meta';

export default function Home() {
  return (
    <div className='bg-[#f8f8f8]'>
      <Meta />
      <Header />
      <MainSection />
    </div>
  )
}


