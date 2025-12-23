import React from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import humanityLogo from '../assets/humanity-protocol-logo.svg';

/**
 * Header - Navigation bar component
 *
 * Contains project logo and wallet connection button
 */
const Header: React.FC = () => {
  return (
    <nav className="fixed top-0 w-full p-6 flex justify-between items-center z-50 reveal">
      <div className="relative top-4 left-4 md:left-8">
        <img
          alt="humanity protocol"
          width="141"
          height="32"
          className="w-[140px] h-auto md:w-[170px]"
          src={humanityLogo}
        />
      </div>
      <div className="flex items-center gap-4 md:gap-6">
        <ConnectButton chainStatus="icon" showBalance={false} />
      </div>
    </nav>
  );
};

export default Header;
