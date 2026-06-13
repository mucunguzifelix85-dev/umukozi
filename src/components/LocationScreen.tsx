import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { TRANSLATIONS } from "../data/mockData";
import { UmukoziLogo } from "./UmukoziLogo";

export const LocationScreen: React.FC = () => {
  const { language, setScreen, setWorkerLocation, jobs } = useApp();
  const t = TRANSLATIONS[language];

  const [district, setDistrict] = useState("");
  const [sector, setSector] = useState("");
  const [error, setError] = useState("");

  const jobCount = jobs.filter(j =>
    (!district || j.district.toLowerCase().includes(district.toLowerCase())) &&
    (!sector || j.sector.toLowerCase().includes(sector.toLowerCase()))
  ).length;

  const handleContinue = () => {
    if (!district.trim()) { setError("Please enter your district"); return; }
    if (!sector.trim()) { setError("Please enter your sector"); return; }
    setError("");
    setWorkerLocation({ district: district.trim(), sector: sector.trim(), village: sector.trim() });
    setScreen("job-feed");
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    border: "1.5px solid #1877F2",
    borderRadius: "12px",
    padding: "14px",
    marginTop: "6px",
    fontWeight: "bold",
    background: "#f0f2f5",
    color: "#050505",
    outline: "none",
    fontSize: "15px",
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6" style={{ background: "#1877F2" }}>
      <div className="w-full max-w-sm p-8" style={{ background: "#fff", borderRadius: "24px", boxShadow: "0 4px 32px #1877F255" }}>

        <div className="text-center mb-8">
          <div className="flex justify-center mb-3"><UmukoziLogo size={56} /></div>
          <h1 className="text-2xl font-black" style={{ color: "#1877F2" }}>UMUKOZI</h1>
          <div className="mt-3 p-3 rounded-2xl" style={{ background: "#e7f3ff" }}>
            <p className="text-lg font-black" style={{ color: "#050505" }}>📍 {t.whereDoYouLive}</p>
            <p className="text-xs mt-1 font-bold" style={{ color: "#606770" }}>{t.locationDesc}</p>
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-xl mb-4 font-bold text-sm"
            style={{ background: "#ffebe8", color: "#d32f2f", border: "1px solid #f5c6cb" }}>
            ⚠️ {error}
          </div>
        )}

        <div className="flex flex-col gap-5">

          {/* District */}
          <div>
            <label className="text-sm font-black uppercase" style={{ color: "#050505" }}>
              1. {t.district || "District"} *
            </label>
            <input
              value={district}
              onChange={e => setDistrict(e.target.value)}
              style={inputStyle}
              placeholder="e.g. Gasabo, Musanze, Rubavu..."
            />
          </div>

          {/* Sector */}
          <div>
            <label className="text-sm font-black uppercase" style={{ color: "#050505" }}>
              2. {t.sector || "Sector"} *
            </label>
            <input
              value={sector}
              onChange={e => setSector(e.target.value)}
              style={inputStyle}
              placeholder="e.g. Kimironko, Muhoza, Gisenyi..."
            />
          </div>

          {/* Live job count */}
          {district && sector && (
            <div className="rounded-xl p-3 flex items-center gap-3"
              style={{ background: jobCount > 0 ? "#e7f3ff" : "#f0f2f5", border: `1.5px solid ${jobCount > 0 ? "#1877F2" : "#e4e6eb"}` }}>
              <span className="text-2xl">{jobCount > 0 ? "💼" : "🔍"}</span>
              <div>
                <p className="font-black text-sm" style={{ color: jobCount > 0 ? "#1877F2" : "#606770" }}>
                  {jobCount > 0 ? `${jobCount} job(s) found near ${sector}` : `No jobs yet in ${sector}`}
                </p>
                <p className="text-xs font-bold" style={{ color: "#606770" }}>
                  {jobCount > 0 ? "Tap Continue to see them ✅" : "Continue anyway to check"}
                </p>
              </div>
            </div>
          )}

          {/* Continue */}
          <button onClick={handleContinue}
            className="w-full p-4 rounded-2xl font-black text-lg transition-all hover:opacity-90"
            style={{
              background: district && sector ? "#1877F2" : "#e4e6eb",
              color: district && sector ? "#fff" : "#606770",
              border: "none"
            }}>
            {t.continueBtn || "Continue"} →
          </button>

          <button onClick={() => setScreen("role")}
            className="w-full text-center font-bold text-sm py-1"
            style={{ color: "#606770" }}>
            ← {t.back || "Back"}
          </button>
        </div>
      </div>
    </div>
  );
};
