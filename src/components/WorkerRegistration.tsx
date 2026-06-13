import React, { useState, useRef } from "react";
import { useApp } from "../context/AppContext";
import { WorkerProfile } from "../types";
import { UmukoziLogo } from "./UmukoziLogo";

export const WorkerRegistration: React.FC = () => {
  const { setScreen, addWorker, workerLocation } = useApp();
  const photoRef = useRef<HTMLInputElement>(null);

  const [fullName,    setFullName]    = useState("");
  const [phone,       setPhone]       = useState("");
  const [skillsText,  setSkillsText]  = useState("");
  const [lookingFor,  setLookingFor]  = useState("");
  const [photoPreview,setPhotoPreview]= useState<string | null>(null);
  const [photoBase64, setPhotoBase64] = useState<string | null>(null);
  const [error,       setError]       = useState("");

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim())    { setError("Please enter your full name"); return; }
    if (!phone.trim())       { setError("Please enter your phone number"); return; }
    if (!skillsText.trim())  { setError("Please describe your skills"); return; }
    if (!lookingFor.trim())  { setError("Please describe the job you are looking for"); return; }

    const worker: WorkerProfile = {
      id: "W" + Date.now(),
      fullName:    fullName.trim(),
      phoneNumber: phone.trim(),
      location: {
        province:     "",
        district:     workerLocation?.district || "",
        sector:       workerLocation?.sector   || "",
        neighborhood: workerLocation?.village  || "",
      },
      skillsText:   skillsText.trim(),
      lookingFor:   lookingFor.trim(),
      skills:       skillsText.split(",").map(s => s.trim()).filter(Boolean),
      experiencedIn:[],
      photoUrl:     photoBase64 || undefined,
      registeredAt: new Date().toISOString(),
    };
    addWorker(worker);
    alert("Profile created! Employers in your area can now find you.");
    setScreen("job-feed");
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

  return (
    <div className="min-h-screen py-8 px-4" style={{ background: "#1877F2" }}>
      <div className="max-w-lg mx-auto p-6"
        style={{ background: "#fff", borderRadius: "24px", boxShadow: "0 4px 32px #1877F255" }}>

        <div className="text-center mb-6">
          <div className="flex justify-center mb-2"><UmukoziLogo size={48} /></div>
          <h1 className="text-2xl font-black" style={{ color: "#1877F2" }}>UMUKOZI</h1>
          <p className="font-bold mt-1 text-sm" style={{ color: "#606770" }}>Create Worker Profile</p>
          <div className="mt-2 rounded-xl p-2 text-xs font-bold"
            style={{ background: "#e7f3ff", color: "#1877F2", border: "1px solid #1877F2" }}>
            ✅ 100% FREE — Employers in your area will see you
          </div>
        </div>

        {/* Location */}
        {workerLocation && (
          <div className="rounded-xl p-3 mb-5 flex items-center gap-2"
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
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">

          {/* Personal info + photo */}
          <div style={sectionStyle}>
            <p className="text-xs font-black uppercase" style={{ color: "#1877F2" }}>Your Info</p>

            {/* Photo row */}
            <div className="flex items-start gap-4">
              <div className="shrink-0">
                {photoPreview ? (
                  <div className="relative">
                    <img src={photoPreview} alt="Profile"
                      className="w-20 h-20 rounded-full object-cover"
                      style={{ border: "3px solid #1877F2" }} />
                    <button type="button"
                      onClick={() => { setPhotoPreview(null); setPhotoBase64(null); }}
                      className="absolute -top-1 -right-1 w-6 h-6 rounded-full font-black text-xs flex items-center justify-center"
                      style={{ background: "#d32f2f", color: "#fff", border: "none" }}>
                      ✕
                    </button>
                  </div>
                ) : (
                  <button type="button" onClick={() => photoRef.current?.click()}
                    className="w-20 h-20 rounded-full flex flex-col items-center justify-center"
                    style={{ background: "#e7f3ff", border: "2px dashed #1877F2" }}>
                    <span className="text-2xl">📷</span>
                    <span className="text-[9px] font-black" style={{ color: "#1877F2" }}>optional</span>
                  </button>
                )}
                <input ref={photoRef} type="file" accept="image/*"
                  onChange={handlePhoto} style={{ display: "none" }} />
              </div>

              <div className="flex-1 flex flex-col gap-3">
                <div>
                  <label className="text-xs font-black uppercase" style={{ color: "#606770" }}>Full Name *</label>
                  <input value={fullName} onChange={e => setFullName(e.target.value)}
                    style={inputStyle} placeholder="Your full name" />
                </div>
                <div>
                  <label className="text-xs font-black uppercase" style={{ color: "#606770" }}>Phone Number *</label>
                  <input value={phone} onChange={e => setPhone(e.target.value)}
                    style={inputStyle} placeholder="07XXXXXXXX" type="tel" />
                  <p className="text-[10px] font-bold mt-1" style={{ color: "#606770" }}>
                    Employers will call or WhatsApp this number
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Skills — typed, not chips */}
          <div style={sectionStyle}>
            <p className="text-xs font-black uppercase" style={{ color: "#1877F2" }}>Your Skills *</p>
            <div>
              <label className="text-xs font-black uppercase" style={{ color: "#606770" }}>
                What can you do? (write it in your own words)
              </label>
              <textarea value={skillsText} onChange={e => setSkillsText(e.target.value)}
                rows={3} style={{ ...inputStyle, resize: "none" }}
                placeholder="e.g. House cleaning, cooking, taking care of children, gardening..." />
              <p className="text-[10px] font-bold mt-1" style={{ color: "#1877F2" }}>
                Write all your skills — employers search by keyword
              </p>
            </div>
          </div>

          {/* What they are looking for — typed */}
          <div style={sectionStyle}>
            <p className="text-xs font-black uppercase" style={{ color: "#1877F2" }}>What Job Are You Looking For? *</p>
            <div>
              <label className="text-xs font-black uppercase" style={{ color: "#606770" }}>
                Describe the job you want (in a few words)
              </label>
              <textarea value={lookingFor} onChange={e => setLookingFor(e.target.value)}
                rows={3} style={{ ...inputStyle, resize: "none" }}
                placeholder="e.g. I am looking for a full-time house cleaning job near Kimironko. Available every day." />
              <p className="text-[10px] font-bold mt-1" style={{ color: "#606770" }}>
                💰 Salary is negotiated directly by phone call
              </p>
            </div>
          </div>

          <button type="submit"
            className="w-full p-4 rounded-2xl font-black text-lg hover:opacity-90"
            style={{ background: "#1877F2", color: "#fff", border: "none" }}>
            ✅ Create My Profile — FREE
          </button>
          <button type="button" onClick={() => setScreen("job-feed")}
            className="w-full text-center font-bold text-sm py-1"
            style={{ color: "#606770", background: "none", border: "none" }}>
            ← Back to Jobs
          </button>
        </form>
      </div>
    </div>
  );
};
