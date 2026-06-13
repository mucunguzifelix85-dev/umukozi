import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { TRANSLATIONS, JOB_TYPES } from "../data/mockData";
import { WorkerProfile } from "../types";

export const SearchScreen: React.FC = () => {
  const { language, setScreen, workers, employer } = useApp();
  const t = TRANSLATIONS[language];

  const [selectedSkill, setSelectedSkill] = useState("");
  const [showAll, setShowAll] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Filter workers by employer's sector first, then district
  const employerSector = employer?.location?.sector || "";
  const employerDistrict = employer?.location?.district || "";

  const sectorWorkers = workers.filter(w =>
    w.location.sector?.toLowerCase() === employerSector.toLowerCase() &&
    (selectedSkill === "" || w.skills.some(s => s.toLowerCase().includes(selectedSkill.toLowerCase())))
  );

  const districtWorkers = workers.filter(w =>
    w.location.district?.toLowerCase() === employerDistrict.toLowerCase() &&
    w.location.sector?.toLowerCase() !== employerSector.toLowerCase() &&
    (selectedSkill === "" || w.skills.some(s => s.toLowerCase().includes(selectedSkill.toLowerCase())))
  );

  const allWorkers = workers.filter(w =>
    selectedSkill === "" || w.skills.some(s => s.toLowerCase().includes(selectedSkill.toLowerCase()))
  );

  const displayed = showAll ? allWorkers : [...sectorWorkers, ...districtWorkers];

  const inputStyle: React.CSSProperties = {
    width: "100%", border: "1.5px solid #1877F2", borderRadius: "12px",
    padding: "12px 12px 12px 40px", fontWeight: "bold",
    background: "#f0f2f5", color: "#050505", outline: "none",
  };

  const WorkerCard: React.FC<{ w: WorkerProfile; isSector: boolean }> = ({ w, isSector }) => {
    const isExpanded = expandedId === w.id;
    return (
      <div onClick={() => setExpandedId(isExpanded ? null : w.id)}
        style={{
          background: "#fff", border: `1.5px solid ${isExpanded ? "#1877F2" : "#e4e6eb"}`,
          borderRadius: "18px", padding: "16px", cursor: "pointer",
          boxShadow: isExpanded ? "0 4px 16px #1877F222" : "none", transition: "all 0.2s"
        }}>
        <div className="flex gap-3 items-start">
          {/* Avatar */}
          {w.photoUrl ? (
            <img src={w.photoUrl} alt={w.fullName}
              className="w-14 h-14 rounded-full object-cover shrink-0"
              style={{ border: "2px solid #1877F2" }} />
          ) : (
            <div className="w-14 h-14 rounded-full flex items-center justify-center shrink-0 text-2xl"
              style={{ background: "#e7f3ff", border: "2px solid #1877F2" }}>
              👷
            </div>
          )}
          <div className="flex-1 min-w-0">
            {/* Location badge */}
            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full"
              style={isSector
                ? { background: "#e7f3ff", color: "#1877F2", border: "1px solid #1877F2" }
                : { background: "#f0f2f5", color: "#606770", border: "1px solid #e4e6eb" }}>
              {isSector ? `📍 ${w.location.sector}` : `🗺 ${w.location.sector}, ${w.location.district}`}
            </span>
            <h3 className="font-black text-base mt-1 leading-tight" style={{ color: "#050505" }}>
              {w.fullName}
            </h3>
            <div className="flex flex-wrap gap-1 mt-1">
              {w.skills.slice(0, 3).map(s => (
                <span key={s} className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                  style={{ background: "#f0f2f5", color: "#606770" }}>{s}</span>
              ))}
              {w.skills.length > 3 && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                  style={{ background: "#f0f2f5", color: "#606770" }}>
                  +{w.skills.length - 3}
                </span>
              )}
            </div>
          </div>
        </div>

        {isExpanded && (
          <div onClick={e => e.stopPropagation()} className="mt-4 flex flex-col gap-3">
            {w.summary && (
              <div className="p-3 rounded-xl" style={{ background: "#f0f2f5" }}>
                <p className="text-xs font-black uppercase mb-1" style={{ color: "#606770" }}>About</p>
                <p className="text-sm font-bold" style={{ color: "#050505" }}>{w.summary}</p>
              </div>
            )}
            {w.experiencedIn?.length > 0 && (
              <div className="p-3 rounded-xl" style={{ background: "#f0f2f5" }}>
                <p className="text-xs font-black uppercase mb-1" style={{ color: "#606770" }}>Experience</p>
                <p className="text-sm font-bold" style={{ color: "#050505" }}>{w.experiencedIn.join(", ")}</p>
              </div>
            )}
            <a href={`tel:${w.phoneNumber}`}
              className="w-full p-3 rounded-xl font-black text-center text-sm"
              style={{ background: "#1877F2", color: "#fff", textDecoration: "none" }}>
              📞 Call {w.fullName}
            </a>
            <a href={`https://wa.me/250${w.phoneNumber.replace(/^0/, "")}`}
              target="_blank" rel="noreferrer"
              className="w-full p-3 rounded-xl font-black text-center text-sm"
              style={{ background: "#25D366", color: "#fff", textDecoration: "none" }}>
              💬 WhatsApp {w.fullName}
            </a>
          </div>
        )}
        {!isExpanded && (
          <p className="text-[10px] font-bold mt-2 text-right" style={{ color: "#1877F2" }}>
            Tap to contact →
          </p>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen" style={{ background: "#1877F2" }}>
      {/* Header */}
      <div className="sticky top-0 z-20 px-4 py-3"
        style={{ background: "#1877F2", borderBottom: "1px solid #1565C0" }}>
        <div className="max-w-2xl mx-auto flex items-center justify-between gap-3">
          <div>
            <h1 className="text-lg font-black" style={{ color: "#fff" }}>👷 Workers Near You</h1>
            {employerSector && (
              <p className="text-xs font-bold" style={{ color: "#e7f3ff" }}>
                📍 {employerSector} · {employerDistrict}
              </p>
            )}
          </div>
          <button onClick={() => setScreen("role")}
            className="text-xs font-black px-3 py-2 rounded-xl"
            style={{ background: "#fff", color: "#1877F2", border: "none" }}>
            ← Home
          </button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 pb-8 pt-4">
        {/* Search bar */}
        <div className="relative mb-4">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lg">🔍</span>
          <input value={selectedSkill} onChange={e => setSelectedSkill(e.target.value)}
            style={inputStyle} placeholder="Search by skill (plumber, cook, guard...)" />
        </div>

        {/* Stats */}
        <div className="flex gap-2 mb-4">
          <div className="flex-1 rounded-xl p-3 text-center" style={{ background: "#fff" }}>
            <p className="text-2xl font-black" style={{ color: "#1877F2" }}>{sectorWorkers.length}</p>
            <p className="text-[10px] font-black uppercase" style={{ color: "#606770" }}>In Your Sector</p>
          </div>
          <div className="flex-1 rounded-xl p-3 text-center" style={{ background: "#fff" }}>
            <p className="text-2xl font-black" style={{ color: "#1877F2" }}>{districtWorkers.length}</p>
            <p className="text-[10px] font-black uppercase" style={{ color: "#606770" }}>Nearby</p>
          </div>
          <div className="flex-1 rounded-xl p-3 text-center" style={{ background: "#fff" }}>
            <p className="text-2xl font-black" style={{ color: "#1877F2" }}>{workers.length}</p>
            <p className="text-[10px] font-black uppercase" style={{ color: "#606770" }}>Total</p>
          </div>
        </div>

        {/* Skill filter pills */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-4 no-scrollbar">
          {["", ...JOB_TYPES.slice(0, 10)].map(s => (
            <button key={s} onClick={() => setSelectedSkill(s)}
              className="shrink-0 px-3 py-1.5 rounded-full text-xs font-bold"
              style={selectedSkill === s
                ? { background: "#fff", color: "#1877F2", border: "2px solid #fff" }
                : { background: "#ffffff33", color: "#fff", border: "2px solid #ffffff44" }}>
              {s === "" ? "All Skills" : s}
            </button>
          ))}
        </div>

        {/* Worker cards */}
        {displayed.length === 0 ? (
          <div className="rounded-2xl p-12 text-center" style={{ background: "#fff" }}>
            <div className="text-5xl mb-3">👷</div>
            <p className="font-black text-lg" style={{ color: "#606770" }}>No workers found yet</p>
            <p className="text-xs mt-2 font-bold" style={{ color: "#bcc0c4" }}>
              Workers in your area will appear here once they register
            </p>
            <button onClick={() => setShowAll(true)}
              className="mt-4 px-4 py-2 rounded-xl font-black text-sm"
              style={{ background: "#1877F2", color: "#fff", border: "none" }}>
              Show All Workers in Rwanda →
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {sectorWorkers.length > 0 && !showAll && (
              <div className="flex items-center gap-2 mb-1">
                <div style={{ height: "2px", flex: 1, background: "#fff3" }} />
                <span className="text-xs font-black uppercase px-3 py-1 rounded-full"
                  style={{ background: "#fff", color: "#1877F2" }}>
                  📍 {employerSector}
                </span>
                <div style={{ height: "2px", flex: 1, background: "#fff3" }} />
              </div>
            )}
            {displayed.map(w => (
              <WorkerCard key={w.id} w={w}
                isSector={w.location.sector?.toLowerCase() === employerSector.toLowerCase()} />
            ))}
          </div>
        )}

        {/* Toggle all */}
        {!showAll ? (
          <button onClick={() => setShowAll(true)}
            className="w-full mt-4 p-3 rounded-2xl font-black text-sm"
            style={{ background: "#ffffff33", color: "#fff", border: "1.5px solid #ffffff55" }}>
            + Show All Workers in Rwanda ({workers.length})
          </button>
        ) : (
          <button onClick={() => setShowAll(false)}
            className="w-full mt-4 p-3 rounded-2xl font-black text-sm"
            style={{ background: "#ffffff33", color: "#fff", border: "1.5px solid #ffffff55" }}>
            ← Show Local Only
          </button>
        )}
      </div>
    </div>
  );
};
