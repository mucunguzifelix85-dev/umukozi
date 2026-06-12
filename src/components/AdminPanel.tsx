import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TRANSLATIONS } from '../data/mockData';
import { 
  Users, ShieldAlert, DollarSign, Ban, Activity, CheckSquare, 
  Trash2, Award, Zap, LogOut, CheckCircle, Smartphone, AlertTriangle 
} from 'lucide-react';

export const AdminPanel: React.FC = () => {
  const { 
    workers, 
    transactions, 
    reports, 
    toggleVerifyWorker, 
    toggleSuspendWorker, 
    resolveReport, 
    toggleBoostWorker, 
    setActiveScreen, 
    language 
  } = useApp();

  const [adminRole, setAdminRole] = useState<'SUPER_ADMIN' | 'MODERATOR'>('SUPER_ADMIN');
  const [activeAdminTab, setActiveAdminTab] = useState<'METRICS' | 'WORKERS' | 'REPORTS' | 'PAYMENTS'>('METRICS');

  const t = TRANSLATIONS[language];

  // Calculations for KPI Cards
  const activeWorkers = workers.filter(w => !w.isSuspended).length;
  const suspendedWorkers = workers.filter(w => w.isSuspended).length;
  const verifiedWorkers = workers.filter(w => w.isVerified).length;
  const boostedWorkers = workers.filter(w => w.isPremium).length;
  const totalRevenue = transactions.reduce((sum, tx) => sum + (tx.status === 'SUCCESS' ? tx.amount : 0), 0);
  const openReports = reports.filter(r => r.status === 'PENDING').length;

  const handleLogoutAdmin = () => {
    setActiveScreen('welcome');
  };

  return (
    <div className="min-h-screen bg-black p-6 md:p-10 font-sans text-white" id="admin-hub-screen">
      {/* Admin Header */}
      <header className="max-w-7xl mx-auto bg-[#111111] text-white border border-white/10 rounded-3xl p-6 mb-8 flex flex-col md:flex-row justify-between items-center gap-4 shadow-2xl text-left" id="admin-header-nav">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase font-black text-emerald-400 tracking-widest">
            Republic of Rwanda Moderation Portal
          </span>
          <h2 className="text-xl md:text-2xl font-black uppercase text-white flex items-center gap-2">
            🛡️ UMUKOZI ADMIN PANEL
          </h2>
          <span className="text-xs text-gray-500 font-bold uppercase mt-1">
            Logged In Session: <span className="text-[#00A550] font-black underline">{adminRole} Mode</span>
          </span>
        </div>

        <div className="flex gap-2" id="admin-header-actions">
          <select 
            value={adminRole}
            onChange={(e) => setAdminRole(e.target.value as any)}
            className="bg-black text-white border border-white/15 px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase cursor-pointer"
            id="admin-role-picker"
          >
            <option value="SUPER_ADMIN">SUPER ADMIN</option>
            <option value="MODERATOR">MODERATOR</option>
          </select>
          
          <button
            onClick={handleLogoutAdmin}
            className="bg-red-650 hover:bg-red-700 border border-transparent text-white px-4 py-2 rounded-xl text-xs font-extrabold uppercase flex items-center gap-1.5 cursor-pointer"
            id="btn-admin-exit"
          >
            <LogOut size={14} /> Exit Admin
          </button>
        </div>
      </header>

      {/* Admin Subnav */}
      <nav className="max-w-7xl mx-auto flex gap-1.5 bg-[#111111] p-1 rounded-2xl border border-white/10 max-w-sm mb-8 shadow-sm" id="admin-subnav-bar">
        {(['METRICS', 'WORKERS', 'REPORTS', 'PAYMENTS'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveAdminTab(tab)}
            className={`flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all cursor-pointer ${
              activeAdminTab === tab 
                ? 'bg-[#00A550] text-[#000000]' 
                : 'text-gray-500 hover:text-white hover:bg-neutral-900'
            }`}
            id={`tab-admin-${tab}`}
          >
            {tab}
          </button>
        ))}
      </nav>

      {/* Main Admin Section */}
      <main className="max-w-7xl mx-auto flex flex-col gap-6" id="admin-main-section">
        
        {/* Tab 1: Live Analytics Metrics */}
        {activeAdminTab === 'METRICS' && (
          <div className="flex flex-col gap-6" id="admin-metrics-view">
            
            {/* KPI grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4" id="kpi-grid">
              
              {/* Card: Registered Workers */}
              <div className="bg-[#111111] border border-white/10 rounded-2xl p-5 text-left shadow-2xl">
                <span className="text-[10px] text-gray-500 uppercase font-black">Registered Workers</span>
                <p className="text-2xl font-black text-white mt-1">{activeWorkers}</p>
                <span className="text-[9px] text-[#00A550] uppercase mt-2 block font-bold">● Active in Hub</span>
              </div>

              {/* Card: Total RWF Revenue */}
              <div className="bg-black border border-[#00A550] text-[#00A550] rounded-2xl p-5 text-left shadow-2xl">
                <span className="text-[10px] text-emerald-450 uppercase font-black">Total MoMo Revenue</span>
                <p className="text-2xl font-black text-white mt-1">{totalRevenue.toLocaleString()} RWF</p>
                <span className="text-[9px] text-emerald-300 uppercase mt-2 block font-bold">100% SECURE VIA GATEWAY</span>
              </div>

              {/* Card: Active ID Audited */}
              <div className="bg-[#111111] border border-white/10 rounded-2xl p-5 text-left shadow-2xl">
                <span className="text-[10px] text-gray-500 uppercase font-black">Verified Credentials</span>
                <p className="text-2xl font-black text-white mt-1">{verifiedWorkers}</p>
                <span className="text-[9px] text-amber-500 uppercase mt-2 block font-bold">Pending: {workers.length - verifiedWorkers}</span>
              </div>

              {/* Card: Reports Pending */}
              <div className="bg-[#111111] border border-white/10 rounded-2xl p-5 text-left shadow-2xl">
                <span className="text-[10px] text-red-400 uppercase font-black">Open Report Tickets</span>
                <p className="text-2xl font-black text-red-500 mt-1">{openReports}</p>
                <span className="text-[9px] text-red-405 uppercase mt-2 block font-bold">Needs Moderation</span>
              </div>
            </div>

            {/* Platform Analytics Charts / Overview tables */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" id="analytics-grids">
              <div className="bg-[#111111] border border-white/10 rounded-2xl p-5 text-left shadow-2xl text-white">
                <h3 className="text-sm font-black uppercase text-white mb-4 pb-2 border-b border-white/5">
                  ⚡ Business Metrics & Fee Scales
                </h3>
                <div className="flex flex-col gap-3 text-xs uppercase" id="metric-values-desc">
                  <div className="flex justify-between p-2.5 bg-black border border-white/5 rounded-lg text-gray-300">
                    <span>Wage Seeker Registration</span>
                    <span className="text-[#00A550] font-black">FREE (0 RWF)</span>
                  </div>
                  <div className="flex justify-between p-2.5 bg-black border border-white/5 rounded-lg text-gray-300">
                    <span>Contact Info Reveal (Single unlock)</span>
                    <span className="text-white font-black">500 RWF</span>
                  </div>
                  <div className="flex justify-between p-2.5 bg-black border border-white/5 rounded-lg text-gray-300">
                    <span>Worker Premium Profile Boost</span>
                    <span className="text-white font-black">2,000 RWF/month</span>
                  </div>
                  <div className="flex justify-between p-2.5 bg-black border border-white/5 rounded-lg text-gray-300">
                    <span>Employer Unlimited Access Subs</span>
                    <span className="text-white font-black">10,000 - 25,000 RWF</span>
                  </div>
                </div>
              </div>

              <div className="bg-[#111111] border border-white/10 rounded-2xl p-5 text-left shadow-2xl text-white">
                <h3 className="text-sm font-black uppercase text-white mb-4 pb-2 border-b border-white/5">
                  📅 System Diagnostic Log
                </h3>
                <div className="flex flex-col gap-2.5 font-sans text-[10px] text-gray-300" id="diagnostic-scroll">
                  <p className="bg-[#002B16]/20 text-[#00A550] p-2 rounded border border-emerald-905/30">
                    [SYSTEM_OK 2026-06-12] Umukozi server container running on port <span className="underline font-black">3000</span>. Nginx reverse proxy mapped.
                  </p>
                  <p className="bg-black text-gray-300 p-2 rounded border border-white/5">
                    [PAYMENT_GATE 2026-06-12] Connected securely: MTN MoMo API & Airtel Money gateway online.
                  </p>
                  <p className="bg-black text-gray-300 p-2 rounded border border-white/5">
                    [DATABASE_OK 2026-06-12] Local persistence layer matched with 9 registered seed workers.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: User Grid Directory */}
        {activeAdminTab === 'WORKERS' && (
          <div className="bg-[#111111] border border-white/10 rounded-2xl p-5 text-left shadow-2xl text-white" id="admin-workers-view">
            <div className="flex justify-between items-center gap-2 mb-4 flex-wrap">
              <h3 className="text-sm font-black uppercase text-white">
                🛠️ Workers Registry ({workers.length} accounts)
              </h3>
              <span className="text-[10px] text-emerald-400 bg-emerald-950/20 border border-emerald-900/30 px-2.5 py-1 rounded">
                Super Admin Privileges Active
              </span>
            </div>

            <div className="overflow-x-auto" id="workers-admin-table-container">
              <table className="w-full text-xs uppercase" id="workers-admin-table">
                <thead>
                  <tr className="bg-black/40 border-b border-white/10 text-left text-gray-500">
                    <th className="p-3 font-bold">Specialist</th>
                    <th className="p-3 font-bold">Trade Category</th>
                    <th className="p-3 font-bold">Location Group</th>
                    <th className="p-3 font-bold">RWF Status</th>
                    <th className="p-3 font-bold">Safety Moderation Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {workers.map((worker) => (
                    <tr key={worker.id} className="border-b border-white/5 hover:bg-neutral-900" id={`row-worker-adm-${worker.id}`}>
                      {/* Person info */}
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <img src={worker.photoUrl} alt="" className="w-8 h-8 rounded-full object-cover border border-white/10" referrerPolicy="no-referrer" />
                          <div className="flex flex-col">
                            <span className="font-black text-white">{worker.fullName}</span>
                            <span className="text-[9px] text-gray-500 font-bold">{worker.phoneNumber}</span>
                          </div>
                        </div>
                      </td>

                      {/* Trade Specialty */}
                      <td className="p-3 font-bold text-gray-300">
                        {worker.category}
                      </td>

                      {/* Location details */}
                      <td className="p-3 text-[10px] text-gray-500">
                        {worker.location.district} › {worker.location.sector}
                      </td>

                      {/* Verification status / Premium flags indicators */}
                      <td className="p-3 flex flex-col gap-1">
                        {worker.isVerified ? (
                          <span className="text-[8px] bg-[#00A550]/10 text-emerald-400 border border-[#00A550]/20 px-1 rounded-sm w-fit font-black">ID Verified</span>
                        ) : (
                          <span className="text-[8px] bg-amber-950/20 text-amber-400 border border-amber-900/30 px-1 rounded-sm w-fit font-bold">Unverified</span>
                        )}
                        {worker.isPremium ? (
                          <span className="text-[8px] bg-black text-[#00A550] border border-[#00A550]/30 px-1 rounded-sm w-fit font-black">Featured Boost</span>
                        ) : (
                          <span className="text-[8px] bg-neutral-900 text-gray-500 border border-white/5 px-1 rounded-sm w-fit font-bold">Regular</span>
                        )}
                      </td>

                      {/* Admin action switches */}
                      <td className="p-3">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {/* 1. Toggle Verification */}
                          <button
                            onClick={() => toggleVerifyWorker(worker.id)}
                            className={`px-2 py-1 rounded text-[9px] font-black cursor-pointer border ${
                              worker.isVerified 
                                ? 'bg-[#00A550]/10 text-[#00A550] border-[#00A550]/30 hover:bg-[#00A550]/20' 
                                : 'bg-black border-white/15 text-white hover:bg-neutral-900'
                            }`}
                            id={`btn-verify-worker-${worker.id}`}
                          >
                            {worker.isVerified ? '✅ Approved' : 'Verify ID'}
                          </button>

                          {/* 2. Premium Booster boost switch */}
                          <button
                            onClick={() => toggleBoostWorker(worker.id)}
                            className="px-2 py-1 bg-black border border-white/10 hover:bg-neutral-900 text-[#00A550] rounded text-[9px] font-black cursor-pointer"
                            id={`btn-boost-worker-${worker.id}`}
                          >
                            {worker.isPremium ? '★ De-boost' : '★ Boost'}
                          </button>

                          {/* 3. Suspend accounts */}
                          <button
                            disabled={adminRole !== 'SUPER_ADMIN'}
                            onClick={() => toggleSuspendWorker(worker.id)}
                            className={`px-2 py-1 rounded text-[9px] font-black cursor-pointer border ${
                              worker.isSuspended 
                                ? 'bg-red-950/40 border-red-850 text-red-400' 
                                : 'bg-red-950/10 border-red-900/30 text-red-400 hover:bg-red-950/20'
                            } disabled:opacity-50 disabled:cursor-not-allowed`}
                            id={`btn-suspend-worker-${worker.id}`}
                          >
                            {worker.isSuspended ? 'Suspended 🚨' : 'Suspend 🚨'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Moderation Reports Queue */}
        {activeAdminTab === 'REPORTS' && (
          <div className="bg-[#111111] border border-white/10 rounded-2xl p-5 text-left shadow-2xl text-white" id="admin-reports-view">
            <h3 className="text-sm font-black uppercase text-white mb-4 flex items-center gap-1.5 border-b border-white/5 pb-2">
              <ShieldAlert className="text-red-405 animate-pulse" size={18} />
              Platform Moderation Queue ({reports.length} reported accounts)
            </h3>

            {reports.length === 0 ? (
              <p className="text-xs text-gray-500 py-10 uppercase italic text-center">
                All clean! There are no open behavioral reports at this time.
              </p>
            ) : (
              <div className="flex flex-col gap-4" id="reports-queue-list">
                {reports.map((report) => (
                  <div 
                    key={report.id} 
                    className={`border p-4.5 rounded-2xl flex flex-col justify-between gap-4 ${
                      report.status === 'PENDING' ? 'border-red-500/30 bg-red-950/10' : 'border-white/5 bg-neutral-900 opacity-60'
                    }`}
                    id={`report-card-${report.id}`}
                  >
                    <div className="flex justify-between items-start flex-wrap gap-2 text-xs">
                      <div>
                        <span className="text-[10px] text-gray-500 font-extrabold uppercase block">
                          Report Category: Suspicion Report #{report.id}
                        </span>
                        <h4 className="text-xs font-black text-white uppercase mt-1">
                          Accused Party: <span className="text-red-400 font-black">{report.reportedName}</span> (ID: {report.reportedId})
                        </h4>
                      </div>
                      <span className="text-[9px] text-gray-500 font-black">{report.date}</span>
                    </div>

                    <p className="text-xs text-gray-200 bg-black border border-white/5 p-3.5 rounded-xl font-bold italic">
                      "{report.reason}"
                    </p>

                    <div className="flex justify-between items-center flex-wrap gap-3">
                      <span className="text-[9px] text-gray-500">
                        Filer: <span className="text-white font-extrabold font-sans uppercase">{report.reporterName}</span> (ID: {report.reporterId})
                      </span>

                      {report.status === 'PENDING' ? (
                        <div className="flex gap-2" id="report-actions-row">
                          <button
                            onClick={() => resolveReport(report.id, 'DISMISSED')}
                            className="bg-black border border-white/10 hover:bg-neutral-900 text-white px-3 py-1.5 rounded-lg text-[10px] font-black uppercase cursor-pointer"
                            id={`btn-dismiss-report-${report.id}`}
                          >
                            Dismiss Report
                          </button>
                          
                          <button
                            onClick={() => {
                              toggleSuspendWorker(report.reportedId);
                              resolveReport(report.id, 'RESOLVED');
                            }}
                            className="bg-red-600 hover:bg-red-700 border border-transparent text-white px-3 py-1.5 rounded-lg text-[10px] font-black uppercase cursor-pointer flex items-center gap-1"
                            id={`btn-resolve-suspend-${report.id}`}
                          >
                            Suspend Accused 🚨
                          </button>
                        </div>
                      ) : (
                        <span className="bg-[#00a550]/10 text-emerald-400 border border-[#00a550]/20 px-2.5 py-1 rounded text-[9px] font-black uppercase">
                          Resolved & Audited
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Payments Logs */}
        {activeAdminTab === 'PAYMENTS' && (
          <div className="bg-[#111111] border border-white/10 rounded-2xl p-5 text-left shadow-2xl text-white" id="admin-payments-view">
            <h3 className="text-sm font-black uppercase text-white mb-4">
              💳 Transaction Logs ({transactions.length} records processed)
            </h3>

            <div className="overflow-x-auto" id="payments-admin-table-container">
              <table className="w-full text-xs uppercase" id="payments-admin-table">
                <thead>
                  <tr className="bg-black/40 border-b border-white/10 text-left text-gray-500">
                    <th className="p-3 font-bold">Transaction Reference ID</th>
                    <th className="p-3 font-bold">Payer Account</th>
                    <th className="p-3 font-bold">Value (RWF)</th>
                    <th className="p-3 font-bold">Operator Gateway</th>
                    <th className="p-3 font-bold">Date Timestamp</th>
                    <th className="p-3 font-bold">Description Match</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx) => (
                    <tr key={tx.id} className="border-b border-white/5 hover:bg-neutral-900 text-gray-300" id={`row-payment-adm-${tx.id}`}>
                      <td className="p-3 font-black text-white font-sans">
                        #{tx.id}
                      </td>
                      <td className="p-3">
                        <div className="flex flex-col">
                          <span className="font-black text-white">{tx.userName}</span>
                          <span className="text-[9px] text-gray-500 font-bold">{tx.phoneNumber}</span>
                        </div>
                      </td>
                      <td className="p-3 font-black text-[#00A550]">
                        {tx.amount.toLocaleString()} RWF
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-black text-center w-fit uppercase ${
                          tx.provider === 'MTN' 
                            ? 'bg-[#FFCC00]/10 text-[#FFCC00] border border-[#FFCC00]/25' 
                            : 'bg-red-950/20 text-red-400 border border-red-900/25'
                        }`}>
                          {tx.provider}
                        </span>
                      </td>
                      <td className="p-3 text-gray-500">
                        {tx.timestamp}
                      </td>
                      <td className="p-3 text-[10px] lowercase italic font-bold text-gray-500">
                        {tx.description}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

