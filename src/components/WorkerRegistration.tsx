import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { TRANSLATIONS, JOB_TYPES } from "../data/mockData";
import { PROVINCES, DISTRICTS, getSectorsForDistrict } from "../data/locations";
import { WorkerProfile } from "../types";

export const WorkerRegistration: React.FC = () => {
  const { language, setScreen, addWorker } = useApp();
  const t = TRANSLATIONS[language];

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [nationalId, setNationalId] = useState("");
  const [province, setProvince] = useState("");
  const [district, setDistrict] = useState("");
  const [sector, setSector] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [experiencedIn, setExperiencedIn] = useState<string[]>([]);
  const [error, setError] = useState("");

  const districts = province ? (DISTRICTS[province] || []) : [];
  const sectors = district ? getSectorsForDistrict(district) : [];

  const toggleSkill = (job: string, list: string[], setList: (v: string[]) => void) => {
    setList(list.includes(job) ? list.filter(j => j !== job) : [...list, job]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone || !province || !district || !sector || !neighborhood) {
      setError("Please fill all required fields.");
      return;
    }
    if (skills.length === 0) {
      setError("Please select at least one skill.");
      return;
    }
    const worker: WorkerProfile = {
      id: "W" + Date.now(),
      fullName,
      phoneNumber: phone,
      nationalID: nationalId || undefined,
      location: { province, district, sector, neighborhood },
      skills,
      experiencedIn,
      registeredAt: new Date().toISOString()
    };
    addWorker(worker);
    setScreen("role");
    alert("Registration successful! You are now listed as a job seeker.");
  };

  return (
    <div className="min-h-screen bg-black py-8 px-4">
      <div className="max-w-lg mx-auto bg-black rounded-3xl shadow-xl p-6">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-black text-green-700">UMUKOZI</h1>
          <p className="text-gray-300 font-bold mt-1">{t.registerWorker}</p>
        </div>

        {error && <div className="bg-zinc-900 text-green-300 p-3 rounded-xl mb-4 font-bold text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-xs font-black text-gray-500 uppercase">{t.fullName} *</label>
            <input value={fullName} onChange={e => setFullName(e.target.value)}
              className="w-full border-2 border-green-800 rounded-xl p-3 mt-1 font-bold focus:border-green-400 outline-none"
              placeholder="e.g. Jean Bosco Nsengiyumva" />
          </div>

          <div>
            <label className="text-xs font-black text-gray-500 uppercase">{t.phone} *</label>
            <input value={phone} onChange={e => setPhone(e.target.value)}
              className="w-full border-2 border-green-800 rounded-xl p-3 mt-1 font-bold focus:border-green-400 outline-none"
              placeholder="+250 788 000 000" />
          </div>

          <div>
            <label className="text-xs font-black text-gray-500 uppercase">{t.nationalId}</label>
            <input value={nationalId} onChange={e => setNationalId(e.target.value)}
              className="w-full border-2 border-green-800 rounded-xl p-3 mt-1 font-bold focus:border-green-400 outline-none"
              placeholder="1199xxxxxxxxxxxxxxx" />
          </div>

          <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-4 flex flex-col gap-3">
            <p className="text-xs font-black text-green-700 uppercase">📍 Location</p>
            <div>
              <label className="text-xs font-black text-gray-500 uppercase">{t.province} *</label>
              <select value={province} onChange={e => { setProvince(e.target.value); setDistrict(""); setSector(""); }}
                className="w-full border-2 border-green-800 rounded-xl p-3 mt-1 font-bold focus:border-green-400 outline-none bg-black">
                <option value="">{t.selectProvince}</option>
                {PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-black text-gray-500 uppercase">{t.district} *</label>
              <select value={district} onChange={e => { setDistrict(e.target.value); setSector(""); }}
                disabled={!province}
                className="w-full border-2 border-green-800 rounded-xl p-3 mt-1 font-bold focus:border-green-400 outline-none bg-black disabled:opacity-50">
                <option value="">{t.selectDistrict}</option>
                {districts.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-black text-gray-500 uppercase">{t.sector} *</label>
              <select value={sector} onChange={e => setSector(e.target.value)}
                disabled={!district}
                className="w-full border-2 border-green-800 rounded-xl p-3 mt-1 font-bold focus:border-green-400 outline-none bg-black disabled:opacity-50">
                <option value="">{t.selectSector}</option>
                {sectors.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-black text-gray-500 uppercase">{t.neighborhood} *</label>
              <input value={neighborhood} onChange={e => setNeighborhood(e.target.value)}
                className="w-full border-2 border-green-800 rounded-xl p-3 mt-1 font-bold focus:border-green-400 outline-none"
                placeholder="e.g. Kimironko, near market" />
            </div>
          </div>

          <div className="bg-zinc-900 border-2 border-green-800 rounded-2xl p-4">
            <p className="text-xs font-black text-green-400 uppercase mb-2">💼 {t.skillsLabel} *</p>
            <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto">
              {JOB_TYPES.map(job => (
                <button type="button" key={job}
                  onClick={() => toggleSkill(job, skills, setSkills)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold border-2 transition-all ${
                    skills.includes(job) ? "bg-green-600 text-white border-green-600" : "bg-black text-gray-300 border-green-900 hover:border-green-600"
                  }`}>
                  {job}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-zinc-900 border-2 border-green-800 rounded-2xl p-4">
            <p className="text-xs font-black text-green-400 uppercase mb-2">⭐ {t.experienceLabel}</p>
            <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto">
              {JOB_TYPES.map(job => (
                <button type="button" key={job}
                  onClick={() => toggleSkill(job, experiencedIn, setExperiencedIn)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold border-2 transition-all ${
                    experiencedIn.includes(job) ? "bg-green-600 text-white border-green-600" : "bg-black text-gray-300 border-green-900 hover:border-green-600"
                  }`}>
                  {job}
                </button>
              ))}
            </div>
          </div>

          <button type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white p-4 rounded-2xl font-black text-lg transition-all shadow-lg mt-2">
            {t.submit} ✅
          </button>
          <button type="button" onClick={() => setScreen("role")}
            className="w-full text-center text-gray-500 hover:text-gray-300 font-bold text-sm py-2">
            ← {t.back}
          </button>
        </form>
      </div>
    </div>
  );
};

