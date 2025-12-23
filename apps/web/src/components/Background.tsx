import React from 'react';

/**
 * Background - Dynamic light orb background component
 * 
 * Renders two blurred colored light orbs to create dynamic background effect
 */
const Background: React.FC = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-[15%] left-[10%] w-72 h-72 bg-green-500/10 blur-[100px] rounded-full animate-pulse" />
      <div
        className="absolute bottom-[15%] right-[15%] w-[400px] h-[400px] bg-blue-600/5 blur-[120px] rounded-full animate-pulse"
        style={{ animationDelay: '2s' }}
      />
    </div>
  );
};

export default Background;
