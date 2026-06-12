import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Location } from '../types';
import { PROVINCES, DISTRICTS, getSectorsForDistrict, getCellsForSector } from '../data/locations';
import { SKILL_CATEGORIES, WORK_DURATIONS, TRANSLATIONS } from '../data/mockData';
import { Logo } from './Logo';
import { ArrowLeft, Check, ShieldCheck, Mail, Phone, Lock, Camera, MapPin, Briefcase } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const RegistrationForm: React.FC = () => {
  const { 
    activeScreen, 
    setActiveScreen, 
    language, 
    registerWorker, 
    registerEmployer 
  } = useApp();

  const isWorkerForm = activeScreen === 'register-worker';
  const t = TRANSLATIONS[language];

  // Common Fields
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [nationalId, setNationalId] = useState('');
  
  // Location States
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedSector, setSelectedSector] = useState('');
  const [selectedCell, setSelectedCell] = useState('');
  const [village, setVillage] = useState('');

  // Dropdown lists
  const [districtList, setDistrictList] = useState<string[]>([]);
  const [sectorList, setSectorList] = useState<string[]>([]);
  const [cellList, setCellList] = useState<string[]>([]);

  // Worker-Specific Fields
  const [selectedSkill, setSelectedSkill] = useState('');
  const [selectedExperience, setSelectedExperience] = useState<'Beginner' | 'Intermediate' | 'Expert'>('Intermediate');
  const [photoUrl, setPhotoUrl] = useState('https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop');

  // Employer-Specific Fields
  const [selectedDuration, setSelectedDuration] = useState('');

  // OTP Simulation States
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [showOtpAlert, setShowOtpAlert] = useState<string | null>(null);
  const [otpError, setOtpError] = useState(false);

  // Form error states
  const [validationError, setValidationError] = useState<string | null>(null);

  // Effect to handle location cascading
  useEffect(() => {
    if (selectedProvince) {
      setDistrictList(DISTRICTS[selectedProvince] || []);
      setSelectedDistrict('');
      setSelectedSector('');
      setSelectedCell('');
    } else {
      setDistrictList([]);
    }
  }, [selectedProvince]);

  useEffect(() => {
    if (selectedDistrict) {
      setSectorList(getSectorsForDistrict(selectedDistrict));
      setSelectedSector('');
      setSelectedCell('');
    } else {
      setSectorList([]);
    }
  }, [selectedDistrict]);

  useEffect(() => {
    if (selectedSector) {
      setCellList(getCellsForSector(selectedSector));
      setSelectedCell('');
    } else {
      setCellList([]);
    }
  }, [selectedSector]);

  // Handle OTA trigger simulation
  const handleSendOtp = () => {
    if (!phoneNumber || phoneNumber.length < 8) {
      alert(language === 'rw' ? 'Kora Wandike numero yuzuye ihagije!' : 'Please enter a valid phone number first!');
      return;
    }
    const simulatedCode = Math.floor(1000 + Math.random() * 9000).toString();
    setOtpCode(simulatedCode);
    setOtpSent(true);
    setOtpError(false);
    
    // Trigger in-app visual floating toast SMS
    setShowOtpAlert(simulatedCode);
    setTimeout(() => {
      setShowOtpAlert(null);
    }, 7000); // Float for 7 seconds to let user read
  };

  const handleVerifyOtp = () => {
    if (otpInput === otpCode) {
      setIsPhoneVerified(true);
      setOtpSent(false);
      setOtpError(false);
    } else {
      setOtpError(true);
    }
  };

  const handlePhotoSelect = () => {
    // Cycles simple avatar photos to simulate camera selection
    const mockAvatars = [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop',
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop'
    ];
    const currentIndex = mockAvatars.indexOf(photoUrl);
    const nextIndex = (currentIndex + 1) % mockAvatars.length;
    setPhotoUrl(mockAvatars[nextIndex]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    // General Validation
    if (!fullName.trim()) {
      setValidationError(language === 'rw' ? 'Izina ryose ni ryo rikenewe!' : 'Full Name is required!');
      return;
    }
    if (!phoneNumber) {
      setValidationError(language === 'rw' ? 'Numero ya telefone ni iyo gushyirwamo!' : 'Phone Number is required!');
      return;
    }
    if (!isPhoneVerified) {
      setValidationError(language === 'rw' ? 'Ugomba kubanza kwemeza kode ya OTP yoherejwe kuri Telefone!' : 'You must verify your phone connection via SMS OTP first!');
      return;
    }
    if (!selectedProvince || !selectedDistrict || !selectedSector || !selectedCell || !village.trim()) {
      setValidationError(language === 'rw' ? 'Gira upfe wandike agace kawe kose mu milihano ya Dropdowns!' : 'All location dropdowns (Province, District, Sector, Cell, and Village text) must be completed!');
      return;
    }

    const locationObj: Location = {
      province: selectedProvince,
      district: selectedDistrict,
      sector: selectedSector,
      cell: selectedCell,
      village: village
    };

    if (isWorkerForm) {
      // Worker validation helper
      if (!selectedSkill) {
        setValidationError(language === 'rw' ? 'Hitamo icyiciro cy\'umwuga nk\'umukozi!' : 'Please select your skill category!');
        return;
      }
      
      registerWorker({
        fullName,
        phoneNumber,
        nationalID: nationalId.trim() || undefined,
        location: locationObj,
        category: selectedSkill,
        experience: selectedExperience,
        photoUrl: photoUrl
      });
    } else {
      // Employer validation helper
      if (!selectedSkill) {
        setValidationError(language === 'rw' ? 'Hitamo imyuga ikenewe kubakoresha!' : 'Please select the type of work needed!');
        return;
      }
      if (!selectedDuration) {
        setValidationError(language === 'rw' ? 'Hitamo igihe akazi kzamara!' : 'Please select the job duration needed!');
        return;
      }
      
      registerEmployer({
        companyName: fullName.includes(' ') ? fullName : `${fullName} Business Limited`,
        fullName,
        phoneNumber,
        location: locationObj,
        categoryNeeded: selectedSkill,
        workDuration: selectedDuration as any
      });
    }
  };

  return (
    <div className="min-h-screen bg-black text-white py-10 px-4 md:px-12 flex flex-col items-center justify-center relative font-sans" id="registration-screen bg">
      {/* Dynamic SMS OTP Push Notification Simulation */}
      <AnimatePresence>
        {showOtpAlert && (
          <motion.div
            initial={{ opacity: 0, y: -80, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -40, scale: 0.95 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 w-full max-w-sm bg-black text-white border-2 border-emerald-500 rounded-xl p-4 shadow-2xl z-50 flex items-start gap-3.5 feedback-toast"
            id="otp-sms-simulated-box"
          >
            <div className="bg-[#00A550] p-2 text-black rounded-lg">
              <Phone size={18} className="animate-bounce" />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-center">
                <span className="text-[11px] text-emerald-400 tracking-wider font-extrabold uppercase">SMS ALERT: UMUKOZI HUB</span>
                <span className="text-[9px] text-[#00A550] uppercase font-bold">Just Now</span>
              </div>
              <p className="text-xs text-slate-100 mt-1 font-bold">
                Your secure Umukozi Registration verification OTP pin code is: <span className="text-emerald-400 text-lg underline font-black">{showOtpAlert}</span>. Use this to verify your mobile account!
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="w-full max-w-xl bg-[#111111] border border-white/10 text-white rounded-3xl p-6 md:p-8 shadow-[8px_8px_0px_0px_rgba(255,255,255,0.05)] relative" id="registration-card">
        {/* Back Button */}
        <button 
          onClick={() => setActiveScreen('welcome')}
          className="absolute top-6 left-6 p-2 rounded-lg border border-white/20 hover:bg-white/5 text-white cursor-pointer transition-colors"
          id="btn-back-to-welcome-from-reg"
        >
          <ArrowLeft size={16} />
        </button>

        <div className="text-center mb-8 mt-4" id="logo-block">
          <Logo size="sm" showTagline={false} />
          <h1 className="text-xl md:text-2xl font-black uppercase text-white mt-3 tracking-wide" id="reg-title">
            {isWorkerForm 
              ? (language === 'rw' ? 'KWIYANDIKISHA NK\'UMUKOZI' : 'WORKER REGISTRATION')
              : (language === 'rw' ? 'KWIYANDIKISHA NK\'UMUKORESHA' : 'EMPLOYER REGISTRATION')
              }
          </h1>
          <p className="text-xs text-gray-400 capitalize bg-white/5 border border-white/10 py-1.5 px-3 rounded-lg inline-block w-fit mx-auto mt-2 italic font-bold">
            {isWorkerForm ? t.registrationFree : t.registrationFeeText}
          </p>
        </div>

        {validationError && (
          <div className="bg-red-950/40 border border-red-500/50 text-red-200 text-xs text-center p-3 rounded-xl mb-6 font-bold" id="registration-error-banner">
            ⚠️ {validationError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5 text-left" id="registration-form">
          
          {/* Section: Profile Image for Workers */}
          {isWorkerForm && (
            <div className="flex flex-col items-center justify-center gap-2 mb-2" id="avatar-section">
              <div className="relative group cursor-pointer" onClick={handlePhotoSelect} id="photo-selector-box">
                <img 
                  src={photoUrl} 
                  alt="Worker Profile" 
                  className="w-24 h-24 rounded-full border-2 border-[#00A550] bg-[#111111] object-cover"
                  referrerPolicy="no-referrer"
                  id="preview-profile-photo"
                />
                <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="text-white" size={20} />
                </div>
              </div>
              <button 
                type="button" 
                onClick={handlePhotoSelect} 
                className="text-[10px] text-emerald-400 border border-emerald-500/20 bg-[#00A550]/10 px-2 py-1 rounded cursor-pointer uppercase font-bold hover:bg-[#00A550]/20"
                id="btn-switch-photo"
              >
                Change Simulated Photo 🔄
              </button>
            </div>
          )}

          {/* Full Name field */}
          <div className="flex flex-col gap-1.5" id="input-group-fullname">
            <label className="text-xs text-gray-300 uppercase font-black flex items-center gap-1">
              <Check size={12} className="text-[#00A550]" />
              {isWorkerForm ? t.fullName : (language === 'rw' ? 'Izina ry\'Umukoresha/Ikigo' : 'Full Name or Business Name')}
            </label>
            <input 
              type="text" 
              placeholder={isWorkerForm ? "e.g. Jean Bosco Nsengiyumva" : "e.g. Alphonse Mukabazi or Kigali Serena Hotel"} 
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full border border-white/15 p-3 rounded-xl text-xs uppercase bg-black text-white font-bold outline-none focus:border-[#00A550] focus:ring-1 focus:ring-[#00A550]"
              id="field-fullname"
              required
            />
          </div>

          {/* Phone Field with OTP trigger */}
          <div className="flex flex-col gap-1.5" id="input-group-phone">
            <label className="text-xs text-gray-300 uppercase font-black flex justify-between items-center">
              <span className="flex items-center gap-1">
                <Check size={12} className="text-[#00A550]" /> {t.phone}
              </span>
              {isPhoneVerified && (
                <span className="text-[10px] text-[#00A550] bg-[#00A550]/10 border border-[#00A550]/30 px-2 py-0.5 rounded flex items-center gap-1">
                  <ShieldCheck size={10} /> Verified Connection
                </span>
              )}
            </label>
            <div className="flex gap-2" id="phone-send-otp-row">
              <input 
                type="tel" 
                placeholder="+250 788 000 000" 
                value={phoneNumber}
                disabled={isPhoneVerified}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="flex-1 border border-white/15 p-3 rounded-xl text-xs uppercase bg-black text-white font-bold outline-none disabled:bg-white/5 disabled:border-white/10 disabled:text-gray-500"
                id="field-phone"
                required
              />
              {!isPhoneVerified && (
                <button 
                  type="button" 
                  onClick={handleSendOtp}
                  className="bg-[#00A550] text-black hover:bg-emerald-600 border border-transparent px-4 rounded-xl text-xs uppercase font-extrabold cursor-pointer transition-colors"
                  id="btn-send-otp"
                >
                  Send OTP 💬
                </button>
              )}
            </div>
            
            {/* OTP input reveal block */}
            {otpSent && !isPhoneVerified && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2.5 p-3 rounded-xl bg-[#00A550]/5 border border-[#00A550]/30 flex flex-col gap-2"
                id="otp-verify-subcard"
              >
                <div className="text-[10px] text-emerald-400 uppercase font-bold">
                  {language === 'rw' ? 'Kwemereza OTP y\'ubutumwa:' : 'Verify Mobile OTP Code:'}
                </div>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="Enter 4-digit code" 
                    value={otpInput}
                    onChange={(e) => setOtpInput(e.target.value)}
                    maxLength={4}
                    className="flex-1 border border-[#00A550] p-2.5 rounded-lg text-center font-bold text-sm tracking-widest text-white bg-black outline-none"
                    id="field-otp-input"
                  />
                  <button 
                    type="button" 
                    onClick={handleVerifyOtp}
                    className="bg-[#00A550] text-black px-4 py-2.5 rounded-lg text-xs uppercase font-black cursor-pointer"
                    id="btn-verify-otp-submit"
                  >
                    Confirm ✅
                  </button>
                </div>
                {otpError && (
                  <p className="text-[10px] text-red-400 font-bold uppercase">⚠️ Wrong code. Check SMS toast popup alert!</p>
                )}
              </motion.div>
            )}
          </div>

          {/* National ID (Optional for workers) */}
          {isWorkerForm && (
            <div className="flex flex-col gap-1.5" id="input-group-nationalid">
              <label className="text-xs text-gray-300 uppercase font-black flex items-center gap-1">
                <Check size={12} className="text-gray-400" />
                {t.nationalId}
              </label>
              <input 
                type="text" 
                maxLength={16}
                placeholder="1199xxxxxxxxxxxxx (16 digits)" 
                value={nationalId}
                onChange={(e) => setNationalId(e.target.value.replace(/\D/g, ''))}
                className="w-full border border-white/15 p-3 rounded-xl text-xs uppercase bg-black text-white font-bold outline-none"
                id="field-nationalid"
              />
            </div>
          )}

          {/* Location Information Dropdown Blocks (Province -> District -> Sector -> Cell -> Village text) */}
          <div className="border border-white/10 rounded-2xl p-4 bg-[#0a0a0a] flex flex-col gap-4 text-left" id="location-picker-block">
            <span className="text-[11px] font-black uppercase text-[#00A550] flex items-center gap-1 tracking-wider">
              <MapPin size={12} /> {language === 'rw' ? 'Aho Uri mu Rwanda (Administrative Location)' : 'Registered Rwandan Location'}
            </span>

            {/* 1. Province Selector */}
            <div className="flex flex-col gap-1" id="select-group-province">
              <label className="text-[10px] uppercase font-black text-gray-400">1. {t.province}</label>
              <select 
                value={selectedProvince}
                onChange={(e) => setSelectedProvince(e.target.value)}
                className="w-full border border-white/15 p-2.5 rounded-xl text-xs bg-black text-white font-bold uppercase cursor-pointer"
                id="select-province"
                required
              >
                <option value="">-- Choose Province --</option>
                {PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>

            {/* 2. District Selector */}
            <div className="flex flex-col gap-1" id="select-group-district">
              <label className="text-[10px] uppercase font-black text-gray-400">2. {t.district}</label>
              <select 
                value={selectedDistrict}
                disabled={!selectedProvince}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="w-full border border-white/15 p-2.5 rounded-xl text-xs bg-black text-white font-bold uppercase disabled:bg-white/5 disabled:border-white/5 disabled:text-gray-600 cursor-pointer"
                id="select-district"
                required
              >
                <option value="">-- Choose District --</option>
                {districtList.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>

            {/* 3. Sector Selector */}
            <div className="flex flex-col gap-1" id="select-group-sector">
              <label className="text-[10px] uppercase font-black text-gray-400">3. {t.sector}</label>
              <select 
                value={selectedSector}
                disabled={!selectedDistrict}
                onChange={(e) => setSelectedSector(e.target.value)}
                className="w-full border border-white/15 p-2.5 rounded-xl text-xs bg-black text-white font-bold uppercase disabled:bg-white/5 disabled:border-white/5 disabled:text-gray-600 cursor-pointer"
                id="select-sector"
                required
              >
                <option value="">-- Choose Sector --</option>
                {sectorList.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            {/* 4. Cell Selector */}
            <div className="flex flex-col gap-1" id="select-group-cell">
              <label className="text-[10px] uppercase font-black text-gray-400">4. {t.cell}</label>
              <select 
                value={selectedCell}
                disabled={!selectedSector}
                onChange={(e) => setSelectedCell(e.target.value)}
                className="w-full border border-white/15 p-2.5 rounded-xl text-xs bg-black text-white font-bold uppercase disabled:bg-white/5 disabled:border-white/5 disabled:text-gray-600 cursor-pointer"
                id="select-cell"
                required
              >
                <option value="">-- Choose Cell --</option>
                {cellList.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            {/* 5. Village Input */}
            <div className="flex flex-col gap-1" id="select-group-village">
              <label className="text-[10px] uppercase font-black text-gray-400">5. {t.village} *</label>
              <input 
                type="text" 
                placeholder={language === 'rw' ? "Yandika akazu cyangwa umudugudu aha..." : "Type Village or street location manually..."}
                value={village}
                disabled={!selectedCell}
                onChange={(e) => setVillage(e.target.value)}
                className="w-full border border-white/15 p-2.5 rounded-xl text-xs bg-black text-white font-bold uppercase disabled:bg-white/5 disabled:border-white/10 disabled:text-gray-600 outline-none"
                id="select-village"
                required
              />
            </div>
          </div>

          {/* Job-Seeker-Specific Skill Details */}
          {isWorkerForm && (
            <div className="border border-white/10 rounded-2xl p-4 bg-[#0a0a0a] flex flex-col gap-4 text-left" id="worker-skills-card">
              <span className="text-[11px] font-black uppercase text-[#00A550] flex items-center gap-1 tracking-wider">
                <Briefcase size={12} /> {language === 'rw' ? 'Ibyerekeye Umwuga Wawe' : 'Your Professional Trade Details'}
              </span>

              {/* Skill dropdown */}
              <div className="flex flex-col gap-1" id="skill-group-category">
                <label className="text-[10px] uppercase font-black text-gray-400">{t.skillCategory}</label>
                <select 
                  value={selectedSkill}
                  onChange={(e) => setSelectedSkill(e.target.value)}
                  className="w-full border border-white/15 p-2.5 rounded-xl text-xs bg-black text-white font-bold uppercase cursor-pointer"
                  id="select-skill"
                  required
                >
                  <option value="">-- Choose Skill Category --</option>
                  {SKILL_CATEGORIES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              {/* Experience dropdown */}
              <div className="flex flex-col gap-1" id="skill-group-exp">
                <label className="text-[10px] uppercase font-black text-gray-400">{t.expLevel}</label>
                <select 
                  value={selectedExperience}
                  onChange={(e) => setSelectedExperience(e.target.value as any)}
                  className="w-full border border-white/15 p-2.5 rounded-xl text-xs bg-black text-white font-bold uppercase cursor-pointer"
                  id="select-experience"
                  required
                >
                  <option value="Beginner">{t.beginner}</option>
                  <option value="Intermediate">{t.intermediate}</option>
                  <option value="Expert">{t.expert}</option>
                </select>
              </div>
            </div>
          )}

          {/* Employer-Specific Demands */}
          {!isWorkerForm && (
            <div className="border border-white/10 rounded-2xl p-4 bg-[#0a0a0a] flex flex-col gap-4 text-left" id="employer-demand-card">
              <span className="text-[11px] font-black uppercase text-emerald-400 flex items-center gap-1 tracking-wider">
                <Briefcase size={12} /> {language === 'rw' ? 'Ibyerekeye umukozi ukeneye' : 'Hiring Demands'}
              </span>

              {/* Skill and Duty categories needed */}
              <div className="flex flex-col gap-1" id="demand-group-skill">
                <label className="text-[10px] uppercase font-black text-gray-400">{language === 'rw' ? 'Ubwoko bw\'Umukoziukeneye' : 'Type of Worker Needed'}</label>
                <select 
                  value={selectedSkill}
                  onChange={(e) => setSelectedSkill(e.target.value)}
                  className="w-full border border-white/15 p-2.5 rounded-xl text-xs bg-black text-white font-bold uppercase cursor-pointer"
                  id="select-employer-skill"
                  required
                >
                  <option value="">-- Choose Trade Category --</option>
                  {SKILL_CATEGORIES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              {/* Duration needed */}
              <div className="flex flex-col gap-1" id="demand-group-duration">
                <label className="text-[10px] uppercase font-black text-gray-400">{language === 'rw' ? 'Igihe Akazi kazamara' : 'Duration of Work Needed'}</label>
                <select 
                  value={selectedDuration}
                  onChange={(e) => setSelectedDuration(e.target.value)}
                  className="w-full border border-white/15 p-2.5 rounded-xl text-xs bg-black text-white font-bold uppercase cursor-pointer"
                  id="select-employer-duration"
                  required
                >
                  <option value="">-- Choose Engagement Period --</option>
                  {WORK_DURATIONS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
            </div>
          )}

          {/* Register Submit Button */}
          <button 
            type="submit" 
            className="w-full bg-[#00A550] hover:bg-emerald-600 border border-transparent text-[#000000] p-4 rounded-xl text-xs tracking-wider uppercase font-black cursor-pointer transition shadow-[4px_4px_0px_0px_rgba(255,255,255,0.05)] active:scale-95"
            id="btn-submit-registration"
          >
            {t.submit} 🚀
          </button>
        </form>
      </div>
    </div>
  );
};
