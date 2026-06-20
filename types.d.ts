// Type definitions for scroll-driven video experience components

declare module '@/components/VideoExperience' {
  import { FC, ReactNode } from 'react';

  interface VideoExperienceProps {
    totalFrames?: number;
    frameFolder?: string;
    showOverlay?: boolean;
    showProgressBar?: boolean;
    onFrameChange?: (frame: number) => void;
  }

  const VideoExperience: FC<VideoExperienceProps>;
  export default VideoExperience;
}

declare module '@/components/ScrollableVideoViewer' {
  import { FC, RefObject } from 'react';

  interface ScrollableVideoViewerProps {
    currentFrame: number;
    frameFolder?: string;
    totalFrames: number;
    mousePos: { x: number; y: number };
    preloadedFrames: number[];
    containerRef: RefObject<HTMLDivElement>;
  }

  const ScrollableVideoViewer: FC<ScrollableVideoViewerProps>;
  export default ScrollableVideoViewer;
}

declare module '@/components/OverlayText' {
  import { FC } from 'react';

  interface OverlayTextProps {
    currentFrame: number;
    scrollProgress: number;
    totalFrames: number;
  }

  const OverlayText: FC<OverlayTextProps>;
  export default OverlayText;
}

declare module '@/components/ProgressBar' {
  import { FC } from 'react';

  interface ProgressBarProps {
    progress?: number;
  }

  const ProgressBar: FC<ProgressBarProps>;
  export default ProgressBar;
}

declare module '@/hooks/useScrollFrame' {
  import { RefObject } from 'react';

  interface UseScrollFrameReturn {
    containerRef: RefObject<HTMLDivElement>;
    currentFrame: number;
    setCurrentFrame: (frame: number) => void;
    scrollProgress: number;
    mousePos: { x: number; y: number };
    preloadedFrames: number[];
    totalFrames: number;
  }

  export function useScrollFrame(totalFrames?: number): UseScrollFrameReturn;
}
