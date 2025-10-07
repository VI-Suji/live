import React from 'react';
import YouTubeLiveStream from './YouTubeLiveStream';

export default function Home() {
  const channelId = 'UCup3etEdjyF1L3sRbU-rKLw';
  return (
    <div>
      <h1>Live from Our YouTube Channel</h1>
      <YouTubeLiveStream channelId={channelId} />
    </div>
  );
}
