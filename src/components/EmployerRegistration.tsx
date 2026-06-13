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

  return (
    <div className="min-h-screen bg-black py-8 px-4">
      <div className="max-w-lg mx-auto bg-zinc-900 rounded-3xl shadow-xl p-6 border border-green-900">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-2">
            <UmukoziLogo size={56} />
          </div>
          <h1 className="text-2xl font-black text-green-400">UMUKOZI</h1>
          <p className="text-gray-400 font-bold mt-1">{t.registerEmployer}</p>
          <div className="mt-2 bg-zinc-900 border border-green-800 rounded-xl p-2 text-green-300 text-xs font-bold">
            {t.employerFee}
          </div>
        </div>

        {error && (
          <div className="bg-zinc-900 border border-green-600 text-green-300 p-3 rounded-xl mb-4 font-bold text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="bg-black border border-green-900 rounded-2xl p-4 flex flex-col gap-3">
            <p className="text-xs font-black text-green-400 uppercase">{t.personalInfo}</p>
            <div>
              <label className="text-xs font-black text-gray-400 uppercase">{t.fullName} *</label>
              <input value={fullName} onChange={e => setFullName(e.target.value)}
                className="w-full border-2 border-green-800 rounded-xl p-3 mt-1 font-bold bg-black text-white focus:border-green-400 outline-none"
                placeholder={t.employerPlaceholderName} />
            </div>
            <div>
              <label className="text-xs font-black text-gray-400 uppercase">{t.phone} *</label>
              <input value={phone} onChange={e => setPhone(e.target.value)}
                className="w-full border-2 border-green-800 rounded-xl p-3 mt-1 font-bold bg-black text-white focus:border-green-400 outline-none"
                placeholder={t.workerPlaceholderPhone} />
            </div>
          </div>

          <div className="bg-black border border-green-900 rounded-2xl p-4 flex flex-col gap-3">
            <p className="text-xs font-black text-green-400 uppercase">{t.addressInfo}</p>
            <div>
              <label className="text-xs font-black text-gray-400 uppercase">{t.province} *</label>
              <select value={province} onChange={e => { setProvince(e.target.value); setDistrict(""); }}
                className="w-full border-2 border-green-800 rounded-xl p-3 mt-1 font-bold bg-black text-white focus:border-green-400 outline-none">
                <option value="">{t.selectProvince}</option>
                {PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-black text-gray-400 uppercase">{t.district} *</label>
              <select value={district} onChange={e => setDistrict(e.target.value)}
                disabled={!province}
                className="w-full border-2 border-green-800 rounded-xl p-3 mt-1 font-bold bg-black text-white focus:border-green-400 outline-none disabled:opacity-40">
                <option value="">{t.selectDistrict}</option>
                {districts.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-black text-gray-400 uppercase">{t.sectorManual} *</label>
              <input value={sector} onChange={e => setSector(e.target.value)}
                className="w-full border-2 border-green-800 rounded-xl p-3 mt-1 font-bold bg-black text-white focus:border-green-400 outline-none"
                placeholder={t.employerPlaceholderSector} />
            </div>
            <div>
              <label className="text-xs font-black text-gray-400 uppercase">{t.neighborhoodManual} *</label>
              <input value={neighborhood} onChange={e => setNeighborhood(e.target.value)}
                className="w-full border-2 border-green-800 rounded-xl p-3 mt-1 font-bold bg-black text-white focus:border-green-400 outline-none"
                placeholder={t.employerPlaceholderNeighborhood} />
            </div>
          </div>

          <button type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-black p-4 rounded-2xl font-black text-lg transition-all shadow-lg">
            {t.submitPay}
          </button>
          <button type="button" onClick={() => setScreen("role")}
            className="w-full text-center text-gray-500 hover:text-gray-300 font-bold text-sm py-2">
            {t.back}
          </button>
        </form>
      </div>
    </div>
  );
};
