import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { WorkerProfile } from "../types";

const expiryLabel = (expiresAt: string) => {
  const diff = new Date(expiresAt).getTime() - Date.now();
  if (diff <= 0) return "Expired";
  const h = Math.floor(diff / 3600000);
  const d = Math.floor(h / 24);
  if (d >= 1) return `${d}d ${h % 24}h left`;
  return `${h}h left`;
};

export const SearchScreen: React.FC = () => {
  const { setScreen, workers, employer, activeJobs, markJobFilled } = useApp();
  const [search,  setSearch]  = useState("");
  const [showAll, setShowAll] = useState(false);

  const employerSector   = employer?.location?.sector?.toLowerCase()   || "";
  const employerDistrict = employer?.location?.district?.toLowerCase() || "";

  const matchesSearch = (w: WorkerProfile) =>
    search === "" ||
    w.fullName.toLowerCase().includes(search.toLowerCase()) ||
    w.skillsText?.toLowerCase().includes(search.toLowerCase()) ||
    w.lookingFor?.toLowerCase().includes(search.toLowerCase());

  const sectorWorkers = workers.filter(w =>
    w.location.sector?.toLowerCase() === employerSector && matchesSearch(w)
  );
  const nearbyWorkers = workers.filter(w =>
    w.location.district?.toLowerCase() === employerDistrict &&
    w.location.sector?.toLowerCase() !== employerSector &&
    matchesSearch(w)
  );
  const allWorkers = workers.filter(matchesSearch);
  const displayed  = showAll ? allWorkers : [...sectorWorkers, ...nearbyWorkers];

  // Employer's own active jobs (to show "found worker" buttons)
  const myJobs = activeJobs.filter(j => j.employerId === employer?.id);

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
          <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full"
            style={isSector
              ? { background: "#e7f3ff", color: "#1877F2", border: "1px solid #1877F2" }
              : { background: "#f0f2f5", color: "#606770", border: "1px solid #e4e6eb" }}>
            {isSector ? `📍 ${w.location.sector}` : `🗺 ${w.location.sector}, ${w.location.district}`}
          </span>
          <h3 className="font-black text-base leading-tight mt-1" style={{ color: "#050505" }}>
            {w.fullName}
          </h3>
          {w.skillsText && (
            <p className="text-xs font-bold mt-0.5" style={{ color: "#1877F2" }}>
              🛠 {w.skillsText}
            </p>
          )}
        </div>
      </div>

      {w.lookingFor && (
        <div className="mt-3 p-3 rounded-xl" style={{ background: "#f0f2f5" }}>
          <p className="text-xs font-black uppercase mb-0.5" style={{ color: "#606770" }}>Looking for</p>
          <p className="text-sm font-bold" style={{ color: "#050505" }}>{w.lookingFor}</p>
        </div>
      )}

      <div className="mt-2 flex items-center gap-2">
        <span className="text-xs font-black px-3 py-1 rounded-full"
          style={{ background: "#fff3e0", color: "#e65100", border: "1px solid #ffcc02" }}>
          💰 Salary: Negotiated by call
        </span>
      </div>

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
        {/* Found a Worker — closes the employer's most recent open job */}
        {myJobs.length > 0 && (
          <button onClick={() => {
            if (window.confirm(`Confirm you hired ${w.fullName}? Your job posting will close.`)) {
              markJobFilled(myJobs[0].id);
              alert(`Great! Your job "${myJobs[0].skillNeeded}" is now closed.`);
            }
          }}
            className="w-full p-2 rounded-xl font-black text-xs"
            style={{ background: "#f0f2f5", color: "#1877F2", border: "1.5px solid #1877F2" }}>
            ✅ I Hired {w.fullName} — Close My Job
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen" style={{ background: "#1877F2" }}>
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
        {/* Employer's active jobs summary */}
        {myJobs.length > 0 && (
          <div className="rounded-2xl p-4 mb-4" style={{ background: "#fff" }}>
            <p className="font-black text-sm mb-2" style={{ color: "#1877F2" }}>
              📋 Your Active Job{myJobs.length > 1 ? "s" : ""}
            </p>
            {myJobs.map(j => (
              <div key={j.id} className="flex items-center justify-between py-2"
                style={{ borderBottom: "1px solid #f0f2f5" }}>
                <div>
                  <p className="font-bold text-sm" style={{ color: "#050505" }}>{j.skillNeeded}</p>
                  <p className="text-xs font-bold" style={{ color: "#606770" }}>⏰ {expiryLabel(j.expiresAt)}</p>
                </div>
                <button onClick={() => {
                  if (window.confirm("Mark this job as filled?")) markJobFilled(j.id);
                }}
                  className="text-xs font-black px-3 py-1.5 rounded-xl"
                  style={{ background: "#e7f3ff", color: "#1877F2", border: "1px solid #1877F2" }}>
                  ✅ Found Worker
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="relative mb-4">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lg">🔍</span>
          <input value={search} onChange={e => setSearch(e.target.value)}
            style={inputStyle} placeholder="Search by name or skill..." />
        </div>

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

        {displayed.length === 0 ? (
          <div className="rounded-2xl p-12 text-center" style={{ background: "#fff" }}>
            <div className="text-5xl mb-3">👷</div>
            <p className="font-black text-lg" style={{ color: "#606770" }}>No workers in your area yet</p>
            <p className="text-xs mt-2 mb-4 font-bold" style={{ color: "#bcc0c4" }}>
              Workers register for free — they appear here once they sign up
            </p>
            <button onClick={() => setShowAll(true)}
              className="px-4 py-2 rounded-xl font-black text-sm"
              style={{ background: "#1877F2", color: "#fff", border: "none" }}>
              Show All Workers in Rwanda →
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {displayed.map(w => (
              <WorkerCard key={w.id} w={w}
                isSector={w.location.sector?.toLowerCase() === employerSector} />
            ))}
          </div>
        )}

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
