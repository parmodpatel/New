import React from 'react';

/**
 * Advanced Hook: useFramePreloader
 * Intelligently preloads frames based on scroll velocity
 */
export const useFramePreloader = (currentFrame, totalFrames, preloadDistance = 5) => {
  const [preloadedFrames, setPreloadedFrames] = React.useState(new Set());
  const velocityRef = React.useRef(0);
  const lastFrameRef = React.useRef(currentFrame);

  React.useEffect(() => {
    // Calculate velocity (frames per update)
    velocityRef.current = Math.abs(currentFrame - lastFrameRef.current);
    lastFrameRef.current = currentFrame;

    // Calculate preload distance based on velocity
    const dynamicDistance = Math.max(2, preloadDistance * (1 + velocityRef.current));

    // Generate frames to preload
    const framesToPreload = new Set();
    for (let i = currentFrame - dynamicDistance; i <= currentFrame + dynamicDistance; i++) {
      if (i >= 0 && i < totalFrames) {
        framesToPreload.add(i);
      }
    }

    setPreloadedFrames(framesToPreload);
  }, [currentFrame, totalFrames, preloadDistance]);

  return preloadedFrames;
};

/**
 * Advanced Hook: useKeyboardControls
 * Add keyboard shortcuts for frame navigation
 */
export const useKeyboardControls = (onFrameChange, totalFrames) => {
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        onFrameChange((prev) => Math.min(prev + 1, totalFrames - 1));
        e.preventDefault();
      } else if (e.key === 'ArrowLeft') {
        onFrameChange((prev) => Math.max(prev - 1, 0));
        e.preventDefault();
      } else if (e.key === 'Home') {
        onFrameChange(0);
        e.preventDefault();
      } else if (e.key === 'End') {
        onFrameChange(totalFrames - 1);
        e.preventDefault();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onFrameChange, totalFrames]);
};

/**
 * Advanced Hook: useFrameInterpolation
 * Interpolate between frames for smoother animation
 */
export const useFrameInterpolation = (currentFrame, interpolationFactor = 0.1) => {
  const [interpolatedFrame, setInterpolatedFrame] = React.useState(currentFrame);
  const animationFrameRef = React.useRef(null);

  React.useEffect(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    const animate = () => {
      setInterpolatedFrame((prev) => {
        const diff = currentFrame - prev;
        const newFrame = prev + diff * interpolationFactor;
        
        if (Math.abs(diff) > 0.1) {
          animationFrameRef.current = requestAnimationFrame(animate);
        }
        return newFrame;
      });
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [currentFrame, interpolationFactor]);

  return interpolatedFrame;
};

/**
 * Advanced Hook: useIntersectionObserver
 * Detect when video container enters/exits viewport
 */
export const useIntersectionObserver = (ref, callback, options = {}) => {
  React.useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        callback(entry.isIntersecting);
      });
    }, {
      threshold: 0.5,
      ...options,
    });

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [ref, callback, options]);
};

/**
 * Advanced Hook: useResizeObserver
 * Monitor container size changes
 */
export const useResizeObserver = (ref, callback) => {
  React.useEffect(() => {
    if (!ref.current) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        callback({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        });
      }
    });

    observer.observe(ref.current);

    return () => observer.disconnect();
  }, [ref, callback]);
};

/**
 * Advanced Hook: usePerformanceMonitoring
 * Monitor performance metrics
 */
export const usePerformanceMonitoring = (videoRef) => {
  const [metrics, setMetrics] = React.useState({
    fps: 0,
    frameTime: 0,
    memoryUsage: 0,
  });

  React.useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    let animationId;

    const measurePerformance = () => {
      frameCount++;
      const now = performance.now();
      const delta = now - lastTime;

      if (delta >= 1000) {
        const fps = Math.round((frameCount * 1000) / delta);
        const frameTime = delta / frameCount;

        setMetrics((prev) => ({
          ...prev,
          fps,
          frameTime: Math.round(frameTime * 100) / 100,
        }));

        frameCount = 0;
        lastTime = now;
      }

      // Get memory usage if available
      if (performance.memory) {
        setMetrics((prev) => ({
          ...prev,
          memoryUsage: Math.round(performance.memory.usedJSHeapSize / 1048576),
        }));
      }

      animationId = requestAnimationFrame(measurePerformance);
    };

    animationId = requestAnimationFrame(measurePerformance);

    return () => cancelAnimationFrame(animationId);
  }, []);

  return metrics;
};

/**
 * Advanced Hook: useScrollLock
 * Prevent scroll on specific frame ranges
 */
export const useScrollLock = (currentFrame, lockedRanges = []) => {
  const [isLocked, setIsLocked] = React.useState(false);

  React.useEffect(() => {
    const isFrameLocked = lockedRanges.some(
      (range) => currentFrame >= range.start && currentFrame <= range.end
    );
    setIsLocked(isFrameLocked);
  }, [currentFrame, lockedRanges]);

  return isLocked;
};

export default {
  useFramePreloader,
  useKeyboardControls,
  useFrameInterpolation,
  useIntersectionObserver,
  useResizeObserver,
  usePerformanceMonitoring,
  useScrollLock,
};
