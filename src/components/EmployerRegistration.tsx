import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { TRANSLATIONS, JOB_TYPES } from "../data/mockData";
import { PROVINCES, DISTRICTS } from "../data/locations";
import { EmployerProfile, JobPosting } from "../types";
import { UmukoziLogo } from "./UmukoziLogo";

const DURATIONS = ["1 day", "2-3 days", "1 week", "2 weeks", "1 month", "3 months", "Permanent"];

export const EmployerRegistration: React.FC = () => {
  const { language, setScreen, setEmployer, addJob } = useApp();
  const t = TRANSLATIONS[language];

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [province, setProvince] = useState("");
  const [district, setDistrict] = useState("");
  const [sector, setSector] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [skillNeeded, setSkillNeeded] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [duration, setDuration] = useState("");
  const [error, setError] = useState("");

  const districts = province ? (DISTRICTS[province] || []) : [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone || !province || !district || !sector || !neighborhood) {
      setError(t.fillAllFields);
      return;
    }
    if (!skillNeeded) {
      setError(t.selectOneCategory || "Please select a skill needed");
      return;
    }

    const employerId = "E" + Date.now();
    const employer: EmployerProfile = {
      id: employerId,
      fullName,
      phoneNumber: phone,
      location: { province, district, sector, neighborhood },
      hasPaid: false,
      registeredAt: new Date().toISOString()
    };
    setEmployer(employer);

    // Post the job immediately
    const job: JobPosting = {
      id: "J" + Date.now(),
      employerId,
      employerName: fullName,
      employerPhone: phone,
      skillNeeded,
      description: jobDescription || `${fullName} is looking for a ${skillNeeded} worker in ${sector}, ${district}.`,
      duration: duration || "To be discussed",
      district,
      sector,
      postedAt: new Date().toISOString().split("T")[0],
    };
    addJob(job);

    setScreen("payment");
  };

  const inputStyle = {
    width: "100%", border: "1.5px solid #1877F2", borderRadius: "12px",
    padding: "12px", marginTop: "4px", fontWeight: "bold" as const,
    background: "#f0f2f5", color: "#050505", outline: "none"
  };
  const sectionStyle: React.CSSProperties = {
    background: "#f0f2f5", border: "1.5px solid #e4e6eb", borderRadius: "18px",
    padding: "16px", display: "flex", flexDirection: "column", gap: "12px"
  };

  return (
    <div className="min-h-screen py-8 px-4" style={{ background: "#1877F2" }}>
      <div className="max-w-lg mx-auto p-6" style={{ background: "#fff", borderRadius: "24px", boxShadow: "0 4px 32px #1877F255" }}>
        <div className="text-center mb-6">
          <div className="flex justify-center mb-2"><UmukoziLogo size={56} /></div>
          <h1 className="text-2xl font-black" style={{ color: "#1877F2" }}>UMUKOZI</h1>
          <p className="font-bold mt-1" style={{ color: "#606770" }}>{t.registerEmployer}</p>
          <div className="mt-2 rounded-xl p-2 text-xs font-bold"
            style={{ background: "#fff3e0", color: "#e65100", border: "1px solid #ffcc02" }}>
            {t.employerFee}
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-xl mb-4 font-bold text-sm"
            style={{ background: "#ffebe8", color: "#d32f2f", border: "1px solid #f5c6cb" }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">

          {/* Personal Info */}
          <div style={sectionStyle}>
            <p className="text-xs font-black uppercase" style={{ color: "#1877F2" }}>{t.personalInfo}</p>
            <div>
              <label className="text-xs font-black uppercase" style={{ color: "#606770" }}>{t.fullName} *</label>
              <input value={fullName} onChange={e => setFullName(e.target.value)}
                style={inputStyle} placeholder={t.employerPlaceholderName || "Your full name"} />
            </div>
            <div>
              <label className="text-xs font-black uppercase" style={{ color: "#606770" }}>{t.phone} *</label>
              <input value={phone} onChange={e => setPhone(e.target.value)}
                style={inputStyle} placeholder={t.workerPlaceholderPhone || "07XXXXXXXX"} />
            </div>
          </div>

          {/* Address */}
          <div style={sectionStyle}>
            <p className="text-xs font-black uppercase" style={{ color: "#1877F2" }}>{t.addressInfo}</p>
            <div>
              <label className="text-xs font-black uppercase" style={{ color: "#606770" }}>{t.province} *</label>
              <select value={province} onChange={e => { setProvince(e.target.value); setDistrict(""); }} style={inputStyle}>
                <option value="">{t.selectProvince}</option>
                {PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-black uppercase" style={{ color: "#606770" }}>{t.district} *</label>
              <select value={district} onChange={e => setDistrict(e.target.value)}
                disabled={!province} style={{ ...inputStyle, opacity: !province ? 0.4 : 1 }}>
                <option value="">{t.selectDistrict}</option>
                {districts.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-black uppercase" style={{ color: "#606770" }}>{t.sectorManual} *</label>
              <input value={sector} onChange={e => setSector(e.target.value)}
                style={inputStyle} placeholder={t.employerPlaceholderSector || "e.g. Kimironko"} />
            </div>
            <div>
              <label className="text-xs font-black uppercase" style={{ color: "#606770" }}>{t.neighborhoodManual} *</label>
              <input value={neighborhood} onChange={e => setNeighborhood(e.target.value)}
                style={inputStyle} placeholder={t.employerPlaceholderNeighborhood || "e.g. Kibagabaga"} />
            </div>
          </div>

          {/* Job Posting */}
          <div style={{ ...sectionStyle, background: "#e7f3ff", border: "1.5px solid #1877F2" }}>
            <p className="text-xs font-black uppercase" style={{ color: "#1877F2" }}>
              💼 {t.jobPostingSection || "Job You Want to Post"}
            </p>
            <p className="text-[10px] font-bold" style={{ color: "#606770" }}>
              {t.jobPostingDesc || "Your job will appear in the feed for workers in your area"}
            </p>

            {/* Skill selector */}
            <div>
              <label className="text-xs font-black uppercase" style={{ color: "#606770" }}>
                {t.skillNeeded || "Skill Needed"} *
              </label>
              <div className="flex flex-wrap gap-2 mt-2" style={{ maxHeight: "180px", overflowY: "auto" }}>
                {JOB_TYPES.map(job => (
                  <button type="button" key={job} onClick={() => setSkillNeeded(job)}
                    className="px-3 py-1.5 rounded-full text-xs font-bold transition-all"
                    style={skillNeeded === job
                      ? { background: "#1877F2", color: "#fff", border: "2px solid #1877F2" }
                      : { background: "#fff", color: "#050505", border: "2px solid #e4e6eb" }}>
                    {job}
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="text-xs font-black uppercase" style={{ color: "#606770" }}>
                {t.jobDescription || "Job Description"}
              </label>
              <textarea value={jobDescription} onChange={e => setJobDescription(e.target.value)}
                rows={3} style={{ ...inputStyle, resize: "none" }}
                placeholder={t.jobDescriptionPlaceholder || "Describe what you need, working hours, any requirements..."} />
            </div>

            {/* Duration */}
            <div>
              <label className="text-xs font-black uppercase mb-2 block" style={{ color: "#606770" }}>
                ⏱ {t.duration || "Duration"}
              </label>
              <div className="flex flex-wrap gap-2">
                {DURATIONS.map(d => (
                  <button type="button" key={d} onClick={() => setDuration(d)}
                    className="px-3 py-1.5 rounded-full text-xs font-bold transition-all"
                    style={duration === d
                      ? { background: "#1877F2", color: "#fff", border: "2px solid #1877F2" }
                      : { background: "#fff", color: "#050505", border: "2px solid #e4e6eb" }}>
                    {d}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button type="submit"
            className="w-full p-4 rounded-2xl font-black text-lg transition-all shadow-lg hover:opacity-90"
            style={{ background: "#1877F2", color: "#fff", border: "none" }}>
            {t.submitPay || "Continue to Payment"} — 500 RWF
          </button>
          <button type="button" onClick={() => setScreen("role")}
            className="w-full text-center font-bold text-sm py-2"
            style={{ color: "#606770" }}>
            ← {t.back}
          </button>
        </form>
      </div>
    </div>
  );
};
