import React, { useMemo } from 'react';

/**
 * OverlayText Component
 * Displays dynamic text overlays with animations based on scroll progress
 * @param {number} currentFrame - Current frame index
 * @param {number} scrollProgress - Scroll progress from 0 to 1
 * @param {number} totalFrames - Total number of frames
 */
export const OverlayText = ({ currentFrame, scrollProgress, totalFrames }) => {
  // Define text stages based on scroll progress
  const textStages = useMemo(() => [
    {
      range: [0, 0.2],
      text: 'Start Your Journey',
      subtext: 'Scroll to explore',
      color: 'from-blue-400 to-cyan-400',
    },
    {
      range: [0.2, 0.4],
      text: 'Building Momentum',
      subtext: 'Keep scrolling',
      color: 'from-purple-400 to-blue-400',
    },
    {
      range: [0.4, 0.6],
      text: 'Reaching the Peak',
      subtext: 'Almost there',
      color: 'from-pink-400 to-purple-400',
    },
    {
      range: [0.6, 0.8],
      text: 'The Climax',
      subtext: 'The moment of truth',
      color: 'from-orange-400 to-pink-400',
    },
    {
      range: [0.8, 1.0],
      text: 'The Finale',
      subtext: 'Journey complete',
      color: 'from-red-400 to-orange-400',
    },
  ], []);

  // Find current text stage
  const currentStage = useMemo(() => {
    return textStages.find(
      (stage) => scrollProgress >= stage.range[0] && scrollProgress <= stage.range[1]
    ) || textStages[0];
  }, [scrollProgress, textStages]);

  // Calculate scale and opacity based on progress within current stage
  const stageProgress = useMemo(() => {
    const [start, end] = currentStage.range;
    return (scrollProgress - start) / (end - start);
  }, [scrollProgress, currentStage]);

  // Smooth animation values
  const scale = 0.8 + stageProgress * 0.4; // 0.8 to 1.2
  const opacity = Math.min(1, stageProgress * 2, (1 - stageProgress) * 2);
  const yOffset = (1 - stageProgress) * 20; // 20px at start, 0px at end

  return (
    <div className="flex items-center h-full pointer-events-none w-full">
      <div
        className="text-left transition-all duration-300 will-change-transform ml-12 md:ml-20 max-w-xl"
        style={{
          transform: `scale(${scale}) translateY(${yOffset}px)`,
          opacity: opacity,
        }}
      >
        {/* Main Title */}
        <h1
          className={`text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r ${currentStage.color} bg-clip-text text-transparent`}
        >
          {currentStage.text}
        </h1>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-gray-300 font-light tracking-wide mb-6">
          {currentStage.subtext}
        </p>

        {/* Frame Counter */}
        <div className="text-sm text-gray-400 font-mono">
          <span className="text-transparent bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text">
            Frame {String(currentFrame + 1).padStart(4, '0')} / {String(totalFrames).padStart(4, '0')}
          </span>
        </div>

        {/* Progress Indicator Circle */}
        <div className="mt-6 flex gap-2">
          {Array.from({ length: Math.min(10, totalFrames) }).map((_, i) => {
            const frameRange = totalFrames / 10;
            const isActive = currentFrame >= i * frameRange && currentFrame < (i + 1) * frameRange;
            return (
              <div
                key={i}
                className={`h-2 rounded-full transition-all duration-300 ${
                  isActive ? 'w-6 bg-gradient-to-r from-blue-500 to-purple-500' : 'w-2 bg-gray-600'
                }`}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default OverlayText;
