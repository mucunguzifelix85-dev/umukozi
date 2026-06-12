import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { TRANSLATIONS } from "../data/mockData";
import { DISTRICTS, getSectorsForDistrict } from "../data/locations";
import { EmployerProfile } from "../types";

export const EmployerRegistration: React.FC = () => {
  const { language, setScreen, setEmployer } = useApp();
  const t = TRANSLATIONS[language];

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [nationalId, setNationalId] = useState("");
  const [district, setDistrict] = useState("");
  const [sector, setSector] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [error, setError] = useState("");

  const allDistricts = Object.values(DISTRICTS).flat();
  const sectors = district ? getSectorsForDistrict(district) : [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone || !district || !sector || !neighborhood) {
      setError("Please fill all required fields.");
      return;
    }
    const employer: EmployerProfile = {
      id: "E" + Date.now(),
      fullName,
      phoneNumber: phone,
      nationalID: nationalId || undefined,
      location: { province: "", district, sector, neighborhood },
      hasPaid: false,
      registeredAt: new Date().toISOString()
    };
    setEmployer(employer);
    setScreen("payment");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-lg mx-auto bg-white rounded-3xl shadow-xl p-6">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-black text-green-700">UMUKOZI</h1>
          <p className="text-gray-600 font-bold mt-1">{t.registerEmployer}</p>
          <div className="mt-2 bg-yellow-100 border border-yellow-400 rounded-xl p-2 text-yellow-800 text-xs font-bold">
            💰 {t.pay500}
          </div>
        </div>

        {error && <div className="bg-red-100 text-red-700 p-3 rounded-xl mb-4 font-bold text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-xs font-black text-gray-500 uppercase">{t.fullName} *</label>
            <input value={fullName} onChange={e => setFullName(e.target.value)}
              className="w-full border-2 border-gray-200 rounded-xl p-3 mt-1 font-bold focus:border-green-500 outline-none"
              placeholder="e.g. Alphonse Mutabazi" />
          </div>

          <div>
            <label className="text-xs font-black text-gray-500 uppercase">{t.phone} *</label>
            <input value={phone} onChange={e => setPhone(e.target.value)}
              className="w-full border-2 border-gray-200 rounded-xl p-3 mt-1 font-bold focus:border-green-500 outline-none"
              placeholder="+250 788 000 000" />
          </div>

          <div>
            <label className="text-xs font-black text-gray-500 uppercase">{t.nationalId}</label>
            <input value={nationalId} onChange={e => setNationalId(e.target.value)}
              className="w-full border-2 border-gray-200 rounded-xl p-3 mt-1 font-bold focus:border-green-500 outline-none"
              placeholder="1199xxxxxxxxxxxxxxx" />
          </div>

          <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-4 flex flex-col gap-3">
            <p className="text-xs font-black text-green-700 uppercase">📍 Location</p>
            <div>
              <label className="text-xs font-black text-gray-500 uppercase">{t.district} *</label>
              <select value={district} onChange={e => { setDistrict(e.target.value); setSector(""); }}
                className="w-full border-2 border-gray-200 rounded-xl p-3 mt-1 font-bold focus:border-green-500 outline-none bg-white">
                <option value="">{t.selectDistrict}</option>
                {allDistricts.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-black text-gray-500 uppercase">{t.sector} *</label>
              <select value={sector} onChange={e => setSector(e.target.value)}
                disabled={!district}
                className="w-full border-2 border-gray-200 rounded-xl p-3 mt-1 font-bold focus:border-green-500 outline-none bg-white disabled:opacity-50">
                <option value="">{t.selectSector}</option>
                {sectors.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-black text-gray-500 uppercase">{t.neighborhood} *</label>
              <input value={neighborhood} onChange={e => setNeighborhood(e.target.value)}
                className="w-full border-2 border-gray-200 rounded-xl p-3 mt-1 font-bold focus:border-green-500 outline-none"
                placeholder="e.g. Kicukiro, near Total station" />
            </div>
          </div>

          <button type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white p-4 rounded-2xl font-black text-lg transition-all shadow-lg mt-2">
            {t.submit} → Pay 500 RWF
          </button>
          <button type="button" onClick={() => setScreen("role")}
            className="w-full text-center text-gray-400 hover:text-gray-600 font-bold text-sm py-2">
            ← {t.back}
          </button>
        </form>
      </div>
    </div>
  );
};
