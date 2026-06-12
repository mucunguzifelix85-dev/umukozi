import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Handshake } from 'lucide-react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ size = 'md', showTagline = true }) => {
  const { setActiveScreen, language } = useApp();
  const [tapCount, setTapCount] = useState(0);

  const handleLogoTap = () => {
    const nextCount = tapCount + 1;
    setTapCount(nextCount);
    
    if (nextCount === 20) {
      setTapCount(0);
      setActiveScreen('admin');
    }
  };

  const getSizing = () => {
    switch (size) {
      case 'sm':
        return {
          icon: 18,
          title: 'text-lg',
          tag: 'text-[9px]'
        };
      case 'lg':
        return {
          icon: 56,
          title: 'text-4xl',
          tag: 'text-sm'
        };
      default: // md
        return {
          icon: 32,
          title: 'text-2xl',
          tag: 'text-xs'
        };
    }
  };

  const sizes = getSizing();

  const getTagline = () => {
    if (language === 'rw') return '"Guhuza Abakozi n’Abakoresha mu Rwanda Ryose"';
    if (language === 'fr') return '"Mettre en Relation Ouvriers et Employeurs au Rwanda"';
    return '"Connecting Workers with Employers Across Rwanda"';
  };

  return (
    <div 
      className="flex flex-col items-center justify-center cursor-pointer select-none py-2"
      onClick={handleLogoTap}
      id="umukozi-header-logo"
    >
      <div className="flex items-center gap-2">
        {/* Handshake logo in deep green and black */}
        <div className="bg-[#000000] p-2.5 rounded-xl border border-[#00A550] shadow-md flex items-center justify-center transition hover:scale-105 active:scale-95">
          <Handshake size={sizes.icon} className="text-[#00A550]" strokeWidth={2.5} />
        </div>
        <div className="flex flex-col">
          <span className={`${sizes.title} tracking-wider font-extrabold text-white font-display flex items-center`}>
            UMU<span className="text-[#00A550]">KOZI</span>
          </span>
        </div>
      </div>
      
      {showTagline && (
        <p className={`${sizes.tag} mt-1.5 text-center text-gray-400 max-w-xs uppercase bg-white/5 px-2 py-0.5 rounded border border-white/15 italic`}>
          {getTagline()}
        </p>
      )}

      {/* Secret click feedback to guide users and verify easter egg during testing */}
      {tapCount > 0 && tapCount < 20 && (
        <span className="text-[10px] text-[#00A550] bg-white/5 px-2 py-0.5 mt-1 rounded animate-bounce border border-[#00A550]/20">
          🔑 Admin Panel Easter Egg tap: {tapCount}/20
        </span>
      )}
    </div>
  );
};
