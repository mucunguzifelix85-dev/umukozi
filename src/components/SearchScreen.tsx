import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { TRANSLATIONS, JOB_TYPES } from "../data/mockData";

export const SearchScreen: React.FC = () => {
  const { language, workers, hasPaid, setScreen } = useApp();
  const t = TRANSLATIONS[language];
  const [searchJob, setSearchJob] = useState("");

  if (!hasPaid) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6">
        <div className="bg-black rounded-3xl shadow-2xl p-8 w-full max-w-sm text-center">
          <div className="text-5xl mb-4">🔒</div>
          <h2 className="text-xl font-black text-green-400 mb-2">{t.payFirst}</h2>
          <button onClick={() => setScreen("payment")}
            className="w-full bg-green-600 text-white p-4 rounded-2xl font-black text-lg mt-4">
            {t.pay500}
          </button>
        </div>
      </div>
    );
  }

  const filtered = workers.filter(w =>
    searchJob === "" ||
    w.skills.some(s => s.toLowerCase().includes(searchJob.toLowerCase())) ||
    w.experiencedIn.some(s => s.toLowerCase().includes(searchJob.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-black py-6 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-black text-green-700">UMUKOZI</h1>
            <p className="text-gray-500 text-sm font-bold">{t.searchWorkers}</p>
          </div>
          <button onClick={() => setScreen("role")}
            className="text-gray-500 hover:text-gray-300 font-bold text-sm border-2 border-green-800 px-4 py-2 rounded-xl">
            Back
          </button>
        </div>
        <div className="bg-black rounded-2xl shadow p-4 mb-6 flex gap-3">
          <select value={searchJob} onChange={e => setSearchJob(e.target.value)}
            className="flex-1 border-2 border-green-800 rounded-xl p-3 font-bold focus:border-green-400 outline-none bg-black">
            <option value="">{t.searchByJob}</option>
            {JOB_TYPES.map(j => <option key={j} value={j}>{j}</option>)}
          </select>
          {searchJob && (
            <button onClick={() => setSearchJob("")}
              className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 rounded-xl font-bold text-gray-300">
              X Clear
            </button>
          )}
        </div>
        <div className="bg-black rounded-2xl shadow mb-3 px-4 py-2 flex justify-between items-center">
          <span className="font-black text-green-400">{t.results}: <span className="text-green-600">{filtered.length}</span></span>
          <span className="text-xs text-gray-500 font-bold">{workers.length} total registered</span>
        </div>
        {filtered.length === 0 ? (
          <div className="bg-black rounded-2xl shadow p-12 text-center">
            <div className="text-4xl mb-3">🔍</div>
            <p className="font-black text-gray-500">{t.noResults}</p>
          </div>
        ) : (
          <div className="bg-black rounded-2xl shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-green-700 text-white">
                    <th className="p-3 text-left font-black">#</th>
                    <th className="p-3 text-left font-black">{t.name}</th>
                    <th className="p-3 text-left font-black">{t.phone2}</th>
                    <th className="p-3 text-left font-black">{t.district}</th>
                    <th className="p-3 text-left font-black">{t.sector}</th>
                    <th className="p-3 text-left font-black">{t.neighborhood}</th>
                    <th className="p-3 text-left font-black">{t.skills}</th>
                    <th className="p-3 text-left font-black">{t.experience}</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((w, i) => (
                    <tr key={w.id} className={i % 2 === 0 ? "bg-black" : "bg-black"}>
                      <td className="p-3 font-bold text-gray-500">{i + 1}</td>
                      <td className="p-3 font-black text-white">{w.fullName}</td>
                      <td className="p-3 font-bold text-green-700">{w.phoneNumber}</td>
                      <td className="p-3 font-bold text-gray-300">{w.location.district}</td>
                      <td className="p-3 font-bold text-gray-300">{w.location.sector}</td>
                      <td className="p-3 font-bold text-gray-300">{w.location.neighborhood}</td>
                      <td className="p-3">
                        <div className="flex flex-wrap gap-1">
                          {w.skills.map(s => (
                            <span key={s} className="bg-zinc-900 text-green-400 px-2 py-0.5 rounded-full text-xs font-bold">{s}</span>
                          ))}
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="flex flex-wrap gap-1">
                          {w.experiencedIn.map(s => (
                            <span key={s} className="bg-zinc-900 text-green-400 px-2 py-0.5 rounded-full text-xs font-bold">{s}</span>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};


