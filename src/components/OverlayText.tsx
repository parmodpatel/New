function OverlayText({ currentFrame, totalFrames }: { currentFrame: number; totalFrames: number }) {
  const progress = (currentFrame / totalFrames) * 100;

  const getText = () => {
    if (progress < 25) return "🎬 Starting...";
    if (progress < 50) return "🚀 Building...";
    if (progress < 75) return "⚡ Intense...";
    return "🔥 Climax!";
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
      <div className="text-center transition-all duration-500">
        <h1 className="text-6xl font-extrabold text-white drop-shadow-xl">
          {getText()}
        </h1>

        <p className="mt-4 text-gray-300 text-lg">
          Frame {currentFrame + 1} / {totalFrames}
        </p>
      </div>
    </div>
  );
}

export default OverlayText;