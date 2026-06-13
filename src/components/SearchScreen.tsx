import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { WorkerProfile } from "../types";

export const SearchScreen: React.FC = () => {
  const { setScreen, workers, employer } = useApp();

  const [search, setSearch] = useState("");

  const employerSector   = employer?.location?.sector?.toLowerCase()   || "";
  const employerDistrict = employer?.location?.district?.toLowerCase() || "";

  const sectorWorkers = workers.filter(w =>
    w.location.sector?.toLowerCase() === employerSector &&
    (search === "" ||
      w.fullName.toLowerCase().includes(search.toLowerCase()) ||
      w.skillsText?.toLowerCase().includes(search.toLowerCase()) ||
      w.lookingFor?.toLowerCase().includes(search.toLowerCase()))
  );

  const nearbyWorkers = workers.filter(w =>
    w.location.district?.toLowerCase() === employerDistrict &&
    w.location.sector?.toLowerCase()   !== employerSector &&
    (search === "" ||
      w.fullName.toLowerCase().includes(search.toLowerCase()) ||
      w.skillsText?.toLowerCase().includes(search.toLowerCase()) ||
      w.lookingFor?.toLowerCase().includes(search.toLowerCase()))
  );

  const allWorkers = workers.filter(w =>
    search === "" ||
    w.fullName.toLowerCase().includes(search.toLowerCase()) ||
    w.skillsText?.toLowerCase().includes(search.toLowerCase()) ||
    w.lookingFor?.toLowerCase().includes(search.toLowerCase())
  );

  const [showAll, setShowAll] = useState(false);
  const displayed = showAll ? allWorkers : [...sectorWorkers, ...nearbyWorkers];

  const inputStyle: React.CSSProperties = {
    width: "100%", border: "1.5px solid #1877F2", borderRadius: "12px",
    padding: "12px 12px 12px 40px", fontWeight: "bold",
    background: "#f0f2f5", color: "#050505", outline: "none", fontSize: "15px",
  };

  const WorkerCard: React.FC<{ w: WorkerProfile; isSector: boolean }> = ({ w, isSector }) => (
    <div style={{
      background: "#fff", border: `2px solid ${isSector ? "#1877F2" : "#e4e6eb"}`,
      borderRadius: "18px", padding: "16px",
    }}>
      {/* Top row — avatar + name + location */}
      <div className="flex gap-3 items-center">
        {w.photoUrl ? (
          <img src={w.photoUrl} alt={w.fullName}
            className="w-14 h-14 rounded-full object-cover shrink-0"
            style={{ border: "2px solid #1877F2" }} />
        ) : (
          <div className="w-14 h-14 rounded-full flex items-center justify-center shrink-0 text-3xl"
            style={{ background: "#e7f3ff", border: "2px solid #1877F2" }}>
            👷
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-0.5">
            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full"
              style={isSector
                ? { background: "#e7f3ff", color: "#1877F2", border: "1px solid #1877F2" }
                : { background: "#f0f2f5", color: "#606770", border: "1px solid #e4e6eb" }}>
              {isSector ? `📍 ${w.location.sector}` : `🗺 ${w.location.sector}, ${w.location.district}`}
            </span>
          </div>
          <h3 className="font-black text-base leading-tight" style={{ color: "#050505" }}>
            {w.fullName}
          </h3>
          {/* Skills typed by worker */}
          {w.skillsText && (
            <p className="text-xs font-bold mt-0.5" style={{ color: "#1877F2" }}>
              🛠 {w.skillsText}
            </p>
          )}
        </div>
      </div>

      {/* What worker is looking for */}
      {w.lookingFor && (
        <div className="mt-3 p-3 rounded-xl" style={{ background: "#f0f2f5" }}>
          <p className="text-xs font-black uppercase mb-0.5" style={{ color: "#606770" }}>Looking for</p>
          <p className="text-sm font-bold" style={{ color: "#050505" }}>{w.lookingFor}</p>
        </div>
      )}

      {/* Pay — negotiated */}
      <div className="mt-2 flex items-center gap-2">
        <span className="text-xs font-black px-3 py-1 rounded-full"
          style={{ background: "#fff3e0", color: "#e65100", border: "1px solid #ffcc02" }}>
          💰 Salary: Negotiated by call
        </span>
      </div>

      {/* Contact — always visible */}
      <div className="mt-3 flex flex-col gap-2">
        <a href={`tel:${w.phoneNumber}`}
          className="w-full p-3 rounded-xl font-black text-center text-sm"
          style={{ background: "#1877F2", color: "#fff", textDecoration: "none", display: "block" }}>
          📞 Call {w.fullName} — {w.phoneNumber}
        </a>
        <a href={`https://wa.me/250${w.phoneNumber.replace(/^0/, "")}`}
          target="_blank" rel="noreferrer"
          className="w-full p-3 rounded-xl font-black text-center text-sm"
          style={{ background: "#25D366", color: "#fff", textDecoration: "none", display: "block" }}>
          💬 WhatsApp — {w.phoneNumber}
        </a>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen" style={{ background: "#1877F2" }}>

      {/* Header */}
      <div className="sticky top-0 z-20 px-4 py-3"
        style={{ background: "#1877F2", borderBottom: "1px solid #1565C0" }}>
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-lg font-black" style={{ color: "#fff" }}>👷 Workers Near You</h1>
            {employer?.location?.sector && (
              <p className="text-xs font-bold" style={{ color: "#e7f3ff" }}>
                📍 {employer.location.sector} · {employer.location.district}
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

        {/* Search */}
        <div className="relative mb-4">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lg">🔍</span>
          <input value={search} onChange={e => setSearch(e.target.value)}
            style={inputStyle} placeholder="Search by name or skill..." />
        </div>

        {/* Stats */}
        <div className="flex gap-2 mb-5">
          {[
            { n: sectorWorkers.length, label: "In Your Sector" },
            { n: nearbyWorkers.length, label: "Nearby" },
            { n: workers.length,       label: "Total Workers" },
          ].map(({ n, label }) => (
            <div key={label} className="flex-1 rounded-xl p-3 text-center" style={{ background: "#fff" }}>
              <p className="text-2xl font-black" style={{ color: "#1877F2" }}>{n}</p>
              <p className="text-[10px] font-black uppercase" style={{ color: "#606770" }}>{label}</p>
            </div>
          ))}
        </div>

        {/* Cards */}
        {displayed.length === 0 ? (
          <div className="rounded-2xl p-12 text-center" style={{ background: "#fff" }}>
            <div className="text-5xl mb-3">👷</div>
            <p className="font-black text-lg" style={{ color: "#606770" }}>No workers in your area yet</p>
            <p className="text-xs mt-2 mb-4 font-bold" style={{ color: "#bcc0c4" }}>
              Workers register for free — they will appear here once they sign up
            </p>
            <button onClick={() => setShowAll(true)}
              className="px-4 py-2 rounded-xl font-black text-sm"
              style={{ background: "#1877F2", color: "#fff", border: "none" }}>
              Show All Workers in Rwanda →
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {sectorWorkers.length > 0 && !showAll && (
              <div className="flex items-center gap-2 my-1">
                <div style={{ height: "2px", flex: 1, background: "#ffffff44" }} />
                <span className="text-xs font-black uppercase px-3 py-1 rounded-full"
                  style={{ background: "#fff", color: "#1877F2" }}>
                  📍 {employer?.location?.sector}
                </span>
                <div style={{ height: "2px", flex: 1, background: "#ffffff44" }} />
              </div>
            )}
            {displayed.map(w => (
              <WorkerCard key={w.id} w={w}
                isSector={w.location.sector?.toLowerCase() === employerSector} />
            ))}
          </div>
        )}

        {/* Toggle */}
        <button onClick={() => setShowAll(v => !v)}
          className="w-full mt-4 p-3 rounded-2xl font-black text-sm"
          style={{ background: "#ffffff33", color: "#fff", border: "1.5px solid #ffffff55" }}>
          {showAll
            ? "← Show Local Workers Only"
            : `+ Show All Workers in Rwanda (${workers.length})`}
        </button>
      </div>
    </div>
  );
};
