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
      setError("Please enter a valid Mobile Money number.");
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
      <div className="min-h-screen bg-green-700 flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-sm text-center">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-2xl font-black text-green-700 mb-2">{t.paySuccess}</h2>
          <p className="text-gray-500 text-sm mb-6">500 RWF received via {provider}</p>
          <button onClick={() => setScreen("search")}
            className="w-full bg-green-600 hover:bg-green-700 text-white p-4 rounded-2xl font-black text-lg">
            {t.searchWorkers} →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-700 flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-sm">
        <div className="text-center mb-6">
          <div className="text-5xl mb-3">💳</div>
          <h1 className="text-2xl font-black text-green-700">{t.paymentTitle}</h1>
          <p className="text-gray-500 text-sm mt-2">{t.paymentDesc}</p>
          <div className="mt-3 bg-green-100 border border-green-400 rounded-xl p-3">
            <span className="text-green-800 font-black text-2xl">500 RWF</span>
          </div>
        </div>
        {error && <div className="bg-red-100 text-red-700 p-3 rounded-xl mb-4 font-bold text-sm">{error}</div>}
        <form onSubmit={handlePay} className="flex flex-col gap-4">
          <div>
            <label className="text-xs font-black text-gray-500 uppercase">Provider</label>
            <div className="flex gap-3 mt-1">
              {["MTN", "Airtel"].map(p => (
                <button type="button" key={p} onClick={() => setProvider(p)}
                  className={`flex-1 p-3 rounded-xl font-black border-2 transition-all ${provider === p ? "bg-yellow-400 border-yellow-500 text-black" : "bg-white border-gray-200 text-gray-600"}`}>
                  {p === "MTN" ? "🟡 MTN" : "🔴 Airtel"}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs font-black text-gray-500 uppercase">{t.momoNumber}</label>
            <input value={momoNumber} onChange={e => setMomoNumber(e.target.value)}
              className="w-full border-2 border-gray-200 rounded-xl p-3 mt-1 font-bold focus:border-green-500 outline-none"
              placeholder="+250 788 000 000" />
          </div>
          <button type="submit" disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white p-4 rounded-2xl font-black text-lg">
            {loading ? "Processing... ⏳" : t.confirmPay + " — 500 RWF"}
          </button>
          <button type="button" onClick={() => setScreen("register-employer")}
            className="w-full text-center text-gray-400 hover:text-gray-600 font-bold text-sm py-2">
            &larr; Back
          </button>
        </form>
      </div>
    </div>
  );
};

