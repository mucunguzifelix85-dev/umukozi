import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { TRANSLATIONS } from "../data/mockData";
import { DISTRICTS, SECTORS, CELLS } from "../data/locations";
import { UmukoziLogo } from "./UmukoziLogo";

const ALL_DISTRICTS = Object.values(DISTRICTS).flat();

export const LocationScreen: React.FC = () => {
  const { language, setScreen, setWorkerLocation, jobs } = useApp();
  const t = TRANSLATIONS[language];

  const [district, setDistrict] = useState("");
  const [sector, setSector] = useState("");
  const [village, setVillage] = useState("");
  const [error, setError] = useState("");

  const sectors = district ? (SECTORS[district] || []) : [];
  const villages = sector ? (CELLS[sector] || []) : [];

  // Live job count for selected location
  const jobCount = jobs.filter(j =>
    (!district || j.district === district) &&
    (!sector || j.sector === sector)
  ).length;

  const handleContinue = () => {
    if (!district) { setError(t.selectDistrict2); return; }
    if (!sector) { setError(t.selectSector2); return; }
    setError("");
    setWorkerLocation({ district, sector, village: village || sector });
    setScreen("job-feed");
  };

  const selectStyle = {
    width: "100%",
    border: "1.5px solid #1877F2",
    borderRadius: "12px",
    padding: "14px",
    marginTop: "6px",
    fontWeight: "bold" as const,
    background: "#f0f2f5",
    color: "#050505",
    outline: "none",
    fontSize: "15px",
  };

  const disabledStyle = { ...selectStyle, opacity: 0.4, cursor: "not-allowed" as const };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6" style={{ background: "#1877F2" }}>
      <div className="w-full max-w-sm p-8" style={{ background: "#fff", borderRadius: "24px", boxShadow: "0 4px 32px #1877F255" }}>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-3"><UmukoziLogo size={56} /></div>
          <h1 className="text-2xl font-black" style={{ color: "#1877F2" }}>UMUKOZI</h1>
          <div className="mt-3 p-3 rounded-2xl" style={{ background: "#e7f3ff" }}>
            <p className="text-lg font-black" style={{ color: "#050505" }}>📍 {t.whereDoYouLive}</p>
            <p className="text-xs mt-1 font-bold" style={{ color: "#606770" }}>{t.locationDesc}</p>
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-xl mb-4 font-bold text-sm" style={{ background: "#ffebe8", color: "#d32f2f", border: "1px solid #f5c6cb" }}>
            ⚠️ {error}
          </div>
        )}

        <div className="flex flex-col gap-5">

          {/* District */}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-black"
                style={{ background: district ? "#1877F2" : "#e4e6eb", color: district ? "#fff" : "#606770" }}>1</div>
              <label className="text-sm font-black uppercase" style={{ color: "#050505" }}>{t.district}</label>
              {district && <span className="text-xs font-bold" style={{ color: "#1877F2" }}>✓ {district}</span>}
            </div>
            <select value={district}
              onChange={e => { setDistrict(e.target.value); setSector(""); setVillage(""); }}
              style={selectStyle}>
              <option value="">{t.selectDistrict2}</option>
              {ALL_DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>

          {/* Sector */}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-black"
                style={{ background: sector ? "#1877F2" : district ? "#e4e6eb" : "#f0f2f5", color: sector ? "#fff" : "#606770" }}>2</div>
              <label className="text-sm font-black uppercase" style={{ color: district ? "#050505" : "#bcc0c4" }}>{t.sector}</label>
              {sector && <span className="text-xs font-bold" style={{ color: "#1877F2" }}>✓ {sector}</span>}
            </div>
            <select value={sector}
              onChange={e => { setSector(e.target.value); setVillage(""); }}
              disabled={!district}
              style={district ? selectStyle : disabledStyle}>
              <option value="">{t.selectSector2}</option>
              {sectors.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          {/* Village chips */}
          {sector && villages.length > 0 && (
            <div>
              <label className="text-xs font-black uppercase mb-2 block" style={{ color: "#606770" }}>
                {t.villageLabel} {village ? `— ✓ ${village}` : "(optional)"}
              </label>
              <div className="flex flex-wrap gap-2">
                {villages.map(v => (
                  <button key={v} type="button" onClick={() => setVillage(v === village ? "" : v)}
                    className="px-3 py-1.5 rounded-full text-xs font-bold transition-all"
                    style={village === v
                      ? { background: "#1877F2", color: "#fff", border: "2px solid #1877F2" }
                      : { background: "#f0f2f5", color: "#050505", border: "2px solid #e4e6eb" }}>
                    {v}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Live job count badge */}
          {district && sector && (
            <div className="rounded-xl p-3 flex items-center gap-3"
              style={{ background: jobCount > 0 ? "#e7f3ff" : "#f0f2f5", border: `1.5px solid ${jobCount > 0 ? "#1877F2" : "#e4e6eb"}` }}>
              <span className="text-2xl">{jobCount > 0 ? "💼" : "🔍"}</span>
              <div>
                <p className="font-black text-sm" style={{ color: jobCount > 0 ? "#1877F2" : "#606770" }}>
                  {jobCount > 0
                    ? `${jobCount} ${t.jobsAvailable || "job(s) available"} in ${sector}`
                    : `${t.noJobsYet || "No jobs posted yet"} in ${sector}`}
                </p>
                <p className="text-xs font-bold" style={{ color: "#606770" }}>
                  {jobCount > 0 ? (t.tapToSeeJobs || "Tap Continue to see them") : (t.checkOtherSectors || "Try another sector")}
                </p>
              </div>
            </div>
          )}

          {/* Continue Button */}
          <button onClick={handleContinue}
            className="w-full p-4 rounded-2xl font-black text-lg transition-all hover:opacity-90 mt-2"
            style={{
              background: district && sector ? "#1877F2" : "#e4e6eb",
              color: district && sector ? "#fff" : "#606770",
              border: "none"
            }}>
            {t.continueBtn} →
          </button>

          <button onClick={() => setScreen("role")}
            className="w-full text-center font-bold text-sm py-1"
            style={{ color: "#606770" }}>
            ← {t.back}
          </button>
        </div>
      </div>
    </div>
  );
};
