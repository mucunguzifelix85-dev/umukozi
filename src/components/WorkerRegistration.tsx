import React, { useState, useRef } from "react";
import { useApp } from "../context/AppContext";
import { TRANSLATIONS, JOB_TYPES } from "../data/mockData";
import { WorkerProfile } from "../types";
import { UmukoziLogo } from "./UmukoziLogo";

export const WorkerRegistration: React.FC = () => {
  const { language, setScreen, addWorker, workerLocation } = useApp();
  const t = TRANSLATIONS[language];
  const photoRef = useRef<HTMLInputElement>(null);

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [workExperience, setWorkExperience] = useState("");
  const [summary, setSummary] = useState("");
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoBase64, setPhotoBase64] = useState<string | null>(null);
  const [error, setError] = useState("");

  const toggleSkill = (job: string) => {
    setSkills(prev => prev.includes(job) ? prev.filter(j => j !== job) : [...prev, job]);
  };

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result as string;
      setPhotoPreview(result);
      setPhotoBase64(result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone) { setError(t.fillAllFields); return; }
    if (skills.length === 0) { setError(t.selectOneCategory); return; }

    const worker: WorkerProfile = {
      id: "W" + Date.now(),
      fullName,
      phoneNumber: phone,
      location: {
        province: "",
        district: workerLocation?.district || "",
        sector: workerLocation?.sector || "",
        neighborhood: workerLocation?.village || ""
      },
      skills,
      experiencedIn: workExperience ? [workExperience] : [],
      summary,
      photoUrl: photoBase64 || undefined,
      registeredAt: new Date().toISOString()
    };
    addWorker(worker);
    alert(t.registrationSuccess || "Profile created! Employers in your area can now find you.");
    setScreen("job-feed");
  };

  const inputStyle: React.CSSProperties = {
    width: "100%", border: "1.5px solid #1877F2", borderRadius: "12px",
    padding: "12px", marginTop: "4px", fontWeight: "bold",
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
          <div className="flex justify-center mb-2"><UmukoziLogo size={48} /></div>
          <h1 className="text-2xl font-black" style={{ color: "#1877F2" }}>UMUKOZI</h1>
          <p className="font-bold mt-1" style={{ color: "#606770" }}>
            {t.registerWorker || "Create Worker Profile"}
          </p>
          <div className="mt-2 rounded-xl p-2 text-xs font-bold"
            style={{ background: "#e7f3ff", color: "#1877F2", border: "1px solid #1877F2" }}>
            ✅ 100% FREE for workers
          </div>
        </div>

        {/* Location tag */}
        {workerLocation && (
          <div className="rounded-xl p-3 mb-4 flex items-center gap-2"
            style={{ background: "#e7f3ff", border: "1.5px solid #1877F2" }}>
            <span className="text-lg">📍</span>
            <div className="flex-1">
              <p className="text-xs font-black uppercase" style={{ color: "#1877F2" }}>Your Location</p>
              <p className="text-sm font-bold" style={{ color: "#050505" }}>
                {workerLocation.village} · {workerLocation.sector} · {workerLocation.district}
              </p>
            </div>
            <button onClick={() => setScreen("location-worker")}
              className="text-xs font-black px-2 py-1 rounded-lg"
              style={{ background: "#1877F2", color: "#fff", border: "none" }}>
              ✏️
            </button>
          </div>
        )}

        {error && (
          <div className="p-3 rounded-xl mb-4 font-bold text-sm"
            style={{ background: "#ffebe8", color: "#d32f2f", border: "1px solid #f5c6cb" }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">

          {/* Personal info */}
          <div style={sectionStyle}>
            <p className="text-xs font-black uppercase" style={{ color: "#1877F2" }}>
              {t.personalInfo || "Personal Info"}
            </p>

            {/* Photo */}
            <div className="flex items-center gap-4">
              <div className="shrink-0">
                {photoPreview ? (
                  <div className="relative">
                    <img src={photoPreview} alt="Profile"
                      className="w-20 h-20 rounded-full object-cover"
                      style={{ border: "3px solid #1877F2" }} />
                    <button type="button" onClick={() => { setPhotoPreview(null); setPhotoBase64(null); }}
                      className="absolute -top-1 -right-1 rounded-full w-6 h-6 font-black text-xs flex items-center justify-center"
                      style={{ background: "#d32f2f", color: "#fff", border: "none" }}>
                      ✕
                    </button>
                  </div>
                ) : (
                  <button type="button" onClick={() => photoRef.current?.click()}
                    className="w-20 h-20 rounded-full flex flex-col items-center justify-center"
                    style={{ background: "#e7f3ff", border: "2px dashed #1877F2" }}>
                    <span className="text-2xl">📷</span>
                    <span className="text-[9px] font-black" style={{ color: "#1877F2" }}>Photo</span>
                  </button>
                )}
                <input ref={photoRef} type="file" accept="image/*" onChange={handlePhoto}
                  style={{ display: "none" }} />
              </div>
              <div className="flex-1 flex flex-col gap-2">
                <div>
                  <label className="text-xs font-black uppercase" style={{ color: "#606770" }}>
                    {t.fullName || "Full Name"} *
                  </label>
                  <input value={fullName} onChange={e => setFullName(e.target.value)}
                    style={inputStyle} placeholder="Your full name" />
                </div>
                <div>
                  <label className="text-xs font-black uppercase" style={{ color: "#606770" }}>
                    {t.phone || "Phone"} *
                  </label>
                  <input value={phone} onChange={e => setPhone(e.target.value)}
                    style={inputStyle} placeholder="07XXXXXXXX" type="tel" />
                </div>
              </div>
            </div>
          </div>

          {/* Skills */}
          <div style={sectionStyle}>
            <p className="text-xs font-black uppercase" style={{ color: "#1877F2" }}>
              {t.workExperience || "Your Skills"} *
            </p>
            <div>
              <label className="text-xs font-black uppercase" style={{ color: "#606770" }}>
                {t.jobsCapable || "Select skills"} *
              </label>
              <div className="flex flex-wrap gap-2 mt-2 pr-1" style={{ maxHeight: "200px", overflowY: "auto" }}>
                {JOB_TYPES.map(job => (
                  <button type="button" key={job} onClick={() => toggleSkill(job)}
                    className="px-3 py-1.5 rounded-full text-xs font-bold transition-all"
                    style={skills.includes(job)
                      ? { background: "#1877F2", color: "#fff", border: "2px solid #1877F2" }
                      : { background: "#fff", color: "#050505", border: "2px solid #e4e6eb" }}>
                    {job}
                  </button>
                ))}
              </div>
              {skills.length > 0 && (
                <p className="text-xs font-bold mt-2" style={{ color: "#1877F2" }}>
                  {skills.length} skill(s) selected ✅
                </p>
              )}
            </div>
            <div>
              <label className="text-xs font-black uppercase" style={{ color: "#606770" }}>
                {t.workYouDo || "Describe your experience"}
              </label>
              <textarea value={workExperience} onChange={e => setWorkExperience(e.target.value)}
                rows={3} style={{ ...inputStyle, resize: "none" }}
                placeholder="e.g. 3 years cleaning houses, experienced with children..." />
            </div>
          </div>

          {/* Summary */}
          <div style={sectionStyle}>
            <p className="text-xs font-black uppercase" style={{ color: "#1877F2" }}>
              {t.professionalSummary || "About You"}
            </p>
            <div>
              <label className="text-xs font-black uppercase" style={{ color: "#606770" }}>
                Short description (optional)
              </label>
              <textarea value={summary} onChange={e => setSummary(e.target.value)}
                rows={3} style={{ ...inputStyle, resize: "none" }}
                placeholder="Tell employers why they should hire you..." />
            </div>
          </div>

          <button type="submit"
            className="w-full p-4 rounded-2xl font-black text-lg hover:opacity-90"
            style={{ background: "#1877F2", color: "#fff", border: "none" }}>
            ✅ {t.submit || "Create My Profile"} — FREE
          </button>
          <button type="button" onClick={() => setScreen("job-feed")}
            className="w-full text-center font-bold text-sm py-2"
            style={{ color: "#606770", background: "none", border: "none" }}>
            ← {t.back || "Back to Jobs"}
          </button>
        </form>
      </div>
    </div>
  );
};
