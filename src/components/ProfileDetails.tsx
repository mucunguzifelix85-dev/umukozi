import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TRANSLATIONS } from '../data/mockData';
import { PaymentDialogue } from './PaymentDialogue';
import { 
  ArrowLeft, Star, Phone, MessageSquare, AlertTriangle, ShieldCheck, 
  MapPin, Sparkles, Building, KeyRound, MessageCircle, Ban, Heart 
} from 'lucide-react';

export const ProfileDetails: React.FC = () => {
  const { 
    selectedWorkerId, 
    setSelectedWorkerId, 
    workers, 
    currentUser, 
    currentUserType, 
    blockUser, 
    submitReport, 
    addReviewToWorker, 
    language 
  } = useApp();

  const t = TRANSLATIONS[language];

  // Report Modal state
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportSubmitted, setReportSubmitted] = useState(false);

  // New Review state
  const [userRating, setUserRating] = useState(5);
  const [userComment, setUserComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  // Payment portal state
  const [showPaymentGate, setShowPaymentGate] = useState(false);

  // Find worker object
  const workerObj = workers.find(w => w.id === selectedWorkerId);

  if (!workerObj) {
    return (
      <div className="py-20 text-center uppercase" id="profile-notfound">
        <AlertTriangle className="mx-auto text-red-500 mb-2" />
        Worker profile not found.
      </div>
    );
  }

  // Check if contact info is revealed
  const isUnlockedLocal = () => {
    // 1. Admin bypass
    if (currentUserType === 'admin') return true;
    
    // 2. Owner bypass (if worker views themselves)
    if (currentUser && currentUser.id === workerObj.id) return true;

    // 3. Guest bypass (not unlocked unless they register and pay)
    if (!currentUser || currentUserType !== 'employer') return false;

    // 4. Employer unlocked list
    const emp = currentUser as any;
    return emp.unlockedWorkers && emp.unlockedWorkers.includes(workerObj.id);
  };

  const isUnlocked = isUnlockedLocal();

  const handleRevealContactClick = () => {
    if (!currentUser) {
      alert(t.notLoggedIn);
      return;
    }
    setShowPaymentGate(true);
  };

  const handlePaymentSuccess = () => {
    setShowPaymentGate(false);
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userComment.trim()) {
      alert(language === 'rw' ? 'Andika ubutumwa bw\'icyifuzo mu sanduku!' : 'Please describe your review feedback!');
      return;
    }
    addReviewToWorker(workerObj.id, userRating, userComment);
    setUserComment('');
    setReviewSubmitted(true);
  };

  const handleAddReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportReason.trim()) {
      alert(language === 'rw' ? 'Nyamuneka andika icyatumye atangwa raporo!' : 'Please type your regulatory report reason!');
      return;
    }
    submitReport(workerObj.id, reportReason);
    setReportReason('');
    setReportSubmitted(true);
    setTimeout(() => {
      setShowReportModal(false);
      setReportSubmitted(false);
    }, 2500);
  };

  const handleBlockClick = () => {
    const confirmBlock = window.confirm(
      language === 'rw' 
        ? `Urareba neza ko wifuza kuburoka uyu muntu: ${workerObj.fullName}?` 
        : `Are you sure you want to block and black-list ${workerObj.fullName}?`
    );
    if (confirmBlock) {
      blockUser(workerObj.id);
      setSelectedWorkerId(null);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-6 text-left" id="profile-detailed-screen">
      
      {/* 500 RWF PAYMENT POPUP CONTAINER */}
      {showPaymentGate && (
        <PaymentDialogue 
          amount={500}
          description={`Unlocked contact info for specialist worker ${workerObj.fullName}`}
          workerIdToUnlock={workerObj.id}
          onSuccess={handlePaymentSuccess}
          onCancel={() => setShowPaymentGate(false)}
        />
      )}

      {/* Back Header Nav */}
      <button
        onClick={() => setSelectedWorkerId(null)}
        className="mb-6 border border-white/10 bg-[#111111] hover:bg-neutral-800 px-4 py-2 rounded-xl text-xs text-white uppercase font-extrabold flex items-center gap-1.5 cursor-pointer shadow-sm transition-colors"
        id="btn-back-to-search"
      >
        <ArrowLeft size={16} />
        {language === 'rw' ? 'Subira Inyuma' : 'Back to Listings'}
      </button>

      {/* Profile summary card */}
      <div className="bg-[#111111] border border-white/10 rounded-3xl p-6 shadow-2xl relative overflow-hidden" id="profile-main-card">
        
        {/* Ambient top strip and premium banner */}
        <div className={`absolute top-0 left-0 right-0 h-2.5 ${workerObj.isPremium ? 'bg-[#00A550]' : 'bg-black'}`} id="profile-accent-header"></div>
        {workerObj.isPremium && (
          <div className="bg-[#00A550]/10 border border-[#00A550]/20 p-2 text-[10px] text-emerald-400 rounded-lg inline-flex items-center gap-1.5 font-bold uppercase mt-1 mb-4 animate-pulse" id="badge-boost-indicator">
            <Sparkles size={11} className="text-[#00A550]" /> Standard Premium Boost Active
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-6 items-start mt-2" id="profile-base-block">
          {/* Picture */}
          <img 
            src={workerObj.photoUrl} 
            alt={workerObj.fullName} 
            className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl border border-white/15 object-cover bg-black shadow-md transform hover:scale-102 transition-transform"
            referrerPolicy="no-referrer"
            id="profile-big-picture"
          />

          {/* Descriptive labels */}
          <div className="flex-1 flex flex-col gap-1.5" id="profile-detailed-text">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-black uppercase text-white">
                {workerObj.fullName}
              </h1>
              {workerObj.isVerified && (
                <span className="bg-[#00A550]/15 text-[#00A550] text-[9px] uppercase px-2.5 py-0.5 rounded-full border border-[#00A550]/25 flex items-center gap-1 font-black">
                  <ShieldCheck size={12} /> ID Verified
                </span>
              )}
            </div>

            <p className="text-xs text-[#00A550] uppercase tracking-wider font-extrabold flex items-center gap-1">
              🔧 Speciality: <span className="text-white font-black">{workerObj.category}</span>
            </p>

            {/* Micro layout stars */}
            <div className="flex items-center gap-2 mt-1">
              <div className="flex text-[#FFCC00]">
                <Star size={14} fill="currentColor" />
              </div>
              <span className="text-xs text-white font-extrabold">{workerObj.rating} / 5.0</span>
              <span className="text-xs text-gray-400 font-bold uppercase">({workerObj.reviews.length} user reviews)</span>
            </div>

            {/* Profile specifications */}
            <div className="grid grid-cols-2 gap-3 mt-4" id="worker-profile-specifications">
              <div className="bg-black p-2.5 rounded-xl border border-dashed border-white/10">
                <span className="text-[9px] text-gray-400 uppercase font-black">Grade Range</span>
                <p className="text-xs text-white uppercase font-black">{workerObj.experience} Level</p>
              </div>
              <div className="bg-black p-2.5 rounded-xl border border-dashed border-white/10">
                <span className="text-[9px] text-gray-400 uppercase font-black">Activity Views</span>
                <p className="text-xs text-white font-black">{workerObj.viewsCount} Queries</p>
              </div>
            </div>
          </div>
        </div>

        {/* Location list */}
        <div className="border-t border-dashed border-white/10 mt-6 pt-5 flex flex-col gap-2 text-xs" id="profile-region-list">
          <span className="text-[10px] text-gray-400 uppercase tracking-widest font-black">Registered Administrative Jurisdiction</span>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center uppercase" id="administrative-grid">
            <div className="bg-[#1a1a1a] border border-white/5 p-2 rounded-xl">
              <span className="text-[8px] text-gray-400 font-black">Province</span>
              <p className="text-[9px] text-white font-black line-clamp-1">{workerObj.location.province}</p>
            </div>
            <div className="bg-[#1a1a1a] border border-white/5 p-2 rounded-xl">
              <span className="text-[8px] text-emerald-400 font-black">District</span>
              <p className="text-[9px] text-emerald-300 font-black line-clamp-1">{workerObj.location.district}</p>
            </div>
            <div className="bg-[#00A550]/5 border border-[#00A550]/10 p-2 rounded-xl">
              <span className="text-[8px] text-emerald-400 font-black">Sector</span>
              <p className="text-[9px] text-[#00A550] font-black line-clamp-1">{workerObj.location.sector}</p>
            </div>
            <div className="bg-[#00A550] text-[#000000] p-2 rounded-xl">
              <span className="text-[8px] text-black font-black">Cell</span>
              <p className="text-[9px] text-black font-black line-clamp-1">{workerObj.location.cell}</p>
            </div>
          </div>

          <p className="text-[10px] text-gray-300 font-bold uppercase mt-2 bg-black p-3 rounded-lg border border-white/10">
            📍 Neighborhood / Umudugudu: <span className="text-white underline font-black">{workerObj.location.village}</span>
          </p>
        </div>

        {/* CONTACT REVEAL OR LOCK SECTION! MUST SECURE AT 500 RWF */}
        <div className="border-t border-white/10 mt-6 pt-6" id="profile-contact-lock-row">
          {isUnlocked ? (
            <div className="bg-[#00A550]/5 border border-[#00A550]/25 rounded-2xl p-5 flex flex-col gap-4 text-white" id="revealed-contact-block">
              <div className="flex items-center gap-2 text-emerald-400 uppercase text-xs" id="contact-credentials-verified">
                <KeyRound size={16} className="text-[#00A550]" />
                {language === 'rw' ? 'WEMEREWE KUREBA AMIKORERE' : 'Credentials Unlocked'}
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3" id="worker-actions-revealed">
                {/* 1. Direct cellular phone */}
                <a 
                  href={`tel:${workerObj.phoneNumber}`}
                  className="flex-1 bg-black text-[#00A550] border border-[#00A550]/30 hover:bg-[#002D15] hover:text-white p-4 rounded-xl font-bold flex items-center justify-center gap-2 uppercase tracking-wide cursor-pointer transition text-center"
                  id="link-phone-call"
                >
                  <Phone size={16} />
                  Call {workerObj.phoneNumber}
                </a>

                {/* 2. Direct whatsapp portal */}
                <a 
                  href={`https://wa.me/${workerObj.phoneNumber.replace(/[\s+]/g, '')}`}
                  target="_blank" 
                  rel="noreferrer"
                  className="flex-1 bg-[#25D366]/10 text-[#25D366] border border-[#25D366]/30 hover:bg-[#25D366]/20 p-4 rounded-xl font-bold flex items-center justify-center gap-2 uppercase tracking-wide cursor-pointer transition text-center"
                  id="link-whatsapp-chat"
                >
                  <MessageCircle size={16} />
                  Chat via Whatsapp
                </a>
              </div>
            </div>
          ) : (
            <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-5 text-center flex flex-col items-center gap-4 animate-fade-in" id="locked-contact-block">
              <div className="bg-amber-500/10 p-2.5 rounded-full text-amber-400">
                <KeyRound size={24} />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs uppercase text-amber-450 font-extrabold tracking-wide">
                  Contact Information Secured 🔒
                </span>
                <p className="text-[10px] text-gray-400 uppercase max-w-sm font-bold">
                  {language === 'rw' 
                    ? 'Kugira ngo ushobore kureba nomero cyangwa WhatsApp y’Uyu mukozi, wishyure amafaranga 500 RWF via MTN/Airtel.' 
                    : 'To view this worker\'s phone and start messaging, pay a one-time fee of 500 RWF.'}
                </p>
              </div>
              <button 
                onClick={handleRevealContactClick}
                className="bg-black text-[#00A550] border border-[#00A550]/50 hover:bg-[#111111] px-6 py-3 rounded-xl text-xs uppercase font-black cursor-pointer transition active:scale-95 text-center"
                id="btn-trigger-payment-flow"
              >
                Reveal Phone Number (500 RWF) 💳
              </button>
            </div>
          )}
        </div>

        {/* Safety actions: report, block, suspension flag triggers */}
        <div className="border-t border-dashed border-white/10 mt-6 pt-5 flex justify-between gap-2 flex-wrap" id="safety-action-row">
          <button 
            type="button"
            onClick={() => setShowReportModal(true)}
            className="text-[10px] text-red-400 hover:bg-neutral-900 border border-red-550/20 px-3 py-1.5 rounded-lg font-black uppercase flex items-center gap-1.5 cursor-pointer"
            id="btn-report-profile"
          >
            <AlertTriangle size={12} />
            {t.reportUser}
          </button>

          <button 
            type="button"
            onClick={handleBlockClick}
            className="text-[10px] text-gray-400 hover:bg-[#111111] border border-white/10 px-3 py-1.5 rounded-lg font-black uppercase flex items-center gap-1.5 cursor-pointer"
            id="btn-block-profile"
          >
            <Ban size={12} />
            {t.blockUser}
          </button>
        </div>
      </div>

      {/* REPORT SUBMISSION DRAWER MODAL Overlay */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-xs flex items-center justify-center p-4 z-50" id="report-modal-overlay">
          <div className="w-full max-w-md bg-[#111111] border border-white/15 rounded-3xl p-6 shadow-2xl flex flex-col text-left text-white" id="report-modal-card">
            <h3 className="text-sm font-black uppercase text-red-450 mb-1 flex items-center gap-1.5">
              <AlertTriangle size={16} /> File Moderate Report
            </h3>
            <p className="text-[10px] text-gray-400 uppercase font-black mb-4">
              Suspicion against worker: {workerObj.fullName}
            </p>

            {reportSubmitted ? (
              <div className="py-6 text-center text-xs text-red-600 font-extrabold uppercase animate-pulse flex flex-col gap-2">
                <span>✅ Report Submitted!</span>
                <span className="text-[9px] text-gray-400">Moderators will audit this profile within 2-4 business hours.</span>
              </div>
            ) : (
              <form onSubmit={handleAddReport} className="flex flex-col gap-4" id="form-submit-report">
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] text-gray-300 uppercase font-bold">Reason for reporting</label>
                  <textarea 
                    rows={4} 
                    placeholder="Describe specific safety risks, unverified credentials, non-attendance of scheduled shift, or other suspicious activity." 
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                    className="w-full border border-white/15 p-3 rounded-xl text-xs bg-black text-white font-bold outline-none uppercase placeholder:text-gray-650 focus:border-[#00a550]"
                    id="field-report-reason"
                    required
                  />
                </div>
                <div className="flex gap-2" id="report-modal-actions">
                  <button 
                    type="button" 
                    onClick={() => setShowReportModal(false)}
                    className="flex-1 bg-black border border-white/10 text-white p-3 rounded-xl text-xs font-black uppercase cursor-pointer hover:bg-neutral-900"
                    id="btn-report-cancel"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="flex-1 bg-red-600 hover:bg-red-750 text-white p-3 rounded-xl text-xs font-black uppercase cursor-pointer"
                    id="btn-report-submit"
                  >
                    Submit Report 🚨
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* REVIEWS SEGMENT */}
      <section className="bg-[#111111] border border-white/10 rounded-3xl p-6 mt-6 shadow-2xl text-left" id="profile-reviews-segment">
        <h3 className="text-sm font-black uppercase text-white mb-4 pb-2 border-b border-white/5 flex items-center gap-1.5">
          <MessageCircle size={16} className="text-[#00A550]" />
          {t.ratingReviews}
        </h3>

        {/* List reviews */}
        <div className="flex flex-col gap-4" id="reviews-feed">
          {workerObj.reviews.length === 0 ? (
            <p className="text-[10.5px] text-gray-400 uppercase italic py-4">
              No hiring assessments have been logged yet for this worker. Be the first to hire them and leave ratings!
            </p>
          ) : (
            workerObj.reviews.map((rev) => (
              <div key={rev.id} className="border-b border-white/5 pb-3 flex flex-col gap-1.5 text-xs text-left" id={`review-item-${rev.id}`}>
                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-white font-black uppercase flex items-center gap-1.5 font-sans">
                    <Building size={12} className="text-gray-400" />
                    {rev.reviewerName}
                  </span>
                  <span className="text-gray-500 font-bold">{rev.date}</span>
                </div>
                <div className="flex text-[#FFCC00] gap-0.5" id={`review-stars-${rev.id}`}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star 
                      key={i} 
                      size={10} 
                      fill={i < Math.floor(rev.rating) ? 'currentColor' : 'none'} 
                      className={i < Math.floor(rev.rating) ? 'text-[#FFCC00]' : 'text-gray-700'}
                    />
                  ))}
                </div>
                <p className="text-[11px] text-gray-300 font-bold uppercase italic leading-normal font-sans">
                  "{rev.comment}"
                </p>
              </div>
            ))
          )}
        </div>

        {/* Post review block */}
        <div className="border-t border-dashed border-white/10 mt-6 pt-5" id="profile-form-reviews">
          <span className="text-[10px] text-gray-400 uppercase tracking-widest font-black">
            {t.leaveReview}
          </span>
          
          {reviewSubmitted ? (
            <div className="bg-[#00a550]/10 border border-[#00a550]/20 text-[#00A550] text-xs p-4 rounded-xl text-center font-black uppercase mt-3">
              🎉 Review successfully added! Refreshing profile index.
            </div>
          ) : (
            <form onSubmit={handleAddReview} className="flex flex-col gap-4 mt-3.5" id="form-submit-review">
              <div className="flex items-center gap-2.5" id="form-ratings-star-row">
                <span className="text-[10px] text-gray-300 uppercase font-black">{t.yourRating}:</span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setUserRating(star)}
                      className="text-[#FFCC00] hover:scale-115 transition-transform cursor-pointer"
                      id={`btn-star-picker-${star}`}
                    >
                      <Star size={18} fill={star <= userRating ? 'currentColor' : 'none'} />
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-1.5" id="form-comment-textbox-group">
                <textarea 
                  rows={3} 
                  placeholder={t.reviewCommentPlaceholder} 
                  value={userComment}
                  onChange={(e) => setUserComment(e.target.value)}
                  className="w-full border border-white/15 p-3 rounded-xl text-xs bg-black text-white font-bold outline-none uppercase placeholder:text-gray-655 focus:border-[#00a550]"
                  id="field-review-comment"
                  required
                />
              </div>

              <button 
                type="submit" 
                className="bg-[#00a550] hover:bg-[#008f43] text-black p-3 rounded-xl text-[10px] uppercase font-black tracking-wide cursor-pointer text-center font-sans"
                id="btn-review-submit"
              >
                Submit Feedback Review ⭐
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
};
