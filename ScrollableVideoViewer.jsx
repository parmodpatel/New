import React, { useMemo, useState, useEffect } from 'react';

/**
 * ScrollableVideoViewer Component
 * Renders frame images with scroll-based navigation
 * @param {number} currentFrame - Current frame index
 * @param {string} frameFolder - Path to frame images folder (e.g., '/frames')
 * @param {number} totalFrames - Total number of frames
 * @param {Object} mousePos - Mouse position for parallax effect
 * @param {Array} preloadedFrames - Array of preloaded frame indices
 * @param {React.RefObject} containerRef - Reference to container element
 */
export const ScrollableVideoViewer = ({
  currentFrame,
  frameFolder = '/frames',
  totalFrames,
  mousePos,
  preloadedFrames,
  containerRef,
  overlayContent = null,
}) => {
  const [imagePath, setImagePath] = useState('');
  const [imageLoaded, setImageLoaded] = useState(false);
  const [nextImageLoaded, setNextImageLoaded] = useState(false);

  // Generate frame image path
  const frameNumber = String(currentFrame + 1).padStart(4, '0');
  const currentImagePath = useMemo(
    () => `${frameFolder}/frame_${frameNumber}.jpg`,
    [frameFolder, frameNumber]
  );

  // Get next frame path for preloading
  const nextFrameNumber = String(Math.min(currentFrame + 1, totalFrames - 1) + 1).padStart(4, '0');
  const nextImagePath = useMemo(
    () => `${frameFolder}/frame_${nextFrameNumber}.jpg`,
    [frameFolder, nextFrameNumber]
  );

  // Update image path when frame changes
  useEffect(() => {
    setImagePath(currentImagePath);
    setImageLoaded(false);
  }, [currentImagePath]);

  // Handle image load
  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  // Handle image error
  const handleImageError = () => {
    console.error(`Failed to load image: ${imagePath}`);
    setImageLoaded(true); // Proceed anyway to prevent blocking
  };

  // Calculate parallax offset based on mouse position
  const parallaxX = (mousePos.x - 0.5) * 20; // -10px to 10px
  const parallaxY = (mousePos.y - 0.5) * 20; // -10px to 10px

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden bg-black"
    >
      {/* Main Image with parallax effect */}
      <div
        className="absolute inset-0 w-full h-full transition-transform duration-100 ease-out"
        style={{
          transform: `translate(${parallaxX}px, ${parallaxY}px) scale(1.05)`,
        }}
      >
        <img
          src={imagePath}
          alt={`Frame ${currentFrame + 1}`}
          className="w-full h-full object-cover"
          onLoad={handleImageLoad}
          onError={handleImageError}
          loading="lazy"
          decoding="async"
        />
      </div>

      {/* Loading indicator while image loads */}
      {!imageLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-pink-500 rounded-full animate-spin" />
        </div>
      )}

      {/* Preload images in background */}
      <div className="hidden">
        <img src={nextImagePath} onLoad={() => setNextImageLoaded(true)} alt="preload next" />
        {preloadedFrames.map((frame) => {
          const frameNum = String(frame + 1).padStart(4, '0');
          return (
            <img
              key={`preload-${frame}`}
              src={`${frameFolder}/frame_${frameNum}.jpg`}
              alt={`preload frame ${frame}`}
            />
          );
        })}
      </div>

      {/* Frame info display */}
      <div className="absolute top-4 left-4 text-white font-mono text-sm z-20 bg-black bg-opacity-50 px-3 py-2 rounded">
        <div>{String(currentFrame + 1).padStart(4, '0')} / {String(totalFrames).padStart(4, '0')}</div>
      </div>

      {/* Mouse parallax hint */}
      <div className="absolute top-4 right-4 text-gray-400 font-mono text-xs z-20 bg-black bg-opacity-50 px-3 py-2 rounded hidden md:block">
        <div>Move mouse for parallax</div>
      </div>

      {/* Smooth gradient overlay at top */}
      <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-black to-transparent pointer-events-none z-10" />

      {/* Smooth gradient overlay at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black to-transparent pointer-events-none z-10" />

      {/* Overlay content (text, etc.) */}
      {overlayContent && (
        <div className="absolute inset-0 pointer-events-none z-30">
          {overlayContent}
        </div>
      )}
    </div>
  );
};

export default ScrollableVideoViewer;
