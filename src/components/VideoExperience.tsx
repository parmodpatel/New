import { useState } from "react";
import { ScrollableVideoViewer } from "./ScrollableVideoViewer";

function VideoExperience() {
  const [currentFrame, setCurrentFrame] = useState(0);
  const totalFrames = 300;

  return (
    <div className="relative w-screen h-screen">
      <ScrollableVideoViewer 
        currentFrame={currentFrame}
        setCurrentFrame={setCurrentFrame}
        totalFrames={totalFrames}
      />
    </div>
  );
}

export default VideoExperience;