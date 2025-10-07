import React from 'react';

interface YouTubeLiveStreamProps {
  channelId: string;
}

const YouTubeLiveStream: React.FC<YouTubeLiveStreamProps> = ({ channelId }) => {
  return (
    <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
      <iframe
        src={`https://www.youtube.com/embed/live_stream?channel=${channelId}&autoplay=1`}
        frameBorder="0"
        allow="autoplay; encrypted-media"
        allowFullScreen
        title="YouTube Live Stream"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
        }}
      />
    </div>
  );
};

export default YouTubeLiveStream;
