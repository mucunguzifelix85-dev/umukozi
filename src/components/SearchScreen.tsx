import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { TRANSLATIONS, JOB_TYPES } from "../data/mockData";

export const SearchScreen: React.FC = () => {
  const { language, workers, hasPaid, setScreen } = useApp();
  const t = TRANSLATIONS[language];
  const [searchJob, setSearchJob] = useState("");
  const [searchName, setSearchName] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const [selectedWorker, setSelectedWorker] = useState<string | null>(null);

  if (!hasPaid) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6">
        <div className="bg-zinc-900 rounded-3xl shadow-2xl p-8 w-full max-w-sm text-center border border-green-900">
          <div className="text-5xl mb-4">🔒</div>
          <h2 className="text-xl font-black text-green-400 mb-2">{t.payFirst}</h2>
          <button onClick={() => setScreen("payment")}
            className="w-full bg-green-600 text-black p-4 rounded-2xl font-black text-lg mt-4 hover:bg-green-700">
            {t.pay500}
          </button>
        </div>
      </div>
    );
  }

  const filtered = workers.filter(w => {
    const matchJob = searchJob === "" ||
      w.skills.some(s => s.toLowerCase().includes(searchJob.toLowerCase()));
    const matchName = searchName === "" ||
      w.fullName.toLowerCase().includes(searchName.toLowerCase());
    const matchLocation = searchLocation === "" ||
      w.location.district.toLowerCase().includes(searchLocation.toLowerCase()) ||
      w.location.sector.toLowerCase().includes(searchLocation.toLowerCase()) ||
      w.location.neighborhood.toLowerCase().includes(searchLocation.toLowerCase()) ||
      w.location.province.toLowerCase().includes(searchLocation.toLowerCase());
    return matchJob && matchName && matchLocation;
  });

  const workerDetail = selectedWorker ? workers.find(w => w.id === selectedWorker) : null;

  if (workerDetail) {
    return (
      <div className="min-h-screen bg-black py-8 px-4">
        <div className="max-w-lg mx-auto bg-zinc-900 rounded-3xl shadow-xl p-6 border border-green-900">
          <button onClick={() => setSelectedWorker(null)}
            className="text-gray-400 hover:text-green-400 font-bold text-sm mb-6 flex items-center gap-1">
            Back to Results
          </button>

          <div className="flex flex-col gap-4">
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-green-900 border-2 border-green-500 flex items-center justify-center mx-auto mb-3">
                <span className="text-3xl font-black text-green-400">
                  {workerDetail.fullName.charAt(0).toUpperCase()}
                </span>
              </div>
              <h2 className="text-xl font-black text-white">{workerDetail.fullName}</h2>
              <p className="text-green-400 font-bold text-sm mt-1">{workerDetail.phoneNumber}</p>
            </div>

            <div className="bg-black border border-green-900 rounded-2xl p-4 flex flex-col gap-2">
              <p className="text-xs font-black text-green-400 uppercase">Address</p>
              <p className="text-white font-bold text-sm">
                {workerDetail.location.neighborhood}, {workerDetail.location.sector}
              </p>
              <p className="text-gray-400 font-bold text-sm">
                {workerDetail.location.district}, {workerDetail.location.province}
              </p>
            </div>

            {workerDetail.experiencedIn.length > 0 && workerDetail.experiencedIn[0] && (
              <div className="bg-black border border-green-900 rounded-2xl p-4">
                <p className="text-xs font-black text-green-400 uppercase mb-2">Work Experience</p>
                <p className="text-white font-bold text-sm leading-relaxed">{workerDetail.experiencedIn[0]}</p>
              </div>
            )}

            {workerDetail.skills.length > 0 && (
              <div className="bg-black border border-green-900 rounded-2xl p-4">
                <p className="text-xs font-black text-green-400 uppercase mb-2">Job Categories</p>
                <div className="flex flex-wrap gap-2">
                  {workerDetail.skills.map(s => (
                    <span key={s} className="bg-green-900 text-green-300 px-3 py-1 rounded-full text-xs font-bold border border-green-700">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {workerDetail.summary && (
              <div className="bg-black border border-green-900 rounded-2xl p-4">
                <p className="text-xs font-black text-green-400 uppercase mb-2">Professional Summary</p>
                <p className="text-white font-bold text-sm leading-relaxed">{workerDetail.summary}</p>
              </div>
            )}

            {workerDetail.workTypes && (
              <div className="bg-black border border-green-900 rounded-2xl p-4">
                <p className="text-xs font-black text-green-400 uppercase mb-2">Types of Work</p>
                <p className="text-white font-bold text-sm leading-relaxed">{workerDetail.workTypes}</p>
              </div>
            )}

            {workerDetail.availableAreas && (
              <div className="bg-black border border-green-900 rounded-2xl p-4">
                <p className="text-xs font-black text-green-400 uppercase mb-2">Available Areas</p>
                <p className="text-white font-bold text-sm leading-relaxed">{workerDetail.availableAreas}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-6 px-4">
      <div className="max-w-4xl mx-auto">

        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-black text-green-400">UMUKOZI</h1>
            <p className="text-gray-400 text-sm font-bold">{t.searchWorkers}</p>
          </div>
          <button onClick={() => setScreen("role")}
            className="text-gray-400 hover:text-green-400 font-bold text-sm border-2 border-green-900 px-4 py-2 rounded-xl">
            Back
          </button>
        </div>

        {/* Search filters */}
        <div className="bg-zinc-900 border border-green-900 rounded-2xl p-4 mb-4 flex flex-col gap-3">
          <p className="text-xs font-black text-green-400 uppercase">Search Filters</p>

          <input
            value={searchName}
            onChange={e => setSearchName(e.target.value)}
            className="w-full border-2 border-green-800 rounded-xl p-3 font-bold bg-black text-white focus:border-green-400 outline-none"
            placeholder="Search by name..." />

          <select value={searchJob} onChange={e => setSearchJob(e.target.value)}
            className="w-full border-2 border-green-800 rounded-xl p-3 font-bold bg-black text-white focus:border-green-400 outline-none">
            <option value="">All job categories</option>
            {JOB_TYPES.map(j => <option key={j} value={j}>{j}</option>)}
          </select>

          <input
            value={searchLocation}
            onChange={e => setSearchLocation(e.target.value)}
            className="w-full border-2 border-green-800 rounded-xl p-3 font-bold bg-black text-white focus:border-green-400 outline-none"
            placeholder="Search by district, sector or neighborhood..." />

          {(searchName || searchJob || searchLocation) && (
            <button onClick={() => { setSearchName(""); setSearchJob(""); setSearchLocation(""); }}
              className="text-xs text-green-400 hover:text-green-300 font-black uppercase self-start">
              Clear all filters
            </button>
          )}
        </div>

        <div className="bg-zinc-900 border border-green-900 rounded-xl px-4 py-2 mb-4 flex justify-between items-center">
          <span className="font-black text-white text-sm">
            Results: <span className="text-green-400">{filtered.length}</span>
          </span>
          <span className="text-xs text-gray-400 font-bold">{workers.length} total registered</span>
        </div>

        {workers.length === 0 ? (
          <div className="bg-zinc-900 border border-green-900 rounded-2xl p-12 text-center">
            <div className="text-4xl mb-3">👷</div>
            <p className="font-black text-gray-400">No job seekers have registered yet.</p>
            <p className="text-xs text-gray-500 mt-2">Workers will appear here once they register.</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-zinc-900 border border-green-900 rounded-2xl p-12 text-center">
            <div className="text-4xl mb-3">🔍</div>
            <p className="font-black text-gray-400">{t.noResults}</p>
            <button onClick={() => { setSearchName(""); setSearchJob(""); setSearchLocation(""); }}
              className="mt-3 text-xs text-green-400 font-black underline">
              Clear filters
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map((w, i) => (
              <div key={w.id}
                onClick={() => setSelectedWorker(w.id)}
                className="bg-zinc-900 border border-green-900 hover:border-green-500 rounded-2xl p-4 cursor-pointer transition-all flex flex-col gap-3">

                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-green-900 border-2 border-green-700 flex items-center justify-center shrink-0">
                    <span className="text-xl font-black text-green-400">
                      {w.fullName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-black text-white text-sm">{w.fullName}</h3>
                    <p className="text-green-400 font-bold text-xs">{w.phoneNumber}</p>
                    <p className="text-gray-400 font-bold text-xs mt-0.5">
                      {w.location.neighborhood}, {w.location.sector}, {w.location.district}
                    </p>
                  </div>
                  <span className="text-xs text-green-400 font-black border border-green-800 px-2 py-1 rounded-lg shrink-0">
                    View
                  </span>
                </div>

                {w.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {w.skills.slice(0, 4).map(s => (
                      <span key={s} className="bg-black text-green-300 px-2 py-0.5 rounded-full text-xs font-bold border border-green-900">
                        {s}
                      </span>
                    ))}
                    {w.skills.length > 4 && (
                      <span className="text-xs text-gray-400 font-bold self-center">+{w.skills.length - 4} more</span>
                    )}
                  </div>
                )}

                {w.summary && (
                  <p className="text-gray-300 text-xs font-bold leading-relaxed line-clamp-2">{w.summary}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
