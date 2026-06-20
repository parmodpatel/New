import React, { useState } from 'react';
import VideoExperience from './VideoExperience';

/**
 * Example App Component
 * Demonstrates how to use the VideoExperience component
 */
export const App = () => {
  const [currentFrame, setCurrentFrame] = useState(0);
  const TOTAL_FRAMES = 150; // Adjust based on your frame count

  const handleFrameChange = (frame) => {
    setCurrentFrame(frame);
    // You can perform additional actions here
    console.log(`Frame changed to: ${frame + 1}`);
  };

  return (
    <div className="w-full h-screen">
      <VideoExperience
        totalFrames={TOTAL_FRAMES}
        frameFolder="/frames"
        showOverlay={true}
        showProgressBar={true}
        onFrameChange={handleFrameChange}
      />

      {/* Optional: Debug panel (remove in production) */}
      <div className="fixed top-20 right-4 bg-black bg-opacity-75 text-white p-4 rounded font-mono text-xs z-50 hidden lg:block max-w-xs">
        <div className="mb-2 font-bold text-blue-400">Debug Info</div>
        <div>Frame: {String(currentFrame + 1).padStart(4, '0')} / {String(TOTAL_FRAMES).padStart(4, '0')}</div>
        <div>Progress: {((currentFrame / (TOTAL_FRAMES - 1)) * 100).toFixed(1)}%</div>
        <div className="mt-2 text-gray-400 text-xs">
          📌 Ensure frames exist in public/frames/
        </div>
      </div>
    </div>
  );
};

export default App;
