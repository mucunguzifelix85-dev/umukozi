import React from "react";
import { useApp } from "../context/AppContext";
import { Language } from "../types";
import { UmukoziLogo } from "./UmukoziLogo";

const LANGUAGES = [
  { code: "rw", label: "Kinyarwanda", flag: "🇷🇼", sub: "Hitamo ururimi" },
  { code: "en", label: "English", flag: "🇬🇧", sub: "Choose language" },
  { code: "fr", label: "Français", flag: "🇫🇷", sub: "Choisir la langue" },
  { code: "sw", label: "Kiswahili", flag: "🌍", sub: "Chagua lugha" },
];

export const LanguageScreen: React.FC = () => {
  const { setLanguage, setScreen } = useApp();

  const handleSelect = (code: Language) => {
    setLanguage(code);
    setScreen("role");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6" style={{background:"#1877F2"}}>
      <div style={{background:"#fff",borderRadius:"24px",boxShadow:"0 4px 32px #1877F255"}} className="p-8 w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-3">
            <UmukoziLogo size={64} />
          </div>
          <h1 className="text-3xl font-black" style={{color:"#1877F2"}}>UMUKOZI</h1>
          <p className="text-sm mt-2 font-bold" style={{color:"#606770"}}>🌍 Select your language</p>
        </div>
        <div className="flex flex-col gap-3">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleSelect(lang.code as Language)}
              className="flex items-center gap-4 p-4 rounded-2xl font-bold text-lg text-left transition-all hover:opacity-90"
              style={{border:"2px solid #1877F2",background:"#fff",color:"#1877F2"}}>
              <span className="text-3xl">{lang.flag}</span>
              <div>
                <div style={{color:"#050505"}} className="font-black">{lang.label}</div>
                <div style={{color:"#1877F2"}} className="text-xs font-bold">{lang.sub}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
