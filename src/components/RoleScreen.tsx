import React from "react";
import { useApp } from "../context/AppContext";
import { TRANSLATIONS } from "../data/mockData";
import { UmukoziLogo } from "./UmukoziLogo";

export const RoleScreen: React.FC = () => {
  const { setScreen, language } = useApp();
  const t = TRANSLATIONS[language];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6" style={{background:"#1877F2"}}>
      <div style={{background:"#fff",borderRadius:"24px",boxShadow:"0 4px 32px #1877F255"}} className="p-8 w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-3">
            <UmukoziLogo size={64} />
          </div>
          <h1 className="text-3xl font-black" style={{color:"#1877F2"}}>UMUKOZI</h1>
          <p className="font-bold mt-2" style={{color:"#606770"}}>{t.chooseRole}</p>
        </div>
        <div className="flex flex-col gap-4">
          <button
            onClick={() => setScreen("register-worker")}
            className="flex flex-col items-center gap-2 p-6 rounded-2xl font-black text-xl transition-all shadow-lg hover:opacity-90"
            style={{background:"#1877F2",color:"#fff",border:"none"}}>
            <span className="text-4xl">👷</span>
            <span>{t.iAmLookingForWork}</span>
            <span className="text-sm font-bold opacity-90">{t.registrationFree}</span>
          </button>
          <button
            onClick={() => setScreen("register-employer")}
            className="flex flex-col items-center gap-2 p-6 rounded-2xl font-black text-xl transition-all shadow-lg hover:opacity-90"
            style={{background:"#fff",color:"#1877F2",border:"2px solid #1877F2"}}>
            <span className="text-4xl">🏢</span>
            <span>{t.iNeedWorker}</span>
            <span className="text-sm font-bold opacity-80">{t.employerFee}</span>
          </button>
        </div>
        <button
          onClick={() => setScreen("language")}
          className="mt-6 w-full text-center font-bold text-sm"
          style={{color:"#606770"}}>
          ← {t.back}
        </button>
      </div>
    </div>
  );
};
