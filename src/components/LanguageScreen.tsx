import React from "react";
import { UmukoziLogo } from "./UmukoziLogo";
import { useApp } from "../context/AppContext";
import { Language } from "../types";

const LANGUAGES = [
  { code: "rw", label: "Kinyarwanda", flag: "🇷🇼" },
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "sw", label: "Kiswahili", flag: "🌍" },
];

export const LanguageScreen: React.FC = () => {
  const { setLanguage, setScreen } = useApp();

  const handleSelect = (code: Language) => {
    setLanguage(code);
    setScreen("role");
  };

  return (
    <div className="min-h-screen bg-green-700 flex flex-col items-center justify-center p-6">
      <div className="bg-black rounded-3xl shadow-2xl p-8 w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-2"><UmukoziLogo size={52} /></div>
          <h1 className="text-3xl font-black text-green-400">UMUKOZI</h1>
          <p className="text-gray-500 text-sm mt-1">Choose your language / Hitamo ururimi</p>
        </div>
        <div className="flex flex-col gap-3">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleSelect(lang.code as Language)}
              className="flex items-center gap-4 p-4 border-2 border-green-800 rounded-2xl hover:border-green-600 hover:bg-green-50 transition-all font-bold text-lg text-left"
            >
              <span className="text-3xl">{lang.flag}</span>
              <span className="text-white">{lang.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};


