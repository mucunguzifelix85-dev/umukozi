import React, { useState, useEffect, useRef } from "react";
import { useApp } from "../context/AppContext";
import { JobPosting } from "../types";

const LANG_NAMES: Record<string, string> = {
  en: "English", rw: "Kinyarwanda", fr: "Français", sw: "Kiswahili"
};

const expiryLabel = (expiresAt: string) => {
  const diff = new Date(expiresAt).getTime() - Date.now();
  if (diff <= 0) return "Expired";
  const h = Math.floor(diff / 3600000);
  const d = Math.floor(h / 24);
  if (d >= 1) return `Closes in ${d}d ${h % 24}h`;
  return `Closes in ${h}h`;
};

export const JobFeedScreen: React.FC = () => {
  const { setScreen, workerLocation, activeJobs, language, markJobFilled } = useApp();

  const [tab,      setTab]      = useState<"feed" | "account">("feed");
  const [search,   setSearch]   = useState("");
  const [showAll,  setShowAll]  = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [translating, setTranslating] = useState<Record<string, boolean>>({});
  const [translated,  setTranslated]  = useState<Record<string, { skillNeeded: string; description: string }>>({});
  const translatedRef = useRef(translated);
  translatedRef.current = translated;

  const sector   = workerLocation?.sector?.toLowerCase()   || "";
  const district = workerLocation?.district?.toLowerCase() || "";

  const sectorJobs = activeJobs.filter(j =>
    j.district?.toLowerCase() === district && j.sector?.toLowerCase() === sector
  );
  const nearbyJobs = activeJobs.filter(j =>
    j.district?.toLowerCase() === district && j.sector?.toLowerCase() !== sector
  );

  const filtered = (showAll ? activeJobs : [...sectorJobs, ...nearbyJobs]).filter(j =>
    search === "" ||
    j.skillNeeded.toLowerCase().includes(search.toLowerCase()) ||
    j.description.toLowerCase().includes(search.toLowerCase())
  );

  const translateJob = async (job: JobPosting) => {
    if (language === "en") return;
    if (translatedRef.current[job.id]) return;
    setTranslating(prev => ({ ...prev, [job.id]: true }));
    try {
      const langName = LANG_NAMES[language] || "English";
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1000,
          messages: [{
            role: "user",
            content: `Translate the following job posting fields to ${langName}. 
Respond with ONLY a JSON object with keys "skillNeeded" and "description". No markdown, no explanation.

skillNeeded: ${job.skillNeeded}
description: ${job.description}`
          }]
        })
      });
      const data = await response.json();
      const text = data.content?.map((b: { type: string; text?: string }) => b.type === "text" ? b.text : "").join("") || "";
      const clean = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      setTranslated(prev => ({ ...prev, [job.id]: parsed }));
    } catch (e) {
      // fallback to original
    } finally {
      setTranslating(prev => ({ ...prev, [job.id]: false }));
    }
  };

  // Auto-translate when language changes
  useEffect(() => {
    if (language === "en") return;
    filtered.forEach(job => translateJob(job));
  }, [language, filtered.map(j => j.id).join(",")]);

  const inputStyle: React.CSSProperties = {
    width: "100%", border: "1.5px solid #1877F2", borderRadius: "12px",
    padding: "12px 12px 12px 40px", fontWeight: "bold",
    background: "#f0f2f5", color: "#050505", outline: "none",
  };

  const JobCard: React.FC<{ job: JobPosting }> = ({ job }) => {
    const isExpanded = expanded === job.id;
    const isSector   = job.sector?.toLowerCase() === sector;
    const tx         = translated[job.id];
    const isLoading  = translating[job.id];
    const skillNeeded   = tx?.skillNeeded   || job.skillNeeded;
    const description   = tx?.description   || job.description;
    const expLabel = expiryLabel(job.expiresAt);

    return (
      <div style={{
        background: "#fff", borderRadius: "18px", padding: "16px",
        border: `1.5px solid ${isSector ? "#1877F2" : "#e4e6eb"}`,
      }}>
        {job.photoUrl && (
          <img src={job.photoUrl} alt="Job"
            className="w-full rounded-xl object-cover mb-3" style={{ maxHeight: "140px" }} />
        )}

        <div className="flex justify-between items-start gap-2 mb-2">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full"
                style={isSector
                  ? { background: "#e7f3ff", color: "#1877F2", border: "1px solid #1877F2" }
                  : { background: "#f0f2f5", color: "#606770", border: "1px solid #e4e6eb" }}>
                {isSector ? `📍 ${job.sector}` : `🗺 ${job.sector}, ${job.district}`}
              </span>
              {/* Expiry badge */}
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full"
                style={{ background: "#fff3e0", color: "#e65100", border: "1px solid #ffcc02" }}>
                ⏰ {expLabel}
              </span>
              {isLoading && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                  style={{ background: "#e7f3ff", color: "#1877F2" }}>
                  🌐 Translating...
                </span>
              )}
            </div>
            <h3 className="font-black text-base leading-tight" style={{ color: "#050505" }}>
              {skillNeeded}
            </h3>
            <p className="text-xs font-bold mt-0.5" style={{ color: "#606770" }}>
              🏢 {job.employerName} · {job.neighborhood || job.sector}
            </p>
          </div>
          <span className="shrink-0 text-[10px] font-black uppercase px-3 py-1.5 rounded-xl"
            style={{ background: "#fff3e0", color: "#e65100", border: "1px solid #ffcc02" }}>
            💰 Negotiate
          </span>
        </div>

        <p className="text-sm font-bold leading-relaxed mb-3"
          style={{ color: "#050505" }}
          onClick={() => setExpanded(isExpanded ? null : job.id)}>
          {isExpanded ? description : description.slice(0, 100) + (description.length > 100 ? "..." : "")}
          {description.length > 100 && (
            <span style={{ color: "#1877F2" }}> {isExpanded ? " less" : " more"}</span>
          )}
        </p>

        {language !== "en" && !tx && !isLoading && (
          <button onClick={() => translateJob(job)}
            className="w-full p-2 rounded-xl font-bold text-xs mb-3"
            style={{ background: "#e7f3ff", color: "#1877F2", border: "1px solid #1877F2" }}>
            🌐 Show in {LANG_NAMES[language]}
          </button>
        )}

        <div className="flex flex-col gap-2">
          <a href={`tel:${job.employerPhone}`}
            className="w-full p-3 rounded-xl font-black text-center text-sm"
            style={{ background: "#1877F2", color: "#fff", textDecoration: "none", display: "block" }}>
            📞 Call Employer — {job.employerPhone}
          </a>
          <a href={`https://wa.me/250${job.employerPhone.replace(/^0/, "")}`}
            target="_blank" rel="noreferrer"
            className="w-full p-3 rounded-xl font-black text-center text-sm"
            style={{ background: "#25D366", color: "#fff", textDecoration: "none", display: "block" }}>
            💬 WhatsApp — {job.employerPhone}
          </a>
          {/* Found a Worker button (shown to employer on their own jobs) */}
          <button onClick={() => {
            if (window.confirm("Confirm you found a worker? This job will close immediately.")) {
              markJobFilled(job.id);
            }
          }}
            className="w-full p-2 rounded-xl font-black text-xs"
            style={{ background: "#f0f2f5", color: "#606770", border: "1px solid #e4e6eb" }}>
            ✅ I Found a Worker — Close This Job
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen" style={{ background: "#1877F2" }}>
      <div className="sticky top-0 z-20 px-4 py-3"
        style={{ background: "#1877F2", borderBottom: "1px solid #1565C0" }}>
        <div className="max-w-2xl mx-auto flex items-center justify-between gap-3 mb-3">
          <div>
            <h1 className="text-lg font-black" style={{ color: "#fff" }}>
              {tab === "feed" ? "💼 Jobs Near You" : "👷 My Worker Account"}
            </h1>
            <p className="text-xs font-bold" style={{ color: "#e7f3ff" }}>
              📍 {workerLocation?.sector} · {workerLocation?.district}
            </p>
          </div>
          <button onClick={() => setScreen("location-worker")}
            className="text-xs font-black px-3 py-2 rounded-xl"
            style={{ background: "#fff", color: "#1877F2", border: "none" }}>
            📍 Change
          </button>
        </div>
        <div className="max-w-2xl mx-auto flex gap-2">
          <button onClick={() => setTab("feed")}
            className="flex-1 py-2 rounded-xl font-black text-sm"
            style={tab === "feed"
              ? { background: "#fff", color: "#1877F2", border: "none" }
              : { background: "#ffffff22", color: "#fff", border: "1.5px solid #ffffff44" }}>
            💼 Job Feed
          </button>
          <button onClick={() => setTab("account")}
            className="flex-1 py-2 rounded-xl font-black text-sm"
            style={tab === "account"
              ? { background: "#fff", color: "#1877F2", border: "none" }
              : { background: "#ffffff22", color: "#fff", border: "1.5px solid #ffffff44" }}>
            👷 Create Account
          </button>
        </div>
      </div>

      {tab === "feed" && (
        <div className="max-w-2xl mx-auto px-4 pb-8 pt-4">
          <div className="relative mb-4">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lg">🔍</span>
            <input value={search} onChange={e => setSearch(e.target.value)}
              style={inputStyle} placeholder="Search by skill or keyword..." />
          </div>
          {language !== "en" && (
            <div className="rounded-xl p-3 mb-4 text-xs font-bold"
              style={{ background: "#e7f3ff", color: "#1877F2", border: "1px solid #1877F2" }}>
              🌐 Jobs are automatically translated to {LANG_NAMES[language]}
            </div>
          )}
          <div className="flex gap-2 mb-4">
            {[
              { n: sectorJobs.length, label: "In Your Sector" },
              { n: nearbyJobs.length, label: "Nearby" },
              { n: activeJobs.length, label: "Total Jobs" },
            ].map(({ n, label }) => (
              <div key={label} className="flex-1 rounded-xl p-3 text-center" style={{ background: "#fff" }}>
                <p className="text-2xl font-black" style={{ color: "#1877F2" }}>{n}</p>
                <p className="text-[10px] font-black uppercase" style={{ color: "#606770" }}>{label}</p>
              </div>
            ))}
          </div>

          {filtered.length === 0 ? (
            <div className="rounded-2xl p-12 text-center" style={{ background: "#fff" }}>
              <div className="text-5xl mb-3">🔍</div>
              <p className="font-black text-lg" style={{ color: "#606770" }}>No jobs in this area yet</p>
              <button onClick={() => setShowAll(true)}
                className="mt-4 px-4 py-2 rounded-xl font-black text-sm"
                style={{ background: "#1877F2", color: "#fff", border: "none" }}>
                Show All Jobs in Rwanda →
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {filtered.map(job => <JobCard key={job.id} job={job} />)}
            </div>
          )}
          <button onClick={() => setShowAll(v => !v)}
            className="w-full mt-4 p-3 rounded-2xl font-black text-sm"
            style={{ background: "#ffffff33", color: "#fff", border: "1.5px solid #ffffff55" }}>
            {showAll ? "← Show Local Jobs Only" : `+ Show All Jobs in Rwanda (${activeJobs.length})`}
          </button>
        </div>
      )}

      {tab === "account" && (
        <div className="max-w-2xl mx-auto px-4 pb-8 pt-4">
          <div className="rounded-2xl p-5 mb-4"
            style={{ background: "#fff", border: "2px solid #1877F2" }}>
            <p className="font-black text-lg mb-3" style={{ color: "#1877F2" }}>
              👷 Why Create an Account?
            </p>
            {[
              "✅ Employers in your sector find you automatically",
              "✅ Your name and phone are shown directly to employers",
              "✅ They call or WhatsApp you when they need someone",
              "✅ Completely FREE for workers — always",
              "✅ Your profile is visible 24/7",
            ].map(item => (
              <p key={item} className="text-sm font-bold mb-2" style={{ color: "#050505" }}>{item}</p>
            ))}
          </div>
          <button onClick={() => setScreen("register-worker")}
            className="w-full p-4 rounded-2xl font-black text-lg hover:opacity-90"
            style={{ background: "#1877F2", color: "#fff", border: "none" }}>
            👷 Create My Worker Profile — FREE ✅
          </button>
          <div className="mt-4 p-4 rounded-xl text-center"
            style={{ background: "#ffffff22", border: "1.5px solid #ffffff44" }}>
            <p className="text-xs font-bold" style={{ color: "#e7f3ff" }}>
              Not ready? You can still browse jobs without an account.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
