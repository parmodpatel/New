import React, { useEffect, useState, useRef } from 'react';

interface ScrollableVideoViewerProps {
  currentFrame: number;
  setCurrentFrame: (frame: number) => void;
  totalFrames: number;
  framesPath?: string;
}

export const ScrollableVideoViewer: React.FC<ScrollableVideoViewerProps> = ({
  framesPath = '/frames',
  totalFrames = 300,
}) => {
  const [zoom] = useState(1);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const getScrollText = () => {
    const progress = (currentFrame / totalFrames) * 100;
    if (progress < 25) return '🎬 Starting...';
    if (progress < 50) return '▶️ Building up...';
    if (progress < 75) return '⚡ Getting intense...';
    return '🔥 Climax!';
  };

  // Handle scroll for zoom
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      let newFrame = currentFrame;

      if (e.deltaY > 0) {
        if (currentFrame < totalFrames - 1) {
          e.preventDefault(); 
          newFrame = currentFrame + 1;
        }
      } else {
        if (currentFrame > 0) {
          e.preventDefault();
          newFrame = currentFrame - 1;
        }
      }

      setCurrentFrame(newFrame);
      setIsScrolling(true);

      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      scrollTimeoutRef.current = setTimeout(() => {
        setIsScrolling(false);
      }, 2000);
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
      return () => container.removeEventListener('wheel', handleWheel);
    }
  }, [currentFrame, totalFrames]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const percentX = (mouseX - centerX) / centerX;
      const percentY = (mouseY - centerY) / centerY;

      setOffsetX(percentX * (zoom - 1) * 20);
      setOffsetY(percentY * (zoom - 1) * 20);
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      return () => container.removeEventListener('mousemove', handleMouseMove);
    }
  }, [zoom]);

  const framePath = `${framesPath}/frame_${String(currentFrame + 1).padStart(4, '0')}.png`;

  return (
    <div
      ref={containerRef}
      className="w-screen h-screen bg-black text-white flex flex-col items-center justify-center overflow-hidden"
      style={{ cursor: 'crosshair' }}
    >
      <div
        className="relative w-full h-full flex items-center justify-center overflow-hidden"
        style={{
          perspective: '1000px',
        }}
      >
        <img
          src={framePath}
          alt={`Frame ${currentFrame + 1}`}
          className="transition-transform duration-100 ease-out"
          style={{
            transform: `scale(${zoom}) translate(${offsetX}px, ${offsetY}px)`,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
          loading="lazy"
        />
        <div className="absolute inset-0 z-20 flex items-center justify-center p-6 pointer-events-none">
          <div className={`text-center transition-all duration-300 ${isScrolling ? 'scale-105 opacity-100' : 'opacity-90'}`}>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              {getScrollText()}
            </h1>
            <p className="mt-3 text-gray-300 text-lg font-semibold">
              Frame {currentFrame + 1} / {totalFrames}
            </p>
          </div>
        </div>
      </div>
      
    </div>
  );
};
