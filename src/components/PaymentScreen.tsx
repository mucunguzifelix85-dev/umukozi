import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { TRANSLATIONS } from "../data/mockData";

export const PaymentScreen: React.FC = () => {
  const { language, setScreen, setHasPaid } = useApp();
  const t = TRANSLATIONS[language];
  const [momoNumber, setMomoNumber] = useState("");
  const [provider, setProvider] = useState("MTN");
  const [loading, setLoading] = useState(false);
  const [paid, setPaid] = useState(false);
  const [error, setError] = useState("");

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    if (!momoNumber || momoNumber.length < 9) {
      setError(t.fillAllFields);
      return;
    }
    setLoading(true);
    setError("");
    setTimeout(() => {
      setLoading(false);
      setPaid(true);
      setHasPaid(true);
    }, 2000);
  };

  if (paid) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{background:"#1877F2"}}>
        <div className="p-8 w-full max-w-sm text-center" style={{background:"#fff",borderRadius:"24px",boxShadow:"0 4px 32px #1877F255"}}>
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-2xl font-black mb-2" style={{color:"#1877F2"}}>{t.paySuccess}</h2>
          <p className="text-sm mb-6" style={{color:"#606770"}}>500 RWF — {provider === "MTN" ? t.mtnLabel : t.airtelLabel}</p>
          <button onClick={() => setScreen("search")}
            className="w-full p-4 rounded-2xl font-black text-lg hover:opacity-90"
            style={{background:"#1877F2",color:"#fff",border:"none"}}>
            {t.searchWorkers} →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{background:"#1877F2"}}>
      <div className="p-8 w-full max-w-sm" style={{background:"#fff",borderRadius:"24px",boxShadow:"0 4px 32px #1877F255"}}>
        <div className="text-center mb-6">
          <div className="text-5xl mb-3">💳</div>
          <h1 className="text-2xl font-black" style={{color:"#1877F2"}}>{t.paymentTitle}</h1>
          <p className="text-sm mt-2 font-bold" style={{color:"#606770"}}>{t.paymentDesc}</p>
          <div className="mt-3 rounded-xl p-3" style={{background:"#e7f3ff",border:"1px solid #1877F2"}}>
            <span className="font-black text-2xl" style={{color:"#1877F2"}}>500 RWF</span>
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-xl mb-4 font-bold text-sm" style={{background:"#ffebe8",color:"#d32f2f",border:"1px solid #f5c6cb"}}>
            {error}
          </div>
        )}

        <form onSubmit={handlePay} className="flex flex-col gap-4">
          <div>
            <label className="text-xs font-black uppercase" style={{color:"#606770"}}>{t.provider}</label>
            <div className="flex gap-3 mt-1">
              {["MTN", "Airtel"].map(p => (
                <button type="button" key={p} onClick={() => setProvider(p)}
                  className="flex-1 p-3 rounded-xl font-black transition-all hover:opacity-90"
                  style={provider === p
                    ? {background:"#1877F2",color:"#fff",border:"2px solid #1877F2"}
                    : {background:"#f0f2f5",color:"#050505",border:"2px solid #e4e6eb"}}>
                  {p === "MTN" ? `🟡 ${t.mtnLabel}` : `🔴 ${t.airtelLabel}`}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs font-black uppercase" style={{color:"#606770"}}>{t.momoNumber}</label>
            <input value={momoNumber} onChange={e => setMomoNumber(e.target.value)}
              className="w-full rounded-xl p-3 mt-1 font-bold outline-none"
              style={{border:"1.5px solid #1877F2",background:"#f0f2f5",color:"#050505"}}
              placeholder={t.workerPlaceholderPhone} />
          </div>
          <button type="submit" disabled={loading}
            className="w-full p-4 rounded-2xl font-black text-lg hover:opacity-90"
            style={{background: loading ? "#e4e6eb" : "#1877F2",color: loading ? "#606770" : "#fff",border:"none"}}>
            {loading ? t.processingPayment : `${t.confirmPay} — 500 RWF`}
          </button>
          <button type="button" onClick={() => setScreen("register-employer")}
            className="w-full text-center font-bold text-sm py-2"
            style={{color:"#606770"}}>
            ← {t.back}
          </button>
        </form>
      </div>
    </div>
  );
};
