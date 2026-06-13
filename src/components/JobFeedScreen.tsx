import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { TRANSLATIONS, JOB_TYPES } from "../data/mockData";
import { JobPosting } from "../types";

const timeAgo = (dateStr: string) => {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 86400000);
  if (diff === 0) return "Today";
  if (diff === 1) return "Yesterday";
  return `${diff}d ago`;
};

export const JobFeedScreen: React.FC = () => {
  const { language, setScreen, workerLocation, jobs } = useApp();
  const t = TRANSLATIONS[language];

  const [tab, setTab] = useState<"feed" | "account">("feed");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [searchSkill, setSearchSkill] = useState("");
  const [showAll, setShowAll] = useState(false);

  const sectorJobs = jobs.filter(j =>
    j.district?.toLowerCase() === workerLocation?.district?.toLowerCase() &&
    j.sector?.toLowerCase() === workerLocation?.sector?.toLowerCase()
  );
  const nearbyJobs = jobs.filter(j =>
    j.district?.toLowerCase() === workerLocation?.district?.toLowerCase() &&
    j.sector?.toLowerCase() !== workerLocation?.sector?.toLowerCase()
  );
  const allLocal = [...sectorJobs, ...nearbyJobs];

  const filtered = (showAll ? jobs : allLocal).filter(j =>
    searchSkill === "" || j.skillNeeded.toLowerCase().includes(searchSkill.toLowerCase())
  );

  const inputStyle: React.CSSProperties = {
    width: "100%", border: "1.5px solid #1877F2", borderRadius: "12px",
    padding: "12px 12px 12px 40px", fontWeight: "bold",
    background: "#f0f2f5", color: "#050505", outline: "none",
  };

  const ContactReveal: React.FC<{ job: JobPosting }> = ({ job }) => {
    const [revealed, setRevealed] = useState(false);
    if (revealed) {
      return (
        <div className="mt-3 rounded-xl p-3 flex flex-col gap-2"
          style={{ background: "#e7f3ff", border: "1.5px solid #1877F2" }}>
          <p className="text-xs font-black uppercase" style={{ color: "#1877F2" }}>📞 Contact Employer</p>
          <a href={`tel:${job.employerPhone}`}
            className="w-full p-3 rounded-xl font-black text-center text-sm"
            style={{ background: "#1877F2", color: "#fff", textDecoration: "none" }}
            onClick={e => e.stopPropagation()}>
            📞 {job.employerPhone}
          </a>
          <a href={`https://wa.me/250${job.employerPhone.replace(/^0/, "")}`}
            target="_blank" rel="noreferrer"
            className="w-full p-3 rounded-xl font-black text-center text-sm"
            style={{ background: "#25D366", color: "#fff", textDecoration: "none" }}
            onClick={e => e.stopPropagation()}>
            💬 WhatsApp {job.employerName}
          </a>
        </div>
      );
    }
    return (
      <button onClick={e => { e.stopPropagation(); setRevealed(true); }}
        className="w-full mt-3 p-3 rounded-xl font-black text-sm hover:opacity-90"
        style={{ background: "#1877F2", color: "#fff", border: "none" }}>
        👁 View Employer Contact — {job.employerName}
      </button>
    );
  };

  return (
    <div className="min-h-screen" style={{ background: "#1877F2" }}>

      {/* Header */}
      <div className="sticky top-0 z-20 px-4 py-3"
        style={{ background: "#1877F2", borderBottom: "1px solid #1565C0" }}>
        <div className="max-w-2xl mx-auto flex items-center justify-between gap-3">
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

        {/* Tabs */}
        <div className="max-w-2xl mx-auto mt-3 flex gap-2">
          <button onClick={() => setTab("feed")}
            className="flex-1 py-2 rounded-xl font-black text-sm transition-all"
            style={tab === "feed"
              ? { background: "#fff", color: "#1877F2", border: "none" }
              : { background: "#ffffff22", color: "#fff", border: "1.5px solid #ffffff44" }}>
            💼 Job Feed
          </button>
          <button onClick={() => setTab("account")}
            className="flex-1 py-2 rounded-xl font-black text-sm transition-all"
            style={tab === "account"
              ? { background: "#fff", color: "#1877F2", border: "none" }
              : { background: "#ffffff22", color: "#fff", border: "1.5px solid #ffffff44" }}>
            👷 Create Account
          </button>
        </div>
      </div>

      {/* ─── TAB: JOB FEED ─── */}
      {tab === "feed" && (
        <div className="max-w-2xl mx-auto px-4 pb-8 pt-4">
          {/* Search */}
          <div className="relative mb-4">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lg">🔍</span>
            <input value={searchSkill} onChange={e => setSearchSkill(e.target.value)}
              style={inputStyle} placeholder="Search by skill (plumber, cook...)" />
          </div>

          {/* Stats */}
          <div className="flex gap-2 mb-4">
            {[
              { count: sectorJobs.length, label: "In Your Sector" },
              { count: nearbyJobs.length, label: "Nearby" },
              { count: jobs.length, label: "Total Jobs" },
            ].map(({ count, label }) => (
              <div key={label} className="flex-1 rounded-xl p-3 text-center" style={{ background: "#fff" }}>
                <p className="text-2xl font-black" style={{ color: "#1877F2" }}>{count}</p>
                <p className="text-[10px] font-black uppercase" style={{ color: "#606770" }}>{label}</p>
              </div>
            ))}
          </div>

          {/* Skill filter pills */}
          <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
            {["", ...JOB_TYPES.slice(0, 8)].map(s => (
              <button key={s} onClick={() => setSearchSkill(s)}
                className="shrink-0 px-3 py-1 rounded-full text-xs font-bold"
                style={searchSkill === s
                  ? { background: "#fff", color: "#1877F2", border: "2px solid #fff" }
                  : { background: "#ffffff22", color: "#fff", border: "1.5px solid #ffffff44" }}>
                {s === "" ? "All" : s.split(" / ")[0]}
              </button>
            ))}
          </div>

          {/* Job cards */}
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
              {filtered.map(job => {
                const isExpanded = expandedId === job.id;
                const isSector = job.sector?.toLowerCase() === workerLocation?.sector?.toLowerCase();
                return (
                  <div key={job.id} onClick={() => setExpandedId(isExpanded ? null : job.id)}
                    style={{
                      background: "#fff", borderRadius: "18px", padding: "16px", cursor: "pointer",
                      border: `1.5px solid ${isExpanded ? "#1877F2" : "#e4e6eb"}`,
                      boxShadow: isExpanded ? "0 4px 16px #1877F222" : "none", transition: "all 0.2s"
                    }}>

                    {/* Photo if any */}
                    {job.photoUrl && (
                      <img src={job.photoUrl} alt="Job"
                        className="w-full rounded-xl object-cover mb-3" style={{ maxHeight: "140px" }} />
                    )}

                    <div className="flex justify-between items-start gap-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full"
                            style={isSector
                              ? { background: "#e7f3ff", color: "#1877F2", border: "1px solid #1877F2" }
                              : { background: "#f0f2f5", color: "#606770", border: "1px solid #e4e6eb" }}>
                            {isSector ? `📍 ${job.sector}` : `🗺 ${job.sector}, ${job.district}`}
                          </span>
                          <span className="text-[10px] font-bold" style={{ color: "#bcc0c4" }}>
                            {timeAgo(job.postedAt)}
                          </span>
                        </div>
                        <h3 className="font-black text-base leading-tight" style={{ color: "#050505" }}>
                          {job.skillNeeded}
                        </h3>
                        <p className="text-xs font-bold mt-1" style={{ color: "#606770" }}>
                          🏢 {job.employerName} · {job.neighborhood || job.sector}
                        </p>
                      </div>
                      <div className="shrink-0 rounded-xl px-3 py-1.5 text-center"
                        style={{ background: "#e7f3ff", border: "1px solid #1877F2" }}>
                        <p className="text-[10px] font-black uppercase" style={{ color: "#1877F2" }}>
                          ⏱ {job.duration}
                        </p>
                      </div>
                    </div>

                    {isExpanded && (
                      <div onClick={e => e.stopPropagation()}>
                        <div className="mt-3 p-3 rounded-xl" style={{ background: "#f0f2f5" }}>
                          <p className="text-xs font-black uppercase mb-1" style={{ color: "#606770" }}>
                            📋 Job Description
                          </p>
                          <p className="text-sm font-bold leading-relaxed" style={{ color: "#050505" }}>
                            {job.description}
                          </p>
                        </div>
                        <ContactReveal job={job} />
                      </div>
                    )}
                    {!isExpanded && (
                      <p className="text-[10px] font-bold mt-2 text-right" style={{ color: "#1877F2" }}>
                        Tap to see details & contact →
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Toggle all */}
          {!showAll ? (
            <button onClick={() => setShowAll(true)}
              className="w-full mt-4 p-3 rounded-2xl font-black text-sm"
              style={{ background: "#ffffff33", color: "#fff", border: "1.5px solid #ffffff55" }}>
              + Show All Jobs in Rwanda ({jobs.length})
            </button>
          ) : (
            <button onClick={() => setShowAll(false)}
              className="w-full mt-4 p-3 rounded-2xl font-black text-sm"
              style={{ background: "#ffffff33", color: "#fff", border: "1.5px solid #ffffff55" }}>
              ← Show Local Jobs Only
            </button>
          )}
        </div>
      )}

      {/* ─── TAB: CREATE ACCOUNT ─── */}
      {tab === "account" && (
        <div className="max-w-2xl mx-auto px-4 pb-8 pt-4">
          <div className="rounded-2xl p-5 mb-4"
            style={{ background: "#fff", border: "2px solid #1877F2" }}>
            <p className="font-black text-lg" style={{ color: "#1877F2" }}>
              👷 Why Create an Account?
            </p>
            <ul className="mt-3 flex flex-col gap-2">
              {[
                "✅ Employers in your sector find you automatically",
                "✅ Your profile shows when they search for your skill",
                "✅ They can call or WhatsApp you directly",
                "✅ It is completely FREE for workers",
                "✅ You stay visible 24/7 — even while looking for work",
              ].map(item => (
                <li key={item} className="text-sm font-bold" style={{ color: "#050505" }}>{item}</li>
              ))}
            </ul>
          </div>

          <button onClick={() => setScreen("register-worker")}
            className="w-full p-4 rounded-2xl font-black text-lg hover:opacity-90"
            style={{ background: "#1877F2", color: "#fff", border: "none" }}>
            👷 Create My Worker Profile — FREE ✅
          </button>

          <div className="mt-4 rounded-xl p-4 text-center"
            style={{ background: "#ffffff22", border: "1.5px solid #ffffff44" }}>
            <p className="text-xs font-bold" style={{ color: "#e7f3ff" }}>
              Not ready yet? You can still browse jobs for free without an account.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
