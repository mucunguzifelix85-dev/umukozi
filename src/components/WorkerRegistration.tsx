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
      setError("Please fill all required fields.");
      return;
    }
    if (skills.length === 0) {
      setError("Please select at least one job category.");
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
    alert("Registration successful! You are now listed as a job seeker.");
  };

  return (
    <div className="min-h-screen bg-black py-8 px-4">
      <div className="max-w-lg mx-auto bg-zinc-900 rounded-3xl shadow-xl p-6 border border-green-900">

        <div className="text-center mb-6">
          <div className="flex justify-center mb-2">
            <UmukoziLogo size={56} />
          </div>
          <h1 className="text-2xl font-black text-green-400">UMUKOZI</h1>
          <p className="text-gray-400 font-bold mt-1">{t.registerWorker}</p>
          <div className="mt-2 bg-zinc-900 border border-green-800 rounded-xl p-2 text-green-300 text-xs font-bold">
            Registration is FREE
          </div>
        </div>

        {error && (
          <div className="bg-zinc-900 border border-green-600 text-green-300 p-3 rounded-xl mb-4 font-bold text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">

          {/* PERSONAL INFO */}
          <div className="bg-black border border-green-900 rounded-2xl p-4 flex flex-col gap-3">
            <p className="text-xs font-black text-green-400 uppercase">Personal Information</p>

            <div>
              <label className="text-xs font-black text-gray-400 uppercase">{t.fullName} *</label>
              <input value={fullName} onChange={e => setFullName(e.target.value)}
                className="w-full border-2 border-green-800 rounded-xl p-3 mt-1 font-bold bg-black text-white focus:border-green-400 outline-none"
                placeholder="e.g. Jean Bosco Nsengiyumva" />
            </div>

            <div>
              <label className="text-xs font-black text-gray-400 uppercase">{t.phone} *</label>
              <input value={phone} onChange={e => setPhone(e.target.value)}
                className="w-full border-2 border-green-800 rounded-xl p-3 mt-1 font-bold bg-black text-white focus:border-green-400 outline-none"
                placeholder="+250 788 000 000" />
            </div>
          </div>

          {/* ADDRESS */}
          <div className="bg-black border border-green-900 rounded-2xl p-4 flex flex-col gap-3">
            <p className="text-xs font-black text-green-400 uppercase">Address Information</p>

            <div>
              <label className="text-xs font-black text-gray-400 uppercase">{t.province} *</label>
              <select value={province} onChange={e => { setProvince(e.target.value); setDistrict(""); }}
                className="w-full border-2 border-green-800 rounded-xl p-3 mt-1 font-bold bg-black text-white focus:border-green-400 outline-none">
                <option value="">Select Province</option>
                {PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>

            <div>
              <label className="text-xs font-black text-gray-400 uppercase">{t.district} *</label>
              <select value={district} onChange={e => setDistrict(e.target.value)}
                disabled={!province}
                className="w-full border-2 border-green-800 rounded-xl p-3 mt-1 font-bold bg-black text-white focus:border-green-400 outline-none disabled:opacity-40">
                <option value="">Select District</option>
                {districts.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>

            <div>
              <label className="text-xs font-black text-gray-400 uppercase">Sector * (Type manually)</label>
              <input value={sector} onChange={e => setSector(e.target.value)}
                className="w-full border-2 border-green-800 rounded-xl p-3 mt-1 font-bold bg-black text-white focus:border-green-400 outline-none"
                placeholder="e.g. Kimironko" />
            </div>

            <div>
              <label className="text-xs font-black text-gray-400 uppercase">Neighborhood / Area *</label>
              <input value={neighborhood} onChange={e => setNeighborhood(e.target.value)}
                className="w-full border-2 border-green-800 rounded-xl p-3 mt-1 font-bold bg-black text-white focus:border-green-400 outline-none"
                placeholder="e.g. Near the market, Kibagabaga" />
            </div>
          </div>

          {/* WORK EXPERIENCE */}
          <div className="bg-black border border-green-900 rounded-2xl p-4 flex flex-col gap-3">
            <p className="text-xs font-black text-green-400 uppercase">Work Experience</p>

            <div>
              <label className="text-xs font-black text-gray-400 uppercase">Work you normally do</label>
              <textarea value={workExperience} onChange={e => setWorkExperience(e.target.value)}
                rows={3}
                className="w-full border-2 border-green-800 rounded-xl p-3 mt-1 font-bold bg-black text-white focus:border-green-400 outline-none resize-none"
                placeholder="e.g. I have been cooking in hotels and homes for 5 years. I specialise in Rwandan and Continental dishes..." />
            </div>

            <div>
              <label className="text-xs font-black text-gray-400 uppercase mb-2 block">
                Jobs you are capable of doing * (Select all that apply)
              </label>
              <div className="flex flex-wrap gap-2 max-h-52 overflow-y-auto pr-1">
                {JOB_TYPES.map(job => (
                  <button type="button" key={job}
                    onClick={() => toggleSkill(job)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold border-2 transition-all ${
                      skills.includes(job)
                        ? "bg-green-600 text-black border-green-600"
                        : "bg-black text-gray-300 border-green-800 hover:border-green-500"
                    }`}>
                    {job}
                  </button>
                ))}
              </div>
              {skills.length > 0 && (
                <p className="text-xs text-green-400 font-bold mt-2">{skills.length} selected</p>
              )}
            </div>
          </div>

          {/* PROFESSIONAL SUMMARY */}
          <div className="bg-black border border-green-900 rounded-2xl p-4 flex flex-col gap-4">
            <p className="text-xs font-black text-green-400 uppercase">Professional Summary</p>

            <div>
              <label className="text-xs font-black text-gray-400 uppercase">
                Brief summary of your skills and what you can do
              </label>
              <textarea value={summary} onChange={e => setSummary(e.target.value)}
                rows={3}
                className="w-full border-2 border-green-800 rounded-xl p-3 mt-1 font-bold bg-black text-white focus:border-green-400 outline-none resize-none"
                placeholder="e.g. I am a hardworking and experienced cook with 5 years of experience. I am reliable, punctual, and take pride in my work..." />
            </div>

            <div>
              <label className="text-xs font-black text-gray-400 uppercase">
                Types of work you are capable of performing
              </label>
              <textarea value={workTypes} onChange={e => setWorkTypes(e.target.value)}
                rows={2}
                className="w-full border-2 border-green-800 rounded-xl p-3 mt-1 font-bold bg-black text-white focus:border-green-400 outline-none resize-none"
                placeholder="e.g. Cooking, cleaning, catering for events, preparing Rwandan traditional food..." />
            </div>

            <div>
              <label className="text-xs font-black text-gray-400 uppercase">
                Locations and areas where you are available to work
              </label>
              <textarea value={availableAreas} onChange={e => setAvailableAreas(e.target.value)}
                rows={2}
                className="w-full border-2 border-green-800 rounded-xl p-3 mt-1 font-bold bg-black text-white focus:border-green-400 outline-none resize-none"
                placeholder="e.g. I am available in Gasabo, Kicukiro, and Nyarugenge. I can travel within Kigali..." />
            </div>
          </div>

          <button type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-black p-4 rounded-2xl font-black text-lg transition-all shadow-lg">
            {t.submit || "Submit Registration"} ✅
          </button>

          <button type="button" onClick={() => setScreen("role")}
            className="w-full text-center text-gray-500 hover:text-gray-300 font-bold text-sm py-2">
            Back
          </button>

        </form>
      </div>
    </div>
  );
};
