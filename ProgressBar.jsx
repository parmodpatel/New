import React from 'react';

/**
 * ProgressBar Component
 * Displays scroll progress at the bottom of the screen
 * @param {number} progress - Progress value from 0 to 1
 */
export const ProgressBar = ({ progress = 0 }) => {
  const percentage = Math.max(0, Math.min(100, progress * 100));

  return (
    <div className="fixed bottom-0 left-0 right-0 h-1 bg-gray-900 z-40">
      <div
        className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-100"
        style={{
          width: `${percentage}%`,
        }}
      />
    </div>
  );
};

export default ProgressBar;
