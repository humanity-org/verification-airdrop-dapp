import React from 'react';

/**
 * Footer - Bottom status bar component
 * 
 * Displays node status, network information, and quick links
 */
const Footer: React.FC = () => {
  return (
    <footer className="fixed bottom-0 left-0 w-full p-4 glass border-t border-white/5 flex justify-between px-8 items-center text-[9px] font-bold tracking-widest text-white/20 uppercase reveal delay-3">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <span className="w-1 h-1 rounded-full bg-green-500 animate-pulse"></span>
          Node: Optimal
        </div>
        <div className="hidden sm:flex items-center gap-1.5">
          <span className="w-1 h-1 rounded-full bg-blue-500"></span>
          Humanity Testnet
        </div>
      </div>
      <div className="flex gap-6">
        <span className="hover:text-white transition-colors cursor-pointer">Security</span>
        <span className="hover:text-white transition-colors cursor-pointer">Terms</span>
      </div>
    </footer>
  );
};

export default Footer;
