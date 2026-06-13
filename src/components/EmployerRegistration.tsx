import React, { useState, useRef } from "react";
import { useApp } from "../context/AppContext";
import { TRANSLATIONS, JOB_TYPES } from "../data/mockData";
import { EmployerProfile, JobPosting } from "../types";
import { UmukoziLogo } from "./UmukoziLogo";

const DURATIONS = ["1 day", "2-3 days", "1 week", "2 weeks", "1 month", "3 months", "Permanent"];

const RWANDA_DISTRICTS = [
  "Gasabo","Kicukiro","Nyarugenge",
  "Musanze","Gicumbi","Burera","Gakenke","Rulindo",
  "Rwamagana","Nyagatare","Kayonza","Gatsibo","Bugesera","Kirehe","Ngoma",
  "Huye","Muhanga","Kamonyi","Nyanza","Ruhango","Gisagara","Nyamagabe","Nyaruguru",
  "Rubavu","Rusizi","Karongi","Rutsiro","Nyabihu","Ngororero","Nyamasheke"
];

export const EmployerRegistration: React.FC = () => {
  const { language, setScreen, setEmployer, addJob } = useApp();
  const t = TRANSLATIONS[language];
  const photoRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState<1|2|3>(1);

  // Step 1 — Personal info
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");

  // Step 2 — Location
  const [district, setDistrict] = useState("");
  const [sector, setSector] = useState("");
  const [neighborhood, setNeighborhood] = useState("");

  // Step 3 — Job posting
  const [skillNeeded, setSkillNeeded] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [duration, setDuration] = useState("");
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoBase64, setPhotoBase64] = useState<string | null>(null);

  const [error, setError] = useState("");

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

  const nextStep = () => {
    setError("");
    if (step === 1) {
      if (!fullName.trim() || !phone.trim()) { setError(t.fillAllFields); return; }
      setStep(2);
    } else if (step === 2) {
      if (!district.trim() || !sector.trim() || !neighborhood.trim()) { setError(t.fillAllFields); return; }
      setStep(3);
    }
  };

  const handleSubmit = () => {
    setError("");
    if (!skillNeeded) { setError(t.selectOneCategory || "Please select a skill needed"); return; }
    if (!jobDescription.trim()) { setError("Please add a job description"); return; }

    const employerId = "E" + Date.now();
    const employer: EmployerProfile = {
      id: employerId,
      fullName,
      phoneNumber: phone,
      location: { province: "", district, sector, neighborhood },
      hasPaid: false,
      registeredAt: new Date().toISOString()
    };
    setEmployer(employer);

    const job: JobPosting = {
      id: "J" + Date.now(),
      employerId,
      employerName: fullName,
      employerPhone: phone,
      skillNeeded,
      description: jobDescription,
      duration: duration || "To be discussed",
      district,
      sector,
      neighborhood,
      photoUrl: photoBase64 || undefined,
      postedAt: new Date().toISOString().split("T")[0],
    };
    addJob(job);
    setScreen("payment");
  };

  const inputStyle: React.CSSProperties = {
    width: "100%", border: "1.5px solid #1877F2", borderRadius: "12px",
    padding: "13px", marginTop: "5px", fontWeight: "bold",
    background: "#f0f2f5", color: "#050505", outline: "none", fontSize: "15px"
  };

  const sectionStyle: React.CSSProperties = {
    background: "#f0f2f5", border: "1.5px solid #e4e6eb", borderRadius: "18px",
    padding: "16px", display: "flex", flexDirection: "column", gap: "12px"
  };

  // Progress bar
  const StepBar = () => (
    <div className="flex items-center gap-2 mb-6">
      {[1,2,3].map(n => (
        <React.Fragment key={n}>
          <div className="flex items-center justify-center w-8 h-8 rounded-full text-sm font-black"
            style={{
              background: step >= n ? "#1877F2" : "#e4e6eb",
              color: step >= n ? "#fff" : "#606770"
            }}>
            {step > n ? "✓" : n}
          </div>
          {n < 3 && <div className="flex-1 h-1 rounded-full"
            style={{ background: step > n ? "#1877F2" : "#e4e6eb" }} />}
        </React.Fragment>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen py-8 px-4" style={{ background: "#1877F2" }}>
      <div className="max-w-lg mx-auto p-6" style={{ background: "#fff", borderRadius: "24px", boxShadow: "0 4px 32px #1877F255" }}>

        <div className="text-center mb-5">
          <div className="flex justify-center mb-2"><UmukoziLogo size={48} /></div>
          <h1 className="text-2xl font-black" style={{ color: "#1877F2" }}>UMUKOZI</h1>
          <p className="font-bold mt-1 text-sm" style={{ color: "#606770" }}>
            {step === 1 ? (t.registerEmployer || "Register as Employer") :
             step === 2 ? "📍 " + (t.yourLocation || "Your Location") :
             "💼 " + (t.jobPostingSection || "Post Your Job")}
          </p>
          <div className="mt-2 rounded-xl p-2 text-xs font-bold"
            style={{ background: "#fff3e0", color: "#e65100", border: "1px solid #ffcc02" }}>
            500 RWF · Mobile Money · One-time
          </div>
        </div>

        <StepBar />

        {error && (
          <div className="p-3 rounded-xl mb-4 font-bold text-sm"
            style={{ background: "#ffebe8", color: "#d32f2f", border: "1px solid #f5c6cb" }}>
            ⚠️ {error}
          </div>
        )}

        {/* ─── STEP 1: Personal Info ─── */}
        {step === 1 && (
          <div className="flex flex-col gap-5">
            <div style={sectionStyle}>
              <p className="text-xs font-black uppercase" style={{ color: "#1877F2" }}>{t.personalInfo || "Personal Info"}</p>
              <div>
                <label className="text-xs font-black uppercase" style={{ color: "#606770" }}>{t.fullName || "Full Name"} *</label>
                <input value={fullName} onChange={e => setFullName(e.target.value)}
                  style={inputStyle} placeholder="Your full name" />
              </div>
              <div>
                <label className="text-xs font-black uppercase" style={{ color: "#606770" }}>{t.phone || "Phone"} *</label>
                <input value={phone} onChange={e => setPhone(e.target.value)}
                  style={inputStyle} placeholder="07XXXXXXXX" type="tel" />
              </div>
            </div>

            <button onClick={nextStep}
              className="w-full p-4 rounded-2xl font-black text-lg hover:opacity-90"
              style={{ background: "#1877F2", color: "#fff", border: "none" }}>
              {t.continueBtn || "Continue"} →
            </button>
            <button onClick={() => setScreen("role")}
              className="w-full text-center font-bold text-sm py-1"
              style={{ color: "#606770", background: "none", border: "none" }}>
              ← {t.back || "Back"}
            </button>
          </div>
        )}

        {/* ─── STEP 2: Location ─── */}
        {step === 2 && (
          <div className="flex flex-col gap-5">
            <div style={sectionStyle}>
              <p className="text-xs font-black uppercase" style={{ color: "#1877F2" }}>📍 {t.addressInfo || "Your Location"}</p>

              {/* District dropdown */}
              <div>
                <label className="text-xs font-black uppercase" style={{ color: "#606770" }}>{t.district || "District"} *</label>
                <select value={district} onChange={e => setDistrict(e.target.value)} style={inputStyle}>
                  <option value="">{t.selectDistrict2 || "Select district"}</option>
                  {RWANDA_DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>

              {/* Sector text input */}
              <div>
                <label className="text-xs font-black uppercase" style={{ color: "#606770" }}>{t.sector || "Sector"} *</label>
                <input value={sector} onChange={e => setSector(e.target.value)}
                  style={inputStyle} placeholder="e.g. Kimironko, Muhoza..." />
                <p className="text-[10px] font-bold mt-1" style={{ color: "#1877F2" }}>
                  ℹ️ Workers in this sector will see your job first
                </p>
              </div>

              {/* Neighborhood / Area */}
              <div>
                <label className="text-xs font-black uppercase" style={{ color: "#606770" }}>
                  {t.neighborhoodManual || "Area / Neighborhood"} *
                </label>
                <input value={neighborhood} onChange={e => setNeighborhood(e.target.value)}
                  style={inputStyle} placeholder="e.g. Kibagabaga, Agatare..." />
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep(1)}
                className="flex-1 p-4 rounded-2xl font-black text-base"
                style={{ background: "#f0f2f5", color: "#606770", border: "none" }}>
                ← {t.back || "Back"}
              </button>
              <button onClick={nextStep}
                className="flex-[2] p-4 rounded-2xl font-black text-base hover:opacity-90"
                style={{ background: "#1877F2", color: "#fff", border: "none" }}>
                {t.continueBtn || "Continue"} →
              </button>
            </div>
          </div>
        )}

        {/* ─── STEP 3: Job Posting ─── */}
        {step === 3 && (
          <div className="flex flex-col gap-5">
            <div style={{ ...sectionStyle, background: "#e7f3ff", border: "1.5px solid #1877F2" }}>
              <p className="text-xs font-black uppercase" style={{ color: "#1877F2" }}>
                💼 {t.jobPostingSection || "Job Details"}
              </p>
              <p className="text-[10px] font-bold" style={{ color: "#606770" }}>
                Workers in <strong>{sector}, {district}</strong> will see this first
              </p>

              {/* Skill needed */}
              <div>
                <label className="text-xs font-black uppercase mb-2 block" style={{ color: "#606770" }}>
                  {t.skillNeeded || "Skill Needed"} *
                </label>
                <div className="flex flex-wrap gap-2" style={{ maxHeight: "180px", overflowY: "auto" }}>
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
                  {t.jobDescription || "Job Description"} *
                </label>
                <textarea value={jobDescription} onChange={e => setJobDescription(e.target.value)}
                  rows={4} style={{ ...inputStyle, resize: "none" }}
                  placeholder="Describe the job: hours, requirements, what the worker will do..." />
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

              {/* Photo upload (optional) */}
              <div>
                <label className="text-xs font-black uppercase mb-2 block" style={{ color: "#606770" }}>
                  📷 Photo (optional — show job site or what you need)
                </label>
                <input ref={photoRef} type="file" accept="image/*" onChange={handlePhoto}
                  style={{ display: "none" }} />
                {photoPreview ? (
                  <div className="relative">
                    <img src={photoPreview} alt="Job photo"
                      className="w-full rounded-xl object-cover" style={{ maxHeight: "180px" }} />
                    <button onClick={() => { setPhotoPreview(null); setPhotoBase64(null); }}
                      className="absolute top-2 right-2 rounded-full w-8 h-8 font-black text-sm flex items-center justify-center"
                      style={{ background: "#d32f2f", color: "#fff", border: "none" }}>
                      ✕
                    </button>
                  </div>
                ) : (
                  <button onClick={() => photoRef.current?.click()}
                    className="w-full p-4 rounded-xl font-bold text-sm"
                    style={{ background: "#fff", border: "2px dashed #1877F2", color: "#1877F2" }}>
                    📷 Add a Photo
                  </button>
                )}
              </div>
            </div>

            {/* Submit */}
            <button onClick={handleSubmit}
              className="w-full p-4 rounded-2xl font-black text-lg hover:opacity-90"
              style={{ background: "#1877F2", color: "#fff", border: "none" }}>
              {t.submitPay || "Post Job & Pay"} — 500 RWF 💳
            </button>
            <button onClick={() => setStep(2)}
              className="w-full text-center font-bold text-sm py-1"
              style={{ color: "#606770", background: "none", border: "none" }}>
              ← {t.back || "Back"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
