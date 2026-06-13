import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { TRANSLATIONS } from "../data/mockData";
import { PROVINCES, DISTRICTS } from "../data/locations";
import { EmployerProfile } from "../types";
import { UmukoziLogo } from "./UmukoziLogo";

export const EmployerRegistration: React.FC = () => {
  const { language, setScreen, setEmployer } = useApp();
  const t = TRANSLATIONS[language];

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [province, setProvince] = useState("");
  const [district, setDistrict] = useState("");
  const [sector, setSector] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [error, setError] = useState("");

  const districts = province ? (DISTRICTS[province] || []) : [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone || !province || !district || !sector || !neighborhood) {
      setError(t.fillAllFields);
      return;
    }
    const employer: EmployerProfile = {
      id: "E" + Date.now(),
      fullName,
      phoneNumber: phone,
      location: { province, district, sector, neighborhood },
      hasPaid: false,
      registeredAt: new Date().toISOString()
    };
    setEmployer(employer);
    setScreen("payment");
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
          <p className="font-bold mt-1" style={{color:"#606770"}}>{t.registerEmployer}</p>
          <div className="mt-2 rounded-xl p-2 text-xs font-bold" style={{background:"#fff3e0",color:"#e65100",border:"1px solid #ffcc02"}}>
            {t.employerFee}
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
                style={inputStyle} placeholder={t.employerPlaceholderName} />
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
                style={inputStyle} placeholder={t.employerPlaceholderSector} />
            </div>
            <div>
              <label className="text-xs font-black uppercase" style={{color:"#606770"}}>{t.neighborhoodManual} *</label>
              <input value={neighborhood} onChange={e => setNeighborhood(e.target.value)}
                style={inputStyle} placeholder={t.employerPlaceholderNeighborhood} />
            </div>
          </div>

          <button type="submit"
            className="w-full p-4 rounded-2xl font-black text-lg transition-all shadow-lg hover:opacity-90"
            style={{background:"#1877F2",color:"#fff",border:"none"}}>
            {t.submitPay}
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
