import React from "react";
import { useApp } from "../context/AppContext";
import { TRANSLATIONS } from "../data/mockData";

export const RoleScreen: React.FC = () => {
  const { setScreen, language } = useApp();
  const t = TRANSLATIONS[language];

  return (
    <div className="min-h-screen bg-green-700 flex flex-col items-center justify-center p-6">
      <div className="bg-black rounded-3xl shadow-2xl p-8 w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-green-700">UMUKOZI</h1>
          <p className="text-gray-300 font-bold mt-2">{t.chooseRole}</p>
        </div>
        <div className="flex flex-col gap-4">
          <button
            onClick={() => setScreen("register-worker")}
            className="flex flex-col items-center gap-2 p-6 bg-green-600 hover:bg-green-700 text-white rounded-2xl font-black text-xl transition-all shadow-lg"
          >
            <span className="text-4xl">👷</span>
            <span>{t.iAmLookingForWork}</span>
            <span className="text-sm font-normal opacity-80">FREE</span>
          </button>
          <button
            onClick={() => setScreen("register-employer")}
            className="flex flex-col items-center gap-2 p-6 bg-black border-2 border-green-600 hover:bg-green-50 text-green-700 rounded-2xl font-black text-xl transition-all shadow-lg"
          >
            <span className="text-4xl">🏢</span>
            <span>{t.iNeedWorker}</span>
            <span className="text-sm font-normal opacity-80">500 RWF</span>
          </button>
        </div>
        <button
          onClick={() => setScreen("language")}
          className="mt-6 w-full text-center text-gray-500 hover:text-gray-300 font-bold text-sm"
        >
          ← {t.back}
        </button>
      </div>
    </div>
  );
};

