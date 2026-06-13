import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { TRANSLATIONS } from "../data/mockData";
import { JobPosting } from "../types";

const timeAgo = (dateStr: string) => {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 86400000);
  if (diff === 0) return "Today";
  if (diff === 1) return "Yesterday";
  return `${diff} days ago`;
};

export const JobFeedScreen: React.FC = () => {
  const { language, setScreen, workerLocation, jobs } = useApp();
  const t = TRANSLATIONS[language];

  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [searchSkill, setSearchSkill] = useState("");
  const [showAll, setShowAll] = useState(false);

  // Jobs matching the worker's sector (primary) OR district (secondary)
  const sectorJobs = jobs.filter(j =>
    j.district === workerLocation?.district &&
    j.sector === workerLocation?.sector
  );
  const nearbyJobs = jobs.filter(j =>
    j.district === workerLocation?.district &&
    j.sector !== workerLocation?.sector
  );

  const allLocal = [...sectorJobs, ...nearbyJobs];

  const filtered = (showAll ? jobs : allLocal).filter(j =>
    searchSkill === "" || j.skillNeeded.toLowerCase().includes(searchSkill.toLowerCase())
  );

  const inputStyle = {
    width: "100%",
    border: "1.5px solid #1877F2",
    borderRadius: "12px",
    padding: "12px 12px 12px 40px",
    fontWeight: "bold" as const,
    background: "#f0f2f5",
    color: "#050505",
    outline: "none",
  };

  const cardStyle = (isExpanded: boolean): React.CSSProperties => ({
    background: "#fff",
    border: `1.5px solid ${isExpanded ? "#1877F2" : "#e4e6eb"}`,
    borderRadius: "18px",
    padding: "16px",
    cursor: "pointer",
    transition: "all 0.2s",
    boxShadow: isExpanded ? "0 4px 16px #1877F222" : "none",
  });

  const ContactReveal: React.FC<{ job: JobPosting }> = ({ job }) => {
    const [revealed, setRevealed] = useState(false);

    if (revealed) {
      return (
        <div className="mt-3 rounded-xl p-3 flex flex-col gap-2"
          style={{ background: "#e7f3ff", border: "1.5px solid #1877F2" }}>
          <p className="text-xs font-black uppercase" style={{ color: "#1877F2" }}>
            📞 {t.contactEmployer || "Contact Employer"}
          </p>
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
      <button
        onClick={e => { e.stopPropagation(); setRevealed(true); }}
        className="w-full mt-3 p-3 rounded-xl font-black text-sm transition-all hover:opacity-90"
        style={{ background: "#1877F2", color: "#fff", border: "none" }}>
        👁 {t.viewContact || "View Employer Contact"} — {job.employerName}
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
              💼 {t.jobsNearYou || "Jobs Near You"}
            </h1>
            <p className="text-xs font-bold" style={{ color: "#e7f3ff" }}>
              📍 {workerLocation?.sector} · {workerLocation?.district}
            </p>
          </div>
          <button onClick={() => setScreen("location-worker")}
            className="text-xs font-black px-3 py-2 rounded-xl"
            style={{ background: "#fff", color: "#1877F2", border: "none" }}>
            📍 {t.changeLocation || "Change"}
          </button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 pb-8 pt-4">

        {/* Search bar */}
        <div className="relative mb-4">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lg">🔍</span>
          <input
            value={searchSkill}
            onChange={e => setSearchSkill(e.target.value)}
            style={inputStyle}
            placeholder={t.searchByJob || "Search by skill (e.g. plumber, cook...)"}
          />
        </div>

        {/* Stats row */}
        <div className="flex gap-2 mb-4">
          <div className="flex-1 rounded-xl p-3 text-center"
            style={{ background: "#fff", border: "1.5px solid #e4e6eb" }}>
            <p className="text-2xl font-black" style={{ color: "#1877F2" }}>{sectorJobs.length}</p>
            <p className="text-[10px] font-black uppercase" style={{ color: "#606770" }}>
              {t.inYourSector || "In Your Sector"}
            </p>
          </div>
          <div className="flex-1 rounded-xl p-3 text-center"
            style={{ background: "#fff", border: "1.5px solid #e4e6eb" }}>
            <p className="text-2xl font-black" style={{ color: "#1877F2" }}>{nearbyJobs.length}</p>
            <p className="text-[10px] font-black uppercase" style={{ color: "#606770" }}>
              {t.nearbyDistrict || "Nearby"}
            </p>
          </div>
          <div className="flex-1 rounded-xl p-3 text-center"
            style={{ background: "#fff", border: "1.5px solid #e4e6eb" }}>
            <p className="text-2xl font-black" style={{ color: "#1877F2" }}>{jobs.length}</p>
            <p className="text-[10px] font-black uppercase" style={{ color: "#606770" }}>
              {t.totalJobs || "Total Jobs"}
            </p>
          </div>
        </div>

        {/* Sector label */}
        {sectorJobs.length > 0 && (
          <div className="flex items-center gap-2 mb-3">
            <div style={{ height: "2px", flex: 1, background: "#fff3" }} />
            <span className="text-xs font-black uppercase px-3 py-1 rounded-full"
              style={{ background: "#fff", color: "#1877F2" }}>
              📍 {workerLocation?.sector}
            </span>
            <div style={{ height: "2px", flex: 1, background: "#fff3" }} />
          </div>
        )}

        {/* Job cards */}
        {filtered.length === 0 ? (
          <div className="rounded-2xl p-12 text-center" style={{ background: "#fff" }}>
            <div className="text-5xl mb-3">🔍</div>
            <p className="font-black text-lg" style={{ color: "#606770" }}>
              {t.noJobsYet || "No jobs in this area yet"}
            </p>
            <p className="text-xs mt-2 font-bold" style={{ color: "#bcc0c4" }}>
              {t.checkOtherSectors || "Try searching a different skill or sector"}
            </p>
            <button onClick={() => setShowAll(true)}
              className="mt-4 px-4 py-2 rounded-xl font-black text-sm"
              style={{ background: "#1877F2", color: "#fff", border: "none" }}>
              {t.showAllJobs || "Show All Jobs in Rwanda"} →
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map(job => {
              const isExpanded = expandedId === job.id;
              const isSector = job.sector === workerLocation?.sector;
              return (
                <div key={job.id}
                  style={cardStyle(isExpanded)}
                  onClick={() => setExpandedId(isExpanded ? null : job.id)}>

                  {/* Top row */}
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex-1">
                      {/* Sector badge */}
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
                      {/* Skill title */}
                      <h3 className="font-black text-base leading-tight" style={{ color: "#050505" }}>
                        {job.skillNeeded}
                      </h3>
                      {/* Employer */}
                      <p className="text-xs font-bold mt-1" style={{ color: "#606770" }}>
                        🏢 {job.employerName}
                      </p>
                    </div>
                    {/* Duration pill */}
                    <div className="shrink-0 rounded-xl px-3 py-1.5 text-center"
                      style={{ background: "#e7f3ff", border: "1px solid #1877F2" }}>
                      <p className="text-[10px] font-black uppercase" style={{ color: "#1877F2" }}>
                        ⏱ {job.duration}
                      </p>
                    </div>
                  </div>

                  {/* Expanded content */}
                  {isExpanded && (
                    <div onClick={e => e.stopPropagation()}>
                      <div className="mt-3 p-3 rounded-xl"
                        style={{ background: "#f0f2f5", border: "1px solid #e4e6eb" }}>
                        <p className="text-xs font-black uppercase mb-1" style={{ color: "#606770" }}>
                          📋 {t.jobDescription || "Job Description"}
                        </p>
                        <p className="text-sm font-bold leading-relaxed" style={{ color: "#050505" }}>
                          {job.description}
                        </p>
                      </div>
                      <ContactReveal job={job} />
                    </div>
                  )}

                  {/* Tap hint */}
                  {!isExpanded && (
                    <p className="text-[10px] font-bold mt-2 text-right" style={{ color: "#1877F2" }}>
                      {t.tapToExpand || "Tap to see details & contact →"}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Toggle all jobs */}
        {!showAll && nearbyJobs.length > 0 && (
          <button onClick={() => setShowAll(true)}
            className="w-full mt-4 p-3 rounded-2xl font-black text-sm"
            style={{ background: "#ffffff33", color: "#fff", border: "1.5px solid #ffffff55" }}>
            + {t.showAllJobs || "Show All Jobs in Rwanda"} ({jobs.length})
          </button>
        )}
        {showAll && (
          <button onClick={() => setShowAll(false)}
            className="w-full mt-4 p-3 rounded-2xl font-black text-sm"
            style={{ background: "#ffffff33", color: "#fff", border: "1.5px solid #ffffff55" }}>
            ← {t.showLocalOnly || "Show Local Jobs Only"}
          </button>
        )}

        {/* Register as worker CTA */}
        <div className="mt-6 rounded-2xl p-5 text-center"
          style={{ background: "#fff", border: "2px solid #1877F2" }}>
          <p className="text-lg font-black" style={{ color: "#050505" }}>👷 {t.iAmLookingForWork || "Are you a worker?"}</p>
          <p className="text-xs font-bold mt-1 mb-3" style={{ color: "#606770" }}>
            {t.registrationFree || "Register for FREE so employers can find you too"}
          </p>
          <button onClick={() => setScreen("register-worker")}
            className="w-full p-3 rounded-2xl font-black text-sm hover:opacity-90"
            style={{ background: "#1877F2", color: "#fff", border: "none" }}>
            {t.registerWorker || "Register as Job Seeker"} — FREE ✅
          </button>
        </div>
      </div>
    </div>
  );
};
