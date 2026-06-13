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
      <div className="min-h-screen flex items-center justify-center p-6" style={{background:"#1877F2"}}>
        <div className="p-8 w-full max-w-sm text-center" style={{background:"#fff",borderRadius:"24px",boxShadow:"0 4px 32px #1877F255"}}>
          <div className="text-5xl mb-4">🔒</div>
          <h2 className="text-xl font-black mb-2" style={{color:"#1877F2"}}>{t.payFirst}</h2>
          <button onClick={() => setScreen("payment")}
            className="w-full p-4 rounded-2xl font-black text-lg mt-4 hover:opacity-90"
            style={{background:"#1877F2",color:"#fff",border:"none"}}>
            {t.pay500}
          </button>
        </div>
      </div>
    );
  }

  const filtered = workers.filter(w => {
    const matchJob = searchJob === "" || w.skills.some(s => s.toLowerCase().includes(searchJob.toLowerCase()));
    const matchName = searchName === "" || w.fullName.toLowerCase().includes(searchName.toLowerCase());
    const matchLocation = searchLocation === "" ||
      w.location.district.toLowerCase().includes(searchLocation.toLowerCase()) ||
      w.location.sector.toLowerCase().includes(searchLocation.toLowerCase()) ||
      w.location.neighborhood.toLowerCase().includes(searchLocation.toLowerCase()) ||
      w.location.province.toLowerCase().includes(searchLocation.toLowerCase());
    return matchJob && matchName && matchLocation;
  });

  const workerDetail = selectedWorker ? workers.find(w => w.id === selectedWorker) : null;

  const inputStyle = {
    width:"100%",
    border:"1.5px solid #1877F2",
    borderRadius:"12px",
    padding:"12px",
    fontWeight:"bold",
    background:"#f0f2f5",
    color:"#050505",
    outline:"none"
  };

  if (workerDetail) {
    return (
      <div className="min-h-screen py-8 px-4" style={{background:"#1877F2"}}>
        <div className="max-w-lg mx-auto p-6" style={{background:"#fff",borderRadius:"24px",boxShadow:"0 4px 32px #1877F255"}}>
          <button onClick={() => setSelectedWorker(null)}
            className="font-bold text-sm mb-6 flex items-center gap-1"
            style={{color:"#1877F2"}}>
            ← {t.backToResults}
          </button>
          <div className="flex flex-col gap-4">
            <div className="text-center">
              <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-3"
                style={{background:"#e7f3ff",border:"2px solid #1877F2"}}>
                <span className="text-3xl font-black" style={{color:"#1877F2"}}>
                  {workerDetail.fullName.charAt(0).toUpperCase()}
                </span>
              </div>
              <h2 className="text-xl font-black" style={{color:"#050505"}}>{workerDetail.fullName}</h2>
              <p className="font-bold text-sm mt-1" style={{color:"#1877F2"}}>{workerDetail.phoneNumber}</p>
            </div>

            {[
              { label: t.address, content: `${workerDetail.location.neighborhood}, ${workerDetail.location.sector}\n${workerDetail.location.district}, ${workerDetail.location.province}` },
              workerDetail.experiencedIn[0] ? { label: t.workExperienceLabel, content: workerDetail.experiencedIn[0] } : null,
              workerDetail.summary ? { label: t.professionalSummaryLabel, content: workerDetail.summary } : null,
              workerDetail.workTypes ? { label: t.workTypesDisplay, content: workerDetail.workTypes } : null,
              workerDetail.availableAreas ? { label: t.availableAreasDisplay, content: workerDetail.availableAreas } : null,
            ].filter(Boolean).map((item: any, i) => (
              <div key={i} className="rounded-2xl p-4" style={{background:"#f0f2f5",border:"1.5px solid #e4e6eb"}}>
                <p className="text-xs font-black uppercase mb-2" style={{color:"#1877F2"}}>{item.label}</p>
                <p className="font-bold text-sm leading-relaxed" style={{color:"#050505",whiteSpace:"pre-line"}}>{item.content}</p>
              </div>
            ))}

            {workerDetail.skills.length > 0 && (
              <div className="rounded-2xl p-4" style={{background:"#f0f2f5",border:"1.5px solid #e4e6eb"}}>
                <p className="text-xs font-black uppercase mb-2" style={{color:"#1877F2"}}>{t.jobCategories}</p>
                <div className="flex flex-wrap gap-2">
                  {workerDetail.skills.map(s => (
                    <span key={s} className="px-3 py-1 rounded-full text-xs font-bold"
                      style={{background:"#e7f3ff",color:"#1877F2",border:"1px solid #1877F2"}}>
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-6 px-4" style={{background:"#1877F2"}}>
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-black" style={{color:"#fff"}}>UMUKOZI</h1>
            <p className="text-sm font-bold" style={{color:"#e7f3ff"}}>{t.searchWorkers}</p>
          </div>
          <button onClick={() => setScreen("role")}
            className="font-bold text-sm px-4 py-2 rounded-xl"
            style={{background:"#fff",color:"#1877F2",border:"none"}}>
            ← {t.back}
          </button>
        </div>

        <div className="rounded-2xl p-4 mb-4 flex flex-col gap-3" style={{background:"#fff",boxShadow:"0 2px 8px #1877F233"}}>
          <p className="text-xs font-black uppercase" style={{color:"#1877F2"}}>{t.searchFilters}</p>
          <input value={searchName} onChange={e => setSearchName(e.target.value)}
            style={inputStyle} placeholder={t.searchByName} />
          <select value={searchJob} onChange={e => setSearchJob(e.target.value)} style={inputStyle}>
            <option value="">{t.allJobCategories}</option>
            {JOB_TYPES.map(j => <option key={j} value={j}>{j}</option>)}
          </select>
          <input value={searchLocation} onChange={e => setSearchLocation(e.target.value)}
            style={inputStyle} placeholder={t.searchByLocation} />
          {(searchName || searchJob || searchLocation) && (
            <button onClick={() => { setSearchName(""); setSearchJob(""); setSearchLocation(""); }}
              className="text-xs font-black uppercase self-start"
              style={{color:"#1877F2"}}>
              {t.clearFilters}
            </button>
          )}
        </div>

        <div className="rounded-xl px-4 py-2 mb-4 flex justify-between items-center" style={{background:"#fff",boxShadow:"0 1px 4px #1877F222"}}>
          <span className="font-black text-sm" style={{color:"#050505"}}>
            {t.results}: <span style={{color:"#1877F2"}}>{filtered.length}</span>
          </span>
          <span className="text-xs font-bold" style={{color:"#606770"}}>{workers.length} {t.totalRegistered}</span>
        </div>

        {workers.length === 0 ? (
          <div className="rounded-2xl p-12 text-center" style={{background:"#fff"}}>
            <div className="text-4xl mb-3">👷</div>
            <p className="font-black" style={{color:"#606770"}}>{t.noWorkersYet}</p>
            <p className="text-xs mt-2" style={{color:"#bcc0c4"}}>{t.workersAppear}</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl p-12 text-center" style={{background:"#fff"}}>
            <div className="text-4xl mb-3">🔍</div>
            <p className="font-black" style={{color:"#606770"}}>{t.noResults}</p>
            <button onClick={() => { setSearchName(""); setSearchJob(""); setSearchLocation(""); }}
              className="mt-3 text-xs font-black underline"
              style={{color:"#1877F2"}}>
              {t.clearFilters}
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map(w => (
              <div key={w.id} onClick={() => setSelectedWorker(w.id)}
                className="rounded-2xl p-4 cursor-pointer transition-all flex flex-col gap-3 hover:shadow-lg"
                style={{background:"#fff",border:"1.5px solid #e4e6eb"}}>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
                    style={{background:"#e7f3ff",border:"2px solid #1877F2"}}>
                    <span className="text-xl font-black" style={{color:"#1877F2"}}>
                      {w.fullName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-black text-sm" style={{color:"#050505"}}>{w.fullName}</h3>
                    <p className="font-bold text-xs" style={{color:"#1877F2"}}>{w.phoneNumber}</p>
                    <p className="font-bold text-xs mt-0.5" style={{color:"#606770"}}>
                      {w.location.neighborhood}, {w.location.sector}, {w.location.district}
                    </p>
                  </div>
                  <span className="text-xs font-black px-2 py-1 rounded-lg shrink-0"
                    style={{background:"#e7f3ff",color:"#1877F2",border:"1px solid #1877F2"}}>
                    {t.viewProfile}
                  </span>
                </div>
                {w.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {w.skills.slice(0, 4).map(s => (
                      <span key={s} className="px-2 py-0.5 rounded-full text-xs font-bold"
                        style={{background:"#f0f2f5",color:"#050505",border:"1px solid #e4e6eb"}}>
                        {s}
                      </span>
                    ))}
                    {w.skills.length > 4 && (
                      <span className="text-xs font-bold self-center" style={{color:"#606770"}}>+{w.skills.length - 4}</span>
                    )}
                  </div>
                )}
                {w.summary && (
                  <p className="text-xs font-bold leading-relaxed line-clamp-2" style={{color:"#606770"}}>{w.summary}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
