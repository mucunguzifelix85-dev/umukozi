import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TRANSLATIONS } from '../data/mockData';
import { Smartphone, CheckCircle, CreditCard, Loader2, AlertCircle, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface PaymentDialogueProps {
  amount: number;
  description: string;
  workerIdToUnlock?: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export const PaymentDialogue: React.FC<PaymentDialogueProps> = ({
  amount = 500,
  description,
  workerIdToUnlock,
  onSuccess,
  onCancel
}) => {
  const { language, processPayment } = useApp();
  const t = TRANSLATIONS[language];

  const [provider, setProvider] = useState<'MTN' | 'Airtel'>('MTN');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [paymentPhase, setPaymentPhase] = useState<'IDLE' | 'SENDING' | 'PIN_AWAIT' | 'SUCCESS' | 'FAILED'>('IDLE');
  const [ussdSimulatedCode, setUssdSimulatedCode] = useState('');

  const initiatePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber || phoneNumber.length < 8) {
      alert(language === 'rw' ? 'Nyamuneka andika Nomero ya Mobile Money nyayo!' : 'Please enter a valid Mobile Money number!');
      return;
    }

    setPaymentPhase('SENDING');
    
    // Step 1: Simulate sending telecommunication payload
    setTimeout(() => {
      setPaymentPhase('PIN_AWAIT');
      // Generate standard random USSD prompt reference
      setUssdSimulatedCode(Math.floor(100000 + Math.random() * 900000).toString());
    }, 1500);
  };

  const handleAuthorizePin = async () => {
    setPaymentPhase('SENDING');
    
    // Call our Context payment execution
    const isSuccess = await processPayment(
      amount,
      provider,
      phoneNumber,
      description,
      workerIdToUnlock
    );

    if (isSuccess) {
      setPaymentPhase('SUCCESS');
      setTimeout(() => {
        onSuccess();
      }, 2000);
    } else {
      setPaymentPhase('FAILED');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in" id="payment-overlay">
      <div 
        className="w-full max-w-sm bg-[#111111] border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col text-left text-white"
        id="payment-dialog-card"
      >
        {/* Yellow/Yellow-Orange header for MTN or Crimson Red for Airtel */}
        <div className={`p-5 text-white flex justify-between items-center transition-colors duration-300 ${
          provider === 'MTN' ? 'bg-[#FFCC00] text-black' : 'bg-[#D00000] text-white'
        }`} id="payment-provider-header">
          <div>
            <span className="text-[10px] uppercase font-black tracking-widest opacity-80">
              {t.payGateTitle}
            </span>
            <h3 className="text-lg font-black tracking-tight uppercase mt-0.5">
              {provider} Mobile Money
            </h3>
          </div>
          <div className="bg-[#1a1a1a] px-3 py-1.5 rounded-lg border border-white/10 text-xs font-black uppercase text-emerald-400">
            {amount} RWF
          </div>
        </div>

        <div className="p-6 flex flex-col gap-4 text-xs font-bold" id="payment-body">
          
          {paymentPhase === 'IDLE' && (
            <form onSubmit={initiatePayment} className="flex flex-col gap-4" id="form-initiate-momo-payment">
              <span className="text-gray-405 text-[10px] uppercase tracking-wide leading-relaxed">
                {language === 'rw' 
                  ? 'Koresha irembo ry\'Umukozi kugira ngo wishyure amafaranga 500 RWF. Amakuru agera kuri telephone yawe ako kanya.' 
                  : 'Authorized billing channel for Rwanda. Secure client credentials will be revealed instantly upon payment.'}
              </span>

              {/* Provider Tabs */}
              <div className="grid grid-cols-2 gap-2" id="provider-selector-tabs">
                <button
                  type="button"
                  onClick={() => setProvider('MTN')}
                  className={`py-3.5 px-4 rounded-xl border flex items-center justify-center gap-1.5 cursor-pointer uppercase font-extrabold ${
                    provider === 'MTN' 
                      ? 'border-[#FFCC00] bg-[#FFCC00]/5 text-[#FFCC00]' 
                      : 'border-white/10 bg-black text-gray-400 hover:border-white/20'
                  }`}
                  id="tab-momo-mtn"
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FFCC00]"></span>
                  MTN MoMo
                </button>
                <button
                  type="button"
                  onClick={() => setProvider('Airtel')}
                  className={`py-3.5 px-4 rounded-xl border flex items-center justify-center gap-1.5 cursor-pointer uppercase font-extrabold ${
                    provider === 'Airtel' 
                      ? 'border-[#D00000] bg-[#D00000]/5 text-[#D00000]' 
                      : 'border-white/10 bg-black text-gray-400 hover:border-white/20'
                  }`}
                  id="tab-momo-airtel"
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-[#D00000]"></span>
                  Airtel Money
                </button>
              </div>

              {/* Mobile Number Entry */}
              <div className="flex flex-col gap-1.5" id="input-group-momo">
                <label className="text-[10px] uppercase font-black text-white">{t.momoNumber}</label>
                <div className="relative">
                  <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-450" size={16} />
                  <input 
                    type="tel"
                    placeholder="e.g. 0788123456" 
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                    className="w-full border border-white/15 pl-10 pr-4 py-3 rounded-xl bg-black text-white outline-none tracking-wider text-xs font-bold focus:border-[#00a550]"
                    id="field-momo-number"
                    required
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 mt-2" id="momo-action-buttons">
                <button
                  type="button"
                  onClick={onCancel}
                  className="flex-1 bg-black border border-white/15 hover:bg-neutral-900 p-3.5 rounded-xl text-xs text-white uppercase font-extrabold cursor-pointer text-center"
                  id="btn-momo-cancel"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-[#00A550] hover:bg-emerald-600 border border-[#00A550] text-[#000000] p-3.5 rounded-xl text-xs uppercase font-black cursor-pointer text-center"
                  id="btn-momo-submit"
                >
                  {t.payNow} 💳
                </button>
              </div>
            </form>
          )}

          {/* TELECOM PROGRESS FEEDBACK */}
          {paymentPhase === 'SENDING' && (
            <div className="py-12 flex flex-col items-center justify-center text-center gap-4" id="telecom-loading">
              <Loader2 className="w-10 h-10 text-emerald-400 animate-spin" />
              <div>
                <h4 className="text-sm font-black uppercase text-white">Contacting Gateway...</h4>
                <p className="text-[10px] text-gray-400 uppercase mt-1 leading-relaxed">
                  Securing mobile channels. Please do not leave the screen or turn off your device.
                </p>
              </div>
            </div>
          )}

          {/* SIMULATED SYSTEM USSD DIALOG FOR SECURITY CODE PIN CONFIRMATION */}
          {paymentPhase === 'PIN_AWAIT' && (
            <div className="p-4 bg-[#00A550]/5 border border-[#00A550]/20 rounded-2xl flex flex-col gap-3 text-center animate-fade-in" id="simulated-ussd-popup">
              <Sparkles className="w-6 h-6 text-[#00A550] mx-auto animate-bounce" />
              <div>
                <h4 className="text-xs font-black uppercase text-white mb-1">
                  Simulated Mobile OTP Push
                </h4>
                <div className="bg-black border border-dashed border-[#00A550]/40 p-3 rounded-xl max-w-xs mx-auto flex flex-col gap-1.5 my-2">
                  <span className="text-[9px] text-[#00A550] uppercase tracking-widest font-black">Incoming Telecom Prompt</span>
                  <p className="text-xs text-gray-100 font-bold leading-normal">
                    Do you authorize payment of <span className="text-[#00A550] underline font-black">500 RWF</span> on transaction <span className="text-white font-black">#{ussdSimulatedCode}</span> to UMUKOZI JOBS? Enter secret PIN on your handset or click confirm below.
                  </p>
                </div>
              </div>
              <p className="text-[9px] text-gray-400 uppercase leading-snug font-sans">
                (This simulates the MTN/Airtel network push alert that will reveal on the user's real phone)
              </p>
              <div className="flex gap-2 mt-1" id="ussd-confirmation-buttons">
                <button
                  type="button" 
                  onClick={() => setPaymentPhase('IDLE')}
                  className="flex-1 bg-black border border-white/10 text-white p-2.5 rounded-xl uppercase text-[10px] font-black cursor-pointer hover:bg-neutral-900"
                  id="btn-momo-decline"
                >
                  Reject PIN
                </button>
                <button
                  type="button"
                  onClick={handleAuthorizePin}
                  className="flex-1 bg-[#00A550] text-[#000000] border border-[#00A550] p-2.5 rounded-xl uppercase text-[10px] font-black cursor-pointer animate-pulse"
                  id="btn-momo-approve"
                >
                  Approve PIN ✅
                </button>
              </div>
            </div>
          )}

          {/* PAYMENT SUCCESS CONFIRMATION SCREEN */}
          {paymentPhase === 'SUCCESS' && (
            <div className="py-10 flex flex-col items-center justify-center text-center gap-4 animate-fade-in animate-scale-up" id="momo-success-view">
              <div className="w-14 h-14 bg-[#00A550]/10 border border-[#00A550] text-[#00A550] rounded-full flex items-center justify-center animate-bounce shadow-md">
                <CheckCircle size={32} />
              </div>
              <div>
                <h4 className="text-sm font-black uppercase text-[#00A550]">
                  {t.paySuccess}
                </h4>
                <p className="text-[10px] text-gray-400 uppercase mt-2 max-w-xs mx-auto leading-relaxed">
                  {t.paySuccessMsg}
                </p>
              </div>
              <div className="bg-[#00A550]/10 border border-[#00A550]/20 px-3 py-1.5 rounded-lg text-[9px] text-emerald-400 uppercase">
                Payment Ref: TX-{(Math.random() * 100000).toFixed(0)}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
