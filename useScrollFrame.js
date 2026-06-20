import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Custom hook for managing scroll-driven frame navigation
 * Handles scroll events, frame updates, and performance optimizations
 */
export const useScrollFrame = (totalFrames = 100) => {
  const [currentFrame, setCurrentFrame] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);
  const scrollYRef = useRef(0);
  const lastFrameRef = useRef(0);
  const touchStartRef = useRef(null);
  const preloadedFramesRef = useRef(new Set([0]));
  const requestRef = useRef(null);

  // Calculate scroll sensitivity
  const SCROLL_SENSITIVITY = 30;

  // Handle mouse move for parallax effect
  const handleMouseMove = useCallback((e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePos({
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    });
  }, []);

  // Handle scroll with debouncing for performance
  const handleScroll = useCallback((e) => {
    if (!containerRef.current || totalFrames === 0) return;

    const scrollDelta = e.deltaY;
    const frameStep = Math.ceil(scrollDelta / SCROLL_SENSITIVITY);

    setCurrentFrame((prev) => {
      const newFrame = Math.max(0, Math.min(totalFrames - 1, prev + frameStep));
      lastFrameRef.current = newFrame;

      // Preload nearby frames
      const framesToPreload = [
        newFrame - 2,
        newFrame - 1,
        newFrame,
        newFrame + 1,
        newFrame + 2,
      ].filter((f) => f >= 0 && f < totalFrames);

      framesToPreload.forEach((frame) => {
        preloadedFramesRef.current.add(frame);
      });

      return newFrame;
    });

    // Calculate and update scroll progress
    const progress = totalFrames > 1 ? lastFrameRef.current / (totalFrames - 1) : 0;
    setScrollProgress(progress);

    e.preventDefault();
  }, [totalFrames]);

  // Handle touch for mobile devices
  const handleTouchStart = useCallback((e) => {
    touchStartRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    };
  }, []);

  const handleTouchMove = useCallback((e) => {
    if (!touchStartRef.current || totalFrames === 0) return;

    const touchCurrent = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    };

    const diffY = touchStartRef.current.y - touchCurrent.y;
    const frameStep = Math.ceil(diffY / SCROLL_SENSITIVITY);

    if (Math.abs(frameStep) > 0) {
      setCurrentFrame((prev) => {
        const newFrame = Math.max(0, Math.min(totalFrames - 1, prev + frameStep));
        lastFrameRef.current = newFrame;
        return newFrame;
      });

      const progress = totalFrames > 1 ? lastFrameRef.current / (totalFrames - 1) : 0;
      setScrollProgress(progress);

      touchStartRef.current = touchCurrent;
      e.preventDefault();
    }
  }, [totalFrames]);

  // Attach scroll and touch event listeners
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('wheel', handleScroll, { passive: false });
    container.addEventListener('touchstart', handleTouchStart, { passive: false });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('mousemove', handleMouseMove);

    return () => {
      container.removeEventListener('wheel', handleScroll);
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('mousemove', handleMouseMove);
    };
  }, [handleScroll, handleTouchStart, handleTouchMove, handleMouseMove]);

  // Cleanup animation frame on unmount
  useEffect(() => {
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, []);

  return {
    containerRef,
    currentFrame,
    setCurrentFrame,
    scrollProgress,
    mousePos,
    preloadedFrames: Array.from(preloadedFramesRef.current),
    totalFrames,
  };
};
