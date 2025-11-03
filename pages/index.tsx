import React from 'react';
import YouTubeLiveStream from './YouTubeLiveStream';
import Header from './Header';
import MainArea from './Main';

export default function Home() {
  // const channelId = 'UCup3etEdjyF1L3sRbU-rKLw';
  // return (
  //   <div>
  //     <h1>Live from Our YouTube Channel</h1>
  //     <YouTubeLiveStream channelId={channelId} />
  //   </div>
  // );

  return (
    <div className='bg-[#f8f8f8]'>
      <Header />
      <MainArea />
    </div>
  )
}
