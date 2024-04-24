import React from 'react';

function YouTubeLiveStream() {
  return (
    <div>
      <iframe
        className='fpv-stream'
        src="https://www.youtube.com/embed/S_ZoW4rDo2o?si=IbRkUQzCNNgJZE35?autoplay=1"
        title="YouTube Live Stream"
        allow="autoplay; encrypted-media"
        allowFullScreen
      ></iframe>
    </div>
  );
};

export default YouTubeLiveStream;
