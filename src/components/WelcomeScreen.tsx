import React from 'react';
import { useApp } from '../context/AppContext';
import { Logo } from './Logo';
import { TRANSLATIONS } from '../data/mockData';
import { motion } from 'motion/react';
import { Search, Briefcase, ChevronRight, Languages } from 'lucide-react';

export const WelcomeScreen: React.FC = () => {
  const { 
    language, 
    setLanguage, 
    setActiveScreen, 
    currentUser, 
    currentUserType,
    setCurrentUser,
    setCurrentUserType
  } = useApp();

  const t = TRANSLATIONS[language];

  const handleSelectLanguage = (lang: 'rw' | 'en' | 'fr') => {
    setLanguage(lang);
  };

  const handleSelectRole = (role: 'worker' | 'employer') => {
    if (currentUser && currentUserType === role) {
      // Re-use current logged in user details
      setActiveScreen('app');
    } else {
      // Force individual path registration
      setActiveScreen(role === 'worker' ? 'register-worker' : 'register-employer');
    }
  };

  const bypassAsGuest = () => {
    // Allows immediate exploration of platform for demo
    setCurrentUser(null);
    setCurrentUserType('employer'); 
    setActiveScreen('app');
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-between p-6 md:p-12 relative overflow-hidden" id="welcome-full-screen">
      {/* Decorative vector arches for enterprise finish */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-[#00A550]/15 rounded-full blur-3xl opacity-60 -mr-16 -mt-16 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#00A550]/5 rounded-full blur-3xl opacity-30 -ml-16 -mb-16 pointer-events-none"></div>

      {/* Top Bar - Language Toggle */}
      <header className="w-full flex justify-between items-center max-w-lg mx-auto z-10" id="welcome-header">
        <span className="text-xs text-white border border-white/15 px-3 py-1.5 rounded-full bg-[#111111]/80 backdrop-blur shadow-sm flex items-center gap-1.5 font-bold uppercase">
          <Languages size={14} className="text-[#00A550]" />
          Rwanda National Hub
        </span>
        
        <div className="flex gap-1 bg-[#111111] p-1 rounded-lg shadow-sm border border-white/10" id="lang-selector-group">
          {(['rw', 'en', 'fr'] as const).map((lang) => (
            <button
              key={lang}
              onClick={() => handleSelectLanguage(lang)}
              className={`px-3 py-1 text-xs rounded-md transition-all font-bold uppercase ${
                language === lang 
                  ? 'bg-[#00A550] text-black' 
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
              id={`lang-btn-${lang}`}
            >
              {lang === 'rw' ? 'RW' : lang === 'en' ? 'EN' : 'FR'}
            </button>
          ))}
        </div>
      </header>

      {/* Main Body */}
      <main className="w-full max-w-md mx-auto flex-1 flex flex-col justify-center py-8 z-10" id="welcome-main-block">
        {/* Animated logo segment */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
          id="welcome-logo-container"
        >
          <Logo size="lg" showTagline={true} />
        </motion.div>

        {/* Dynamic prompt message */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="bg-[#111111] p-6 rounded-2xl border border-white/15 shadow-xl flex flex-col gap-4 text-center mb-8"
          id="welcome-card-prompt"
        >
          <h2 className="text-xl md:text-2xl font-black text-white tracking-tight" id="welcome-title-h2">
            Amahitamo Yobora (Your Path)
          </h2>
          <p className="text-xs text-gray-400 font-bold uppercase leading-relaxed font-sans">
            {language === 'rw' 
              ? 'Wifuza gukora cyangwa kwandika umukoresha? Hitamo icyiciro gikubera munsi.'
              : language === 'fr'
              ? 'Souhaitez-vous postuler ou embaucher ? Choisissez votre parcours ci-dessous.'
              : 'Do you want to apply for shifts or hire local labor? Choose your track below.'}
          </p>
        </motion.div>

        {/* Path Buttons */}
        <div className="flex flex-col gap-4 w-full" id="welcome-action-buttons">
          {/* Path 1: Looking for Work (Nshaka Akazi - Job Seeker) */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleSelectRole('worker')}
            className="w-full bg-[#00A550] text-[#000000] border-2 border-transparent hover:bg-[#00c25a] p-5 rounded-2xl shadow-[5px_5px_0px_0px_rgba(255,255,255,0.1)] font-bold text-left flex items-center justify-between transition-all group cursor-pointer"
            id="btn-select-worker"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-black rounded-xl text-[#00A550] group-hover:scale-110 transition-transform">
                <Briefcase size={24} />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-lg font-extrabold uppercase text-[#000000] tracking-wide">
                  {t.lookingForWork}
                </span>
                <span className="text-[11px] text-black/85 font-bold uppercase">
                  {language === 'rw' 
                    ? 'Kora umwirondoro w\'ubuntu (Free Registration)' 
                    : language === 'fr' 
                    ? 'Créez votre profil gratuitement' 
                    : 'Publish your trade - Free forever'}
                </span>
              </div>
            </div>
            <ChevronRight size={24} className="text-[#000000] group-hover:translate-x-1 transition-transform" />
          </motion.button>

          {/* Path 2: Need a Worker (Nshaka Umukozi - Employer) */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleSelectRole('employer')}
            className="w-full bg-[#111111] text-[#00A550] border-2 border-[#00A550] hover:bg-white/5 p-5 rounded-2xl shadow-[5px_5px_0px_0px_rgba(0,165,80,0.5)] font-bold text-left flex items-center justify-between transition-all group cursor-pointer"
            id="btn-select-employer"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-[#00A550] rounded-xl text-black group-hover:scale-110 transition-transform">
                <Search size={24} />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-lg font-extrabold uppercase text-white tracking-wide">
                  {t.needWorker}
                </span>
                <span className="text-[11px] text-emerald-400 font-bold uppercase">
                  {language === 'rw' 
                    ? 'Koresha abasobanutse vuba (500 RWF Fee)' 
                    : language === 'fr' 
                    ? 'Embauchez des spécialistes rapidement (500 RWF)' 
                    : 'Match verified local masters (500 RWF)'}
                </span>
              </div>
            </div>
            <ChevronRight size={24} className="text-[#00A550] group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </div>

        {/* Bypass link for quick testing of internal dashboard screens */}
        <div className="text-center mt-8">
          <button 
            onClick={bypassAsGuest}
            className="text-xs text-gray-400 hover:text-white underline font-bold uppercase tracking-wider cursor-pointer"
            id="btn-bypass-guest"
          >
            {language === 'rw' ? 'TEMBERERA UBUHINZI (Komeza nk\'Umukoresha Guest)' : 'Skip & Explore Portal as Guest'}
          </button>
        </div>
      </main>

      {/* Bottom Footer Section */}
      <footer className="w-full text-center max-w-sm mx-auto z-10 py-4 border-t border-white/10" id="welcome-footer">
        <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest leading-relaxed">
          UMUKOZI LABOUR PLATFORM © 2026. <br />
          REPUBLIC OF RWANDA SMART WORKERS INITIATIVE.
        </p>
      </footer>
    </div>
  );
};
