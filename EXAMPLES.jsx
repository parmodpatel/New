// Example advanced usage patterns for VideoExperience component

import React, { useState, useCallback, useEffect } from 'react';
import VideoExperience from './VideoExperience';

/**
 * Example 1: Analytics Tracking
 */
export const VideoWithAnalytics = () => {
  const handleFrameChange = useCallback((frame) => {
    // Track frame views
    console.log(`User viewed frame ${frame + 1}`);
    
    // Send to analytics service
    if (window.gtag) {
      window.gtag('event', 'frame_viewed', {
        frame_number: frame + 1,
        timestamp: new Date().toISOString(),
      });
    }
  }, []);

  return (
    <VideoExperience
      totalFrames={150}
      frameFolder="/frames"
      onFrameChange={handleFrameChange}
    />
  );
};

/**
 * Example 2: Interactive Waypoints
 */
export const VideoWithWaypoints = () => {
  const WAYPOINTS = {
    intro: { frame: 0, action: () => console.log('Intro started') },
    climax: { frame: 75, action: () => console.log('Climax reached') },
    outro: { frame: 150, action: () => console.log('Outro started') },
  };

  const [triggeredWaypoints, setTriggeredWaypoints] = useState(new Set());

  const handleFrameChange = useCallback((frame) => {
    Object.entries(WAYPOINTS).forEach(([key, waypoint]) => {
      if (
        frame >= waypoint.frame &&
        !triggeredWaypoints.has(key)
      ) {
        waypoint.action();
        setTriggeredWaypoints((prev) => new Set([...prev, key]));
      }
    });
  }, [triggeredWaypoints]);

  return (
    <VideoExperience
      totalFrames={150}
      frameFolder="/frames"
      onFrameChange={handleFrameChange}
    />
  );
};

/**
 * Example 3: Programmatic Control with External Controls
 */
export const VideoWithControls = () => {
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const totalFrames = 150;

  // Auto-play effect
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setCurrentFrame((prev) =>
        prev < totalFrames - 1 ? prev + 1 : 0
      );
    }, 100); // 10fps playback

    return () => clearInterval(interval);
  }, [isPlaying, totalFrames]);

  const handleReset = () => {
    setCurrentFrame(0);
    setIsPlaying(false);
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="w-full h-screen bg-black">
      <VideoExperience
        totalFrames={totalFrames}
        frameFolder="/frames"
        onFrameChange={setCurrentFrame}
      />

      {/* Custom Controls */}
      <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 z-50 bg-black bg-opacity-75 px-6 py-3 rounded-lg flex gap-4">
        <button
          onClick={handleReset}
          className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded transition-colors"
        >
          Reset
        </button>
        <button
          onClick={handlePlayPause}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded transition-colors font-semibold"
        >
          {isPlaying ? 'Pause' : 'Play'}
        </button>
        <div className="px-4 py-2 text-white font-mono text-sm">
          {String(currentFrame + 1).padStart(4, '0')} / {String(totalFrames).padStart(4, '0')}
        </div>
      </div>
    </div>
  );
};

/**
 * Example 4: Multi-Video Experience
 */
export const MultiVideoExperience = () => {
  const [activeVideo, setActiveVideo] = useState('main');

  const videos = {
    main: { frames: 150, folder: '/frames/main' },
    alternate: { frames: 120, folder: '/frames/alternate' },
  };

  return (
    <div className="w-full h-screen">
      <VideoExperience
        key={activeVideo}
        totalFrames={videos[activeVideo].frames}
        frameFolder={videos[activeVideo].folder}
      />

      {/* Video Selector */}
      <div className="fixed top-4 left-4 z-50 bg-black bg-opacity-75 px-4 py-3 rounded">
        {Object.keys(videos).map((key) => (
          <button
            key={key}
            onClick={() => setActiveVideo(key)}
            className={`px-4 py-2 rounded mr-2 transition-colors ${
              activeVideo === key
                ? 'bg-blue-600 text-white'
                : 'bg-gray-600 hover:bg-gray-700 text-white'
            }`}
          >
            {key.charAt(0).toUpperCase() + key.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
};

/**
 * Example 5: Frame-Locked Sections (Pause scrolling at waypoints)
 */
export const VideoWithLocks = () => {
  const [lockedFrame, setLockedFrame] = useState(null);
  
  const LOCKED_SECTIONS = {
    intro: { start: 0, end: 20, duration: 3000 }, // 3 second pause
    climax: { start: 75, end: 85, duration: 5000 }, // 5 second pause
  };

  const handleFrameChange = useCallback((frame) => {
    Object.entries(LOCKED_SECTIONS).forEach(([key, section]) => {
      if (frame >= section.start && frame <= section.end && !lockedFrame) {
        setLockedFrame(section);
        setTimeout(() => setLockedFrame(null), section.duration);
      }
    });
  }, [lockedFrame]);

  return (
    <div className="relative w-full h-screen">
      <VideoExperience
        totalFrames={150}
        frameFolder="/frames"
        onFrameChange={handleFrameChange}
      />
      
      {lockedFrame && (
        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="text-white text-center">
            <p className="text-xl mb-2">⏸ Pause</p>
            <div className="w-24 h-1 bg-gray-600 rounded overflow-hidden">
              <div
                className="h-full bg-blue-600 animate-pulse"
                style={{
                  animation: `progress 3s linear`,
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * Example 6: Chapter Navigation
 */
export const VideoWithChapters = () => {
  const CHAPTERS = [
    { name: 'Introduction', start: 0, color: 'blue' },
    { name: 'Build-up', start: 40, color: 'purple' },
    { name: 'Climax', start: 80, color: 'red' },
    { name: 'Resolution', start: 120, color: 'green' },
  ];

  const [currentFrame, setCurrentFrame] = useState(0);

  const getCurrentChapter = useCallback(() => {
    return CHAPTERS.reduce((current, chapter) => {
      return currentFrame >= chapter.start ? chapter : current;
    }, CHAPTERS[0]);
  }, [currentFrame]);

  const jumpToChapter = (startFrame) => {
    setCurrentFrame(startFrame);
  };

  const currentChapter = getCurrentChapter();

  return (
    <div className="w-full h-screen">
      <VideoExperience
        totalFrames={150}
        frameFolder="/frames"
        onFrameChange={setCurrentFrame}
      />

      {/* Chapter Navigator */}
      <div className="fixed left-4 top-1/2 transform -translate-y-1/2 z-50 bg-black bg-opacity-75 px-4 py-6 rounded">
        <p className="text-white font-bold mb-4 text-sm">Chapters</p>
        {CHAPTERS.map((chapter, i) => (
          <button
            key={i}
            onClick={() => jumpToChapter(chapter.start)}
            className={`block w-48 text-left px-3 py-2 rounded mb-2 transition-colors ${
              currentChapter.name === chapter.name
                ? 'bg-blue-600 text-white'
                : 'bg-gray-600 hover:bg-gray-700 text-gray-100'
            } text-sm`}
          >
            {chapter.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default VideoWithAnalytics;
