import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { TRANSLATIONS, JOB_TYPES } from "../data/mockData";
import { PROVINCES, DISTRICTS } from "../data/locations";
import { WorkerProfile } from "../types";
import { UmukoziLogo } from "./UmukoziLogo";

export const WorkerRegistration: React.FC = () => {
  const { language, setScreen, addWorker } = useApp();
  const t = TRANSLATIONS[language];

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [province, setProvince] = useState("");
  const [district, setDistrict] = useState("");
  const [sector, setSector] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [workExperience, setWorkExperience] = useState("");
  const [summary, setSummary] = useState("");
  const [workTypes, setWorkTypes] = useState("");
  const [availableAreas, setAvailableAreas] = useState("");
  const [error, setError] = useState("");

  const districts = province ? (DISTRICTS[province] || []) : [];

  const toggleSkill = (job: string) => {
    setSkills(prev => prev.includes(job) ? prev.filter(j => j !== job) : [...prev, job]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone || !province || !district || !sector || !neighborhood) {
      setError(t.fillAllFields);
      return;
    }
    if (skills.length === 0) {
      setError(t.selectOneCategory);
      return;
    }
    const worker: WorkerProfile = {
      id: "W" + Date.now(),
      fullName,
      phoneNumber: phone,
      location: { province, district, sector, neighborhood },
      skills,
      experiencedIn: workExperience ? [workExperience] : [],
      summary,
      workTypes,
      availableAreas,
      registeredAt: new Date().toISOString()
    };
    addWorker(worker);
    setScreen("role");
    alert(t.registrationSuccess);
  };

  const inputStyle = {
    width:"100%",
    border:"1.5px solid #1877F2",
    borderRadius:"12px",
    padding:"12px",
    marginTop:"4px",
    fontWeight:"bold",
    background:"#f0f2f5",
    color:"#050505",
    outline:"none"
  };

  const sectionStyle = {
    background:"#f0f2f5",
    border:"1.5px solid #e4e6eb",
    borderRadius:"18px",
    padding:"16px",
    display:"flex",
    flexDirection:"column" as const,
    gap:"12px"
  };

  return (
    <div className="min-h-screen py-8 px-4" style={{background:"#1877F2"}}>
      <div className="max-w-lg mx-auto p-6" style={{background:"#fff",borderRadius:"24px",boxShadow:"0 4px 32px #1877F255"}}>
        <div className="text-center mb-6">
          <div className="flex justify-center mb-2">
            <UmukoziLogo size={56} />
          </div>
          <h1 className="text-2xl font-black" style={{color:"#1877F2"}}>UMUKOZI</h1>
          <p className="font-bold mt-1" style={{color:"#606770"}}>{t.registerWorker}</p>
          <div className="mt-2 rounded-xl p-2 text-xs font-bold" style={{background:"#e7f3ff",color:"#1877F2",border:"1px solid #1877F2"}}>
            {t.registrationFree}
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-xl mb-4 font-bold text-sm" style={{background:"#ffebe8",color:"#d32f2f",border:"1px solid #f5c6cb"}}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div style={sectionStyle}>
            <p className="text-xs font-black uppercase" style={{color:"#1877F2"}}>{t.personalInfo}</p>
            <div>
              <label className="text-xs font-black uppercase" style={{color:"#606770"}}>{t.fullName} *</label>
              <input value={fullName} onChange={e => setFullName(e.target.value)}
                style={inputStyle} placeholder={t.workerPlaceholderName} />
            </div>
            <div>
              <label className="text-xs font-black uppercase" style={{color:"#606770"}}>{t.phone} *</label>
              <input value={phone} onChange={e => setPhone(e.target.value)}
                style={inputStyle} placeholder={t.workerPlaceholderPhone} />
            </div>
          </div>

          <div style={sectionStyle}>
            <p className="text-xs font-black uppercase" style={{color:"#1877F2"}}>{t.addressInfo}</p>
            <div>
              <label className="text-xs font-black uppercase" style={{color:"#606770"}}>{t.province} *</label>
              <select value={province} onChange={e => { setProvince(e.target.value); setDistrict(""); }}
                style={inputStyle}>
                <option value="">{t.selectProvince}</option>
                {PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-black uppercase" style={{color:"#606770"}}>{t.district} *</label>
              <select value={district} onChange={e => setDistrict(e.target.value)}
                disabled={!province} style={{...inputStyle, opacity: !province ? 0.4 : 1}}>
                <option value="">{t.selectDistrict}</option>
                {districts.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-black uppercase" style={{color:"#606770"}}>{t.sectorManual} *</label>
              <input value={sector} onChange={e => setSector(e.target.value)}
                style={inputStyle} placeholder={t.workerPlaceholderSector} />
            </div>
            <div>
              <label className="text-xs font-black uppercase" style={{color:"#606770"}}>{t.neighborhoodManual} *</label>
              <input value={neighborhood} onChange={e => setNeighborhood(e.target.value)}
                style={inputStyle} placeholder={t.workerPlaceholderNeighborhood} />
            </div>
          </div>

          <div style={sectionStyle}>
            <p className="text-xs font-black uppercase" style={{color:"#1877F2"}}>{t.workExperience}</p>
            <div>
              <label className="text-xs font-black uppercase" style={{color:"#606770"}}>{t.workYouDo}</label>
              <textarea value={workExperience} onChange={e => setWorkExperience(e.target.value)}
                rows={3} style={{...inputStyle,resize:"none"}} placeholder={t.workerPlaceholderExperience} />
            </div>
            <div>
              <label className="text-xs font-black uppercase mb-2 block" style={{color:"#606770"}}>{t.jobsCapable} *</label>
              <div className="flex flex-wrap gap-2 pr-1" style={{maxHeight:"200px",overflowY:"auto"}}>
                {JOB_TYPES.map(job => (
                  <button type="button" key={job} onClick={() => toggleSkill(job)}
                    className="px-3 py-1.5 rounded-full text-xs font-bold transition-all"
                    style={skills.includes(job)
                      ? {background:"#1877F2",color:"#fff",border:"2px solid #1877F2"}
                      : {background:"#f0f2f5",color:"#050505",border:"2px solid #e4e6eb"}}>
                    {job}
                  </button>
                ))}
              </div>
              {skills.length > 0 && (
                <p className="text-xs font-bold mt-2" style={{color:"#1877F2"}}>{skills.length} {t.selected}</p>
              )}
            </div>
          </div>

          <div style={sectionStyle}>
            <p className="text-xs font-black uppercase" style={{color:"#1877F2"}}>{t.professionalSummary}</p>
            <div>
              <label className="text-xs font-black uppercase" style={{color:"#606770"}}>{t.summaryLabel}</label>
              <textarea value={summary} onChange={e => setSummary(e.target.value)}
                rows={3} style={{...inputStyle,resize:"none"}} placeholder={t.workerPlaceholderSummary} />
            </div>
            <div>
              <label className="text-xs font-black uppercase" style={{color:"#606770"}}>{t.workTypesLabel}</label>
              <textarea value={workTypes} onChange={e => setWorkTypes(e.target.value)}
                rows={2} style={{...inputStyle,resize:"none"}} placeholder={t.workerPlaceholderWorkTypes} />
            </div>
            <div>
              <label className="text-xs font-black uppercase" style={{color:"#606770"}}>{t.availableAreasLabel}</label>
              <textarea value={availableAreas} onChange={e => setAvailableAreas(e.target.value)}
                rows={2} style={{...inputStyle,resize:"none"}} placeholder={t.workerPlaceholderAreas} />
            </div>
          </div>

          <button type="submit"
            className="w-full p-4 rounded-2xl font-black text-lg transition-all shadow-lg hover:opacity-90"
            style={{background:"#1877F2",color:"#fff",border:"none"}}>
            {t.submit}
          </button>
          <button type="button" onClick={() => setScreen("role")}
            className="w-full text-center font-bold text-sm py-2"
            style={{color:"#606770"}}>
            ← {t.back}
          </button>
        </form>
      </div>
    </div>
  );
};
