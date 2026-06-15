import React, { useState, useRef } from "react";
import { useApp } from "../context/AppContext";
import { EmployerProfile, JobPosting } from "../types";
import { UmukoziLogo } from "./UmukoziLogo";

const DISTRICTS = ["Gasabo","Kicukiro","Nyarugenge","Bugesera","Gatsibo","Kayonza","Kirehe","Masinagabo","Ngoma","Nyagatare","Rwamagana","Burera","Gakenke","Gicumbi","Musanze","Rulindo","Gisagara","Huye","Kamonyi","Muhanga","Nyamagabe","Nyanza","Nyaruguru","Ruhango","Karongi","Ngororero","Nyabihu","Nyamasheke","Rubavu","Rutsiro","Rusizi"];
const JOB_TYPES = ["House Cleaner","Cook / Chef","Childcare / Nanny","Gardener","Security Guard","Driver","Laundry","Shopkeeper","Carpenter","Plumber","Electrician","Painter","Mason","Tailor","Mechanic","IT / Computer","Teacher / Tutor","Other"];

const minExpiry = () => {
  const d = new Date();
  d.setHours(d.getHours() + 1);
  return d.toISOString().slice(0, 16);
};

const defaultExpiry = () => {
  const d = new Date();
  d.setDate(d.getDate() + 3);
  return d.toISOString().slice(0, 16);
};

export const EmployerRegistration: React.FC = () => {
  const { setScreen, setEmployer, addJob } = useApp();
  const photoRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState(1);

  // Step 1 — personal info
  const [fullName, setFullName] = useState("");
  const [phone, setPhone]       = useState("");

  // Step 2 — location
  const [district,  setDistrict]  = useState("");
  const [sector,    setSector]    = useState("");
  const [area,      setArea]      = useState("");

  // Step 3 — job
  const [jobType,     setJobType]     = useState("");
  const [description, setDescription] = useState("");
  const [duration,    setDuration]    = useState("");
  const [expiresAt,   setExpiresAt]   = useState(defaultExpiry());
  const [photoPreview,setPhotoPreview]= useState<string | null>(null);
  const [photoBase64, setPhotoBase64] = useState<string | null>(null);

  const [error, setError] = useState("");

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      const r = ev.target?.result as string;
      setPhotoPreview(r);
      setPhotoBase64(r);
    };
    reader.readAsDataURL(file);
  };

  const nextStep = () => {
    setError("");
    if (step === 1) {
      if (!fullName.trim() || !phone.trim()) { setError("Please fill name and phone"); return; }
      setStep(2);
    } else if (step === 2) {
      if (!district || !sector.trim()) { setError("Please select district and enter sector"); return; }
      setStep(3);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobType)           { setError("Please select a job type"); return; }
    if (!description.trim()){ setError("Please describe the job"); return; }
    if (!expiresAt)         { setError("Please set an expiry date and time"); return; }
    if (new Date(expiresAt) <= new Date()) { setError("Expiry must be in the future"); return; }

    const emp: EmployerProfile = {
      id: "E" + Date.now(),
      fullName: fullName.trim(),
      phoneNumber: phone.trim(),
      location: { province: "", district, sector, neighborhood: area },
      hasPaid: false,
      registeredAt: new Date().toISOString(),
    };
    setEmployer(emp);

    const job: JobPosting = {
      id: "J" + Date.now(),
      employerId: emp.id,
      employerName: emp.fullName,
      employerPhone: emp.phoneNumber,
      skillNeeded: jobType,
      description: description.trim(),
      duration: duration || "Flexible",
      district,
      sector,
      neighborhood: area,
      photoUrl: photoBase64 || undefined,
      postedAt: new Date().toISOString(),
      expiresAt: new Date(expiresAt).toISOString(),
      status: "open",
    };
    addJob(job);

    // After registration: show local workers immediately
    setScreen("search");
  };

  const inputStyle: React.CSSProperties = {
    width: "100%", border: "1.5px solid #1877F2", borderRadius: "12px",
    padding: "13px", marginTop: "5px", fontWeight: "bold",
    background: "#f0f2f5", color: "#050505", outline: "none", fontSize: "15px",
  };
  const sectionStyle: React.CSSProperties = {
    background: "#f0f2f5", border: "1.5px solid #e4e6eb", borderRadius: "18px",
    padding: "18px", display: "flex", flexDirection: "column", gap: "14px",
  };

  const steps = ["Your Info", "Location", "Job Details"];

  return (
    <div className="min-h-screen py-8 px-4" style={{ background: "#1877F2" }}>
      <div className="max-w-lg mx-auto p-6"
        style={{ background: "#fff", borderRadius: "24px", boxShadow: "0 4px 32px #1877F255" }}>

        <div className="text-center mb-5">
          <div className="flex justify-center mb-2"><UmukoziLogo size={48} /></div>
          <h1 className="text-2xl font-black" style={{ color: "#1877F2" }}>Post a Job</h1>
          <p className="text-sm font-bold mt-1" style={{ color: "#606770" }}>Find workers in your area</p>
        </div>

        {/* Step indicators */}
        <div className="flex gap-2 mb-6">
          {steps.map((s, i) => (
            <div key={s} className="flex-1 text-center">
              <div className="rounded-full w-8 h-8 mx-auto flex items-center justify-center font-black text-sm"
                style={step === i + 1
                  ? { background: "#1877F2", color: "#fff" }
                  : step > i + 1
                  ? { background: "#42b883", color: "#fff" }
                  : { background: "#e4e6eb", color: "#606770" }}>
                {step > i + 1 ? "✓" : i + 1}
              </div>
              <p className="text-[10px] font-black mt-1"
                style={{ color: step === i + 1 ? "#1877F2" : "#bcc0c4" }}>{s}</p>
            </div>
          ))}
        </div>

        {error && (
          <div className="p-3 rounded-xl mb-4 font-bold text-sm"
            style={{ background: "#ffebe8", color: "#d32f2f", border: "1px solid #f5c6cb" }}>
            ⚠️ {error}
          </div>
        )}

        {/* ── STEP 1: Personal info ── */}
        {step === 1 && (
          <div style={sectionStyle}>
            <p className="text-xs font-black uppercase" style={{ color: "#1877F2" }}>Your Details</p>
            <div>
              <label className="text-xs font-black uppercase" style={{ color: "#606770" }}>Full Name *</label>
              <input value={fullName} onChange={e => setFullName(e.target.value)}
                style={inputStyle} placeholder="Your full name" />
            </div>
            <div>
              <label className="text-xs font-black uppercase" style={{ color: "#606770" }}>Phone *</label>
              <input value={phone} onChange={e => setPhone(e.target.value)}
                style={inputStyle} placeholder="07XXXXXXXX" type="tel" />
              <p className="text-[10px] font-bold mt-1" style={{ color: "#606770" }}>
                Workers will call or WhatsApp this number
              </p>
            </div>
            <button onClick={nextStep}
              className="w-full p-4 rounded-2xl font-black text-lg"
              style={{ background: "#1877F2", color: "#fff", border: "none" }}>
              Next → Location
            </button>
          </div>
        )}

        {/* ── STEP 2: Location ── */}
        {step === 2 && (
          <div style={sectionStyle}>
            <p className="text-xs font-black uppercase" style={{ color: "#1877F2" }}>Job Location</p>
            <div>
              <label className="text-xs font-black uppercase" style={{ color: "#606770" }}>District *</label>
              <select value={district} onChange={e => setDistrict(e.target.value)} style={inputStyle}>
                <option value="">Select district...</option>
                {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-black uppercase" style={{ color: "#606770" }}>Sector *</label>
              <input value={sector} onChange={e => setSector(e.target.value)}
                style={inputStyle} placeholder="e.g. Kimironko" />
            </div>
            <div>
              <label className="text-xs font-black uppercase" style={{ color: "#606770" }}>Neighborhood (optional)</label>
              <input value={area} onChange={e => setArea(e.target.value)}
                style={inputStyle} placeholder="e.g. Bibare" />
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep(1)}
                className="flex-1 p-3 rounded-2xl font-black"
                style={{ background: "#f0f2f5", color: "#606770", border: "none" }}>
                ← Back
              </button>
              <button onClick={nextStep}
                className="flex-1 p-4 rounded-2xl font-black text-lg"
                style={{ background: "#1877F2", color: "#fff", border: "none" }}>
                Next → Job
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 3: Job details ── */}
        {step === 3 && (
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div style={sectionStyle}>
              <p className="text-xs font-black uppercase" style={{ color: "#1877F2" }}>Job Details</p>

              <div>
                <label className="text-xs font-black uppercase" style={{ color: "#606770" }}>Job Type *</label>
                <select value={jobType} onChange={e => setJobType(e.target.value)} style={inputStyle}>
                  <option value="">Select job type...</option>
                  {JOB_TYPES.map(j => <option key={j} value={j}>{j}</option>)}
                </select>
              </div>

              <div>
                <label className="text-xs font-black uppercase" style={{ color: "#606770" }}>Describe the Job *</label>
                <textarea value={description} onChange={e => setDescription(e.target.value)}
                  rows={4} style={{ ...inputStyle, resize: "none" }}
                  placeholder="Describe what the worker will do, hours, any requirements..." />
              </div>

              <div>
                <label className="text-xs font-black uppercase" style={{ color: "#606770" }}>Duration</label>
                <input value={duration} onChange={e => setDuration(e.target.value)}
                  style={inputStyle} placeholder="e.g. Full time, Part time, 1 week..." />
              </div>

              {/* EXPIRY DATE/TIME */}
              <div>
                <label className="text-xs font-black uppercase" style={{ color: "#606770" }}>
                  Job Expires At *
                </label>
                <input
                  type="datetime-local"
                  value={expiresAt}
                  min={minExpiry()}
                  onChange={e => setExpiresAt(e.target.value)}
                  style={inputStyle}
                />
                <p className="text-[10px] font-bold mt-1" style={{ color: "#606770" }}>
                  After this date/time the job will automatically close
                </p>
              </div>

              {/* Photo */}
              <div>
                <label className="text-xs font-black uppercase" style={{ color: "#606770" }}>Photo (optional)</label>
                <div className="mt-2">
                  {photoPreview ? (
                    <div className="relative inline-block">
                      <img src={photoPreview} alt="Job"
                        className="w-full rounded-xl object-cover" style={{ maxHeight: "140px" }} />
                      <button type="button"
                        onClick={() => { setPhotoPreview(null); setPhotoBase64(null); }}
                        className="absolute top-2 right-2 w-7 h-7 rounded-full font-black text-xs flex items-center justify-center"
                        style={{ background: "#d32f2f", color: "#fff", border: "none" }}>
                        ✕
                      </button>
                    </div>
                  ) : (
                    <button type="button" onClick={() => photoRef.current?.click()}
                      className="w-full p-4 rounded-xl flex items-center justify-center gap-2 font-bold"
                      style={{ background: "#e7f3ff", border: "2px dashed #1877F2", color: "#1877F2" }}>
                      📷 Add a photo
                    </button>
                  )}
                  <input ref={photoRef} type="file" accept="image/*"
                    onChange={handlePhoto} style={{ display: "none" }} />
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button type="button" onClick={() => setStep(2)}
                className="flex-1 p-3 rounded-2xl font-black"
                style={{ background: "#f0f2f5", color: "#606770", border: "none" }}>
                ← Back
              </button>
              <button type="submit"
                className="flex-1 p-4 rounded-2xl font-black text-lg"
                style={{ background: "#1877F2", color: "#fff", border: "none" }}>
                ✅ Post Job FREE
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
