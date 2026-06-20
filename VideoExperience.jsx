import React, { useEffect, useState } from 'react';
import { useScrollFrame } from './useScrollFrame';
import ScrollableVideoViewer from './ScrollableVideoViewer';
import OverlayText from './OverlayText';
import ProgressBar from './ProgressBar';

/**
 * VideoExperience Component
 * Main parent component managing scroll-driven video experience
 * 
 * @param {Object} props
 * @param {number} props.totalFrames - Total number of frames (default: 100)
 * @param {string} props.frameFolder - Path to frames folder (default: '/frames')
 * @param {boolean} props.showOverlay - Show text overlay (default: true)
 * @param {boolean} props.showProgressBar - Show progress bar (default: true)
 * @param {function} props.onFrameChange - Callback when frame changes
 */
export const VideoExperience = ({
  totalFrames = 100,
  frameFolder = '/frames',
  showOverlay = true,
  showProgressBar = true,
  onFrameChange = null,
}) => {
  const {
    containerRef,
    currentFrame,
    setCurrentFrame,
    scrollProgress,
    mousePos,
    preloadedFrames,
  } = useScrollFrame(totalFrames);

  const [isHydrated, setIsHydrated] = useState(false);

  // Handle hydration for server-side rendering
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Callback when frame changes
  useEffect(() => {
    if (onFrameChange) {
      onFrameChange(currentFrame);
    }
  }, [currentFrame, onFrameChange]);

  // Prevent body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  if (!isHydrated) {
    return null;
  }

  const showStartHint = scrollProgress < 0.05;

  return (
    <div className="w-full h-screen bg-black relative">
      {/* Main video viewer */}
      <ScrollableVideoViewer
        currentFrame={currentFrame}
        frameFolder={frameFolder}
        totalFrames={totalFrames}
        mousePos={mousePos}
        preloadedFrames={preloadedFrames}
        containerRef={containerRef}
        overlayContent={
          showOverlay ? (
            <OverlayText
              currentFrame={currentFrame}
              scrollProgress={scrollProgress}
              totalFrames={totalFrames}
            />
          ) : null
        }
      />

      {/* Start scrolling hint */}
      {showStartHint && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-40 pointer-events-none">
          <div 
            className="text-center animate-pulse transition-opacity duration-500"
            style={{ opacity: 1 - scrollProgress * 20 }}
          >
            <p className="text-white text-xl md:text-2xl font-light tracking-wider mb-8">
              Scroll to Begin
            </p>
            <div className="flex flex-col items-center gap-2 animate-bounce">
              <div className="w-1 h-8 bg-gradient-to-b from-white to-transparent rounded-full" />
            </div>
          </div>
        </div>
      )}

      {/* Progress bar */}
      {showProgressBar && <ProgressBar progress={scrollProgress} />}

      {/* Keyboard controls info */}
      <div className="fixed bottom-8 left-8 text-gray-500 text-xs font-mono z-20 bg-black bg-opacity-50 px-3 py-2 rounded hidden md:block">
        <div>↑ ↓ Scroll • Mouse Parallax</div>
        <div>Touch: Swipe • Mobile: Scroll</div>
      </div>
    </div>
  );
};

export default VideoExperience;
