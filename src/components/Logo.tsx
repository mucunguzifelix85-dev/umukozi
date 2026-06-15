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
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [adminError, setAdminError] = useState(false);

  const handleLogoTap = () => {
    const nextCount = tapCount + 1;
    setTapCount(nextCount);

    if (nextCount === 20) {
      setTapCount(0);
      setShowAdminModal(true);
    }
  };

  const handleAdminUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPassword === 'vafubwengetech') {
      setShowAdminModal(false);
      setAdminPassword('');
      setAdminError(false);
      setActiveScreen('admin');
    } else {
      setAdminError(true);
      setAdminPassword('');
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
    if (language === 'rw') return '"Guhuza Abakozi n\u2019Abakoresha mu Rwanda Ryose"';
    if (language === 'fr') return '"Mettre en Relation Ouvriers et Employeurs au Rwanda"';
    return '"Connecting Workers with Employers Across Rwanda"';
  };

  return (
    <>
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
          <p className={`${sizes.tag} mt-1.5 text-center text-gray-500 max-w-xs uppercase bg-black/5 px-2 py-0.5 rounded border border-white/15 italic`}>
            {getTagline()}
          </p>
        )}

        {/* Secret click feedback to guide users and verify easter egg during testing */}
        {tapCount > 0 && tapCount < 20 && (
          <span className="text-[10px] text-[#00A550] bg-black/5 px-2 py-0.5 mt-1 rounded animate-bounce border border-[#00A550]/20">
            🔑 Admin Panel Easter Egg tap: {tapCount}/20
          </span>
        )}
      </div>

      {/* Admin password modal */}
      {showAdminModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-sm bg-[#111111] border border-white/10 rounded-3xl p-6 shadow-2xl text-white">
            <h3 className="text-lg font-black uppercase mb-2 text-center text-[#00A550]">Admin Access</h3>
            <p className="text-[10px] text-gray-500 uppercase text-center mb-4">
              Enter the admin password to continue
            </p>
            <form onSubmit={handleAdminUnlock} className="flex flex-col gap-3">
              <input
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="Password"
                autoFocus
                className="w-full border border-white/15 px-4 py-3 rounded-xl bg-black text-white outline-none text-sm font-bold focus:border-[#00A550]"
              />
              {adminError && (
                <span className="text-[10px] text-red-500 uppercase font-bold text-center">
                  Incorrect password
                </span>
              )}
              <div className="flex gap-2 mt-1">
                <button
                  type="button"
                  onClick={() => {
                    setShowAdminModal(false);
                    setAdminPassword('');
                    setAdminError(false);
                  }}
                  className="flex-1 bg-black border border-white/15 hover:bg-neutral-900 p-3 rounded-xl text-xs text-white uppercase font-extrabold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-[#00A550] hover:bg-emerald-600 border border-[#00A550] text-black p-3 rounded-xl text-xs uppercase font-black cursor-pointer"
                >
                  Unlock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
