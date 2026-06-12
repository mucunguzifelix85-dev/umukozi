import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TRANSLATIONS, SKILL_CATEGORIES } from '../data/mockData';
import { Logo } from './Logo';
import { SearchFilters } from './SearchFilters';
import { ProfileDetails } from './ProfileDetails';
import { PaymentDialogue } from './PaymentDialogue';
import { 
  Home, Search, MessageSquare, Bell, User, Star, MapPin, 
  Sparkles, ShieldAlert, FileText, Send, CheckCircle, Smartphone 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const Dashboard: React.FC = () => {
  const { 
    language, 
    currentUser, 
    currentUserType, 
    currentTab, 
    setCurrentTab, 
    selectedWorkerId, 
    setSelectedWorkerId,
    workers,
    jobs,
    notifications,
    setNotifications,
    transactions,
    processPayment
  } = useApp();

  const t = TRANSLATIONS[language];

  // Quick message mockup state
  const [selectedChatUser, setSelectedChatUser] = useState<string | null>(null);
  const [chatInput, setChatInput] = useState('');
  const [typedMessages, setTypedMessages] = useState<Record<string, { sender: 'me' | 'them', text: string, time: string }[]>>({
    'W1': [
      { sender: 'them', text: 'Muraho! I saw you are looking for a plumber. I am free tomorrow.', time: '11:15' },
      { sender: 'me', text: 'Yes, we have a kitchen pipe blockage in Kimironko. What is your daily rate?', time: '11:18' },
      { sender: 'them', text: 'Regular rate is 10,000 RWF. But we can agree depending on details.', time: '11:20' }
    ]
  });

  // Self premium boosting state (for workers boosting their own profile)
  const [showSelfBoostGate, setShowSelfBoostGate] = useState(false);

  // Unread notifications count
  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleQuickSearchShortcut = (skill: string) => {
    setSelectedWorkerId(null);
    setCurrentTab('search');
    // Predefined shortcuts are captured via the Category dropdown in search filter automatically
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !selectedChatUser) return;

    const currentChat = typedMessages[selectedChatUser] || [];
    const updatedChat = [
      ...currentChat,
      { sender: 'me', text: chatInput, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
    ];

    setTypedMessages(prev => ({
      ...prev,
      [selectedChatUser]: updatedChat
    }));
    setChatInput('');

    // Simulate instant automated specialist response
    setTimeout(() => {
      const activeWorker = workers.find(w => w.id === selectedChatUser);
      const name = activeWorker ? activeWorker.fullName : 'Specialist';
      setTypedMessages(prev => ({
        ...prev,
        [selectedChatUser]: [
          ...(prev[selectedChatUser] || []),
          { sender: 'them', text: `Yes, received! Please dial my phone to discuss directly so I can start traveling.`, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
        ]
      }));
    }, 1500);
  };

  const activeWorkerName = () => {
    if (selectedChatUser) {
      return workers.find(w => w.id === selectedChatUser)?.fullName || 'Specialist';
    }
    return '';
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-between font-sans pb-24" id="dashboard-shell">
      
      {/* 2,000 RWF SELF PROMOTING PREMIUM GATEWAY POPUP (Workers self boosting) */}
      {showSelfBoostGate && (
        <PaymentDialogue
          amount={2000}
          description="Worker Profile Boosting Premium Membership (30 Days)"
          workerIdToUnlock={currentUser?.id}
          onSuccess={() => {
            setShowSelfBoostGate(false);
            if (currentUser) {
              const updated = { ...currentUser, isPremium: true } as any;
              // Trigger state changes
              workers.forEach(w => {
                if (w.id === currentUser.id) {
                  w.isPremium = true;
                }
              });
            }
          }}
          onCancel={() => setShowSelfBoostGate(false)}
        />
      )}

      {/* Primary Header */}
      <header className="sticky top-0 bg-[#0a0a0a] border-b border-white/10 py-3 px-6 z-20 flex justify-between items-center shadow-md" id="app-primary-navbar">
        <Logo size="sm" showTagline={false} />
        
        <div className="flex items-center gap-3" id="app-user-micro-header">
          {currentUser ? (
            <div className="flex items-center gap-2 text-right" id="user-pill">
              <div className="flex flex-col text-xs uppercase" id="user-credentials-block">
                <span className="text-white font-black leading-tight line-clamp-1">{currentUser.fullName}</span>
                <span className="text-[#00A550] font-black text-[9px]">
                  {currentUserType === 'worker' ? 'Verified Worker' : 'Verified Employer'}
                </span>
              </div>
              <img 
                src={(currentUser as any).photoUrl || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100'} 
                alt="" 
                className="w-8 h-8 rounded-full border border-white/15 object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          ) : (
            <span className="text-[10px] bg-black/5 text-gray-300 px-3 py-1.5 rounded-full border border-white/10 uppercase">
              Guest Mode explorer
            </span>
          )}
        </div>
      </header>

      {/* Main viewport Container */}
      <div className="flex-1 w-full max-w-7xl mx-auto py-6" id="dashboard-main-viewport">
        
        {/* If a worker detail profile is actively selected inside the Search Tab view, render that view over standard search lists! */}
        {selectedWorkerId ? (
          <ProfileDetails />
        ) : (
          <div>
            {/* VIEW A: HOME DASHBOARD */}
            {currentTab === 'home' && (
              <div className="px-4 flex flex-col gap-6" id="view-dashboard-home">
                
                {/* Greeting banner */}
                <div className="bg-[#111111] text-white border border-white/10 rounded-3xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-left shadow-xl" id="hero-greeting-card">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-emerald-400 font-black uppercase tracking-wider">
                      U Rwanda Ruragana Imbere
                    </span>
                    <h2 className="text-lg md:text-2xl font-black mt-1 uppercase text-white">
                      {language === 'rw' 
                        ? `Muraho, ${currentUser ? currentUser.fullName : 'Muryango'}! Kaze Kuri Umukozi.` 
                        : `Muraho, ${currentUser ? currentUser.fullName : 'Guest'}! Welcome to Umukozi.`}
                    </h2>
                    <p className="text-xs text-gray-500 mt-2 font-bold uppercase leading-relaxed max-w-lg font-sans">
                      Connecting licensed laborers, builders, mechanics, drivers, or domestic assistants instantly with verified contractors throughout the territory of Rwanda.
                    </p>
                  </div>
                  
                  {currentUserType === 'worker' && !(currentUser as any).isPremium && (
                    <button 
                      onClick={() => setShowSelfBoostGate(true)}
                      className="bg-[#00A550] hover:bg-emerald-400 border border-transparent text-white px-4.5 py-3 rounded-xl text-xs font-black uppercase tracking-wide cursor-pointer flex items-center gap-1.5 shrink-0 transition"
                      id="btn-self-promo-boost"
                    >
                      <Sparkles size={14} /> Boost My Profile Now
                    </button>
                  )}
                </div>

                {/* Quick Category shortcuts */}
                <div className="text-left" id="quick-shortcuts">
                  <span className="text-[11px] text-gray-500 uppercase font-black tracking-widest block mb-3">
                    Fast Finder Specialties
                  </span>
                  
                  <div className="flex gap-2.5 overflow-x-auto pb-3 scroll-smooth no-scrollbar" id="quick-chips-row">
                    {SKILL_CATEGORIES.map((skill) => (
                      <button
                        key={skill}
                        onClick={() => handleQuickSearchShortcut(skill)}
                        className="bg-[#111111] border border-white/15 hover:border-[#00A550] px-4.5 py-2.5 rounded-xl text-xs font-black uppercase text-white cursor-pointer whitespace-nowrap scroll-snap-align-start shrink-0 select-none transition"
                        id={`shortcut-chip-${skill}`}
                      >
                        {skill}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Boosted Workers horizontale ribbon */}
                <div className="text-left" id="featured-carousel">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[11px] text-gray-500 uppercase font-black tracking-widest block">
                      {t.featuredWorkers}
                    </span>
                    <button 
                      onClick={() => setCurrentTab('search')} 
                      className="text-[10px] text-[#00A550] hover:underline font-black uppercase cursor-pointer"
                      id="btn-see-all-search"
                    >
                      See All
                    </button>
                  </div>

                  <div className="flex gap-4 overflow-x-auto pb-4" id="carousel-cards-offset">
                    {workers.filter(w => w.isPremium && !w.isSuspended).map((w) => (
                      <div 
                        key={w.id}
                        onClick={() => {
                          setSelectedWorkerId(w.id);
                          setCurrentTab('search');
                        }}
                        className="bg-[#111111] border border-[#00A550] rounded-2xl p-4.5 w-64 flex flex-col justify-between shrink-0 hover:scale-[1.01] transition cursor-pointer relative text-left shadow-[4px_4px_0px_0px_rgba(0,165,80,0.1)]"
                        id={`featured-card-${w.id}`}
                      >
                        <span className="absolute top-3.5 right-3.5 bg-black text-[#00A550] text-[8px] font-black uppercase px-2 py-0.5 rounded-sm flex items-center gap-1 border border-[#00A550]">
                          <Sparkles size={8} /> Boosted
                        </span>

                        <div className="flex gap-3 items-center">
                          <img src={w.photoUrl} alt="" className="w-11 h-11 rounded-full object-cover border border-[#00A550]/20" referrerPolicy="no-referrer" />
                          <div className="flex flex-col">
                            <span className="text-xs font-black uppercase text-white line-clamp-1">{w.fullName}</span>
                            <span className="text-[9px] text-[#00A550] font-bold uppercase tracking-wider">{w.category.split(' ')[0]}</span>
                          </div>
                        </div>

                        <div className="mt-4 border-t border-dashed border-white/10 pt-3 flex justify-between items-center text-[10px]">
                          <span className="text-gray-300 font-extrabold flex items-center gap-1">
                            <MapPin size={10} className="text-[#00A550]" /> {w.location.district}
                          </span>
                          <span className="text-white font-black flex items-center gap-1">
                            ⭐ {w.rating}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Two columns: Job matches list & Notifications */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" id="feed-grids">
                  
                  {/* Job offers */}
                  <div className="bg-[#111111] border border-white/10 rounded-3xl p-5 text-left flex flex-col gap-4" id="home-jobs-card">
                    <span className="text-[11px] text-gray-500 uppercase font-black tracking-widest pb-2 border-b border-white/10 block">
                      {t.recentJobs}
                    </span>

                    <div className="flex flex-col gap-3" id="home-jobs-list">
                      {jobs.map((job) => (
                        <div key={job.id} className="p-4 bg-black border border-white/10 rounded-2xl flex flex-col gap-2 relative hover:bg-black/5 transition" id={`job-item-${job.id}`}>
                          <div className="flex justify-between items-start flex-wrap gap-2 text-xs">
                            <div>
                              <span className="text-[9px] text-emerald-450 bg-[#00A550]/15 px-2 py-0.5 border border-[#00A550]/20 rounded uppercase font-black block w-fit mb-1">{job.category}</span>
                              <h4 className="text-xs font-black text-white uppercase leading-snug">{job.title}</h4>
                            </div>
                            <span className="text-[9px] text-[#00A550] font-black">{job.budget}</span>
                          </div>

                          <div className="text-[10px] text-gray-500 flex justify-between mt-2 pt-2 border-t border-dashed border-white/10 font-bold">
                            <span className="flex items-center gap-1 uppercase">
                              <MapPin size={10} className="text-[#00A550]" />
                              {job.location.district} › {job.location.sector}
                            </span>
                            <span>{job.duration}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Platforms announcements */}
                  <div className="bg-[#111111] border border-white/10 rounded-3xl p-5 text-left flex flex-col gap-4" id="home-announcements-card">
                    <span className="text-[11px] text-gray-500 uppercase font-black tracking-widest pb-2 border-b border-white/10 block">
                      🔔 Latest Announcements & Policy Updates
                    </span>

                    <div className="flex flex-col gap-3" id="announcement-list">
                      <div className="p-4 bg-[#00A550]/5 border border-[#00A550]/20 rounded-2xl flex flex-col gap-1.5" id="ann-1">
                        <span className="text-[8px] bg-[#00A550]/10 text-[#00A550] border border-[#00A550]/25 px-1.5 py-0.2 rounded w-fit uppercase font-bold">Official updates</span>
                        <h4 className="text-xs font-black text-white uppercase">UMUKOZI PLATFORM GO LIVE</h4>
                        <p className="text-[10.5px] text-gray-300 font-bold uppercase leading-relaxed mt-1">
                          We have officially upgraded the Rwanda match coordinates matching logic. Verify your indangamuntu to get a verified green badge!
                        </p>
                      </div>

                      <div className="p-4 bg-black border border-white/10 rounded-2xl flex flex-col gap-1.5" id="ann-2">
                        <span className="text-[8px] bg-black/5 text-gray-300 border border-white/10 px-1.5 py-0.2 rounded w-fit uppercase font-bold">Billing standards</span>
                        <h4 className="text-xs font-black text-white uppercase">Standardizing Service Tariffs</h4>
                        <p className="text-[10.5px] text-gray-300 font-bold uppercase leading-relaxed mt-1">
                          Remember that the matching portal operates flat 500 RWF for unlocking mobile phone contacts. Report anyone attempting to ask for unverified fees off-platform.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* VIEW B: ADVANCED SEARCH */}
            {currentTab === 'search' && (
              <SearchFilters />
            )}

            {/* VIEW C: MESSAGES MOCKUP */}
            {currentTab === 'messages' && (
              <div className="px-4 max-w-5xl mx-auto flex flex-col lg:flex-row border border-white/10 rounded-3xl bg-[#111111] overflow-hidden shadow-2xl text-left min-h-[500px]" id="view-dashboard-messages">
                
                {/* Conversations column */}
                <div className="lg:w-80 border-r border-white/10 flex flex-col shrink-0 bg-[#0c0c0c]" id="messages-sidebar">
                  <div className="p-4 border-b border-white/10 bg-black">
                    <span className="text-sm font-black uppercase text-white">Active Chats</span>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto" id="conversations-flow">
                    {/* Only show workers the employer has unlocked or general active mockup */}
                    {workers.slice(0, 3).map((worker) => (
                      <div
                        key={worker.id}
                        onClick={() => setSelectedChatUser(worker.id)}
                        className={`p-4 border-b border-white/5 cursor-pointer flex items-center gap-3.5 transition ${
                          selectedChatUser === worker.id ? 'bg-[#00A550]/10 text-white border-l-4 border-l-[#00A550]' : 'hover:bg-black/5 text-gray-500'
                        }`}
                        id={`chat-user-${worker.id}`}
                      >
                        <img src={worker.photoUrl} alt="" className="w-10 h-10 rounded-full object-cover border border-[#00A550]/35 hover:scale-105 transition-transform" referrerPolicy="no-referrer" />
                        <div className="flex-1 flex flex-col text-xs uppercase min-w-0">
                          <span className="font-black text-white truncate">{worker.fullName}</span>
                          <span className="text-[9px] text-[#00A550] truncate">{worker.category}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Chat content column */}
                <div className="flex-1 flex flex-col min-h-[500px] justify-between text-left" id="chat-contents">
                  {selectedChatUser ? (
                    <div className="flex flex-col h-full flex-1 justify-between" id="active-chat-wrapper">
                      {/* chat header */}
                      <div className="p-4 border-b border-white/10 bg-black flex items-center gap-3" id="chat-room-header">
                        <img 
                          src={workers.find(w => w.id === selectedChatUser)?.photoUrl} 
                          alt="" 
                          className="w-9 h-9 rounded-full object-cover border border-[#00A550]/20" 
                          referrerPolicy="no-referrer"
                        />
                        <div className="flex flex-col text-xs uppercase">
                          <span className="font-black text-white">{activeWorkerName()}</span>
                          <span className="text-[8px] text-emerald-400 block font-bold">SPECIALIST ONLINE NOW</span>
                        </div>
                      </div>

                      {/* messages logs */}
                      <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3 min-h-[300px] max-h-[350px]" id="chat-messages-scroll">
                        {(typedMessages[selectedChatUser] || []).map((msg, i) => (
                          <div 
                            key={i} 
                            className={`p-3 max-w-sm rounded-2xl text-xs uppercase ${
                              msg.sender === 'me' 
                                ? 'bg-black text-[#00A550] self-end border border-[#00A550]/55 shadow-sm rounded-tr-none' 
                                : 'bg-[#181818] text-white self-start border border-white/10 rounded-tl-none'
                            }`}
                            id={`msg-bubble-${i}`}
                          >
                            <p className="font-bold">{msg.text}</p>
                            <span className="text-[8px] text-gray-500 block text-right mt-1 font-bold">{msg.time}</span>
                          </div>
                        ))}
                      </div>

                      {/* message inputs */}
                      <form onSubmit={handleSendChat} className="p-4 border-t border-white/10 flex gap-2 bg-[#0a0a0a]" id="send-chat-form">
                        <input 
                          type="text"
                          placeholder="Andika ubutumwa hano (Type message)..."
                          value={chatInput}
                          onChange={(e) => setChatInput(e.target.value)}
                          className="flex-1 border border-white/15 p-3 rounded-xl text-xs bg-black text-white font-bold outline-none uppercase focus:border-[#00A550]"
                          id="chat-text-input"
                          required
                        />
                        <button 
                          type="submit" 
                          className="bg-[#00A550] hover:bg-emerald-600 border border-transparent text-white px-5 rounded-xl cursor-pointer font-black uppercase text-xs flex items-center justify-center gap-1"
                          id="btn-chat-send"
                        >
                          Send <Send size={14} />
                        </button>
                      </form>
                    </div>
                  ) : (
                    <div className="my-auto text-center px-6 py-20 flex flex-col items-center gap-2 text-gray-500" id="chat-instructions-block">
                      <MessageSquare size={44} className="text-[#00A550]/80 animate-pulse" />
                      <h3 className="text-sm font-black uppercase text-white">Specialist Chats</h3>
                      <p className="text-xs text-gray-500 uppercase max-w-xs mx-auto leading-relaxed">
                        Choose an unlocked worker specialist on the left sidebar to simulate and coordinate contract wage talks.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* VIEW D: NOTIFICATIONS CENTER */}
            {currentTab === 'notifications' && (
              <div className="px-4 max-w-3xl mx-auto flex flex-col gap-4 text-left" id="view-dashboard-notifications">
                <div className="flex justify-between items-center pb-2 border-b border-white/10 flex-wrap gap-2">
                  <h3 className="text-sm font-black uppercase text-white flex items-center gap-2">
                    <Bell className="text-[#00A550]" size={18} />
                    Rwandan match updates ({unreadCount} unread)
                  </h3>

                  {unreadCount > 0 && (
                    <button 
                      onClick={handleMarkAllNotificationsRead}
                      className="text-[10px] text-emerald-400 border border-emerald-500/30 bg-[#00A550]/10 hover:bg-[#00A550]/20 px-3 py-1 rounded font-black uppercase cursor-pointer"
                      id="btn-mark-all-read"
                    >
                      Mark All as Read ✅
                    </button>
                  )}
                </div>

                <div className="flex flex-col gap-3" id="notifications-stack">
                  {notifications.length === 0 ? (
                    <p className="text-xs text-gray-500 uppercase italic py-10 text-center">No alert flags have been triggered yet.</p>
                  ) : (
                    notifications.map((note) => (
                      <div 
                        key={note.id} 
                        className={`border p-4 rounded-2xl flex items-start gap-4 transition shadow-xs ${
                          note.read ? 'bg-[#111111] border-white/5 opacity-50' : 'bg-[#111111] border-white/15 shadow-xl'
                        }`}
                        id={`notification-card-${note.id}`}
                      >
                        <div className="bg-[#00A550]/10 p-2 rounded-lg text-[#00A550] self-start border border-[#00A550]/15">
                          <Bell size={16} />
                        </div>

                        <div className="flex-1">
                          <div className="flex justify-between items-center mb-1 text-[9px] text-gray-500">
                            <span className="font-black uppercase tracking-wider text-[#00A550]">{note.type} update</span>
                            <span>{note.timestamp}</span>
                          </div>
                          <h4 className="text-xs font-black text-white uppercase leading-snug">{note.title}</h4>
                          <p className="text-[11px] text-gray-300 mt-1 lowercase italic font-bold leading-normal">{note.body}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* VIEW E: USER PROFILE CENTER */}
            {currentTab === 'profile' && (
              <div className="px-4 max-w-3xl mx-auto flex flex-col gap-6 text-left" id="view-dashboard-profile">
                
                {currentUser ? (
                  <div className="bg-[#111111] border border-white/10 rounded-3xl p-6 shadow-2xl flex flex-col gap-6 animate-fade-in" id="user-profile-center-card">
                    {/* Top block */}
                    <div className="flex gap-4 items-center">
                      <img 
                        src={(currentUser as any).photoUrl || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150'} 
                        alt="" 
                        className="w-16 h-16 rounded-full object-cover border border-[#00A550]"
                        referrerPolicy="no-referrer"
                      />
                      <div className="flex flex-col text-xs uppercase text-left">
                        <span className="text-lg font-black text-white leading-tight">
                          {currentUser.fullName}
                        </span>
                        <span className="text-gray-500 font-bold font-sans tracking-wide mt-0.5">
                          Account: {currentUser.phoneNumber}
                        </span>
                        <span className="text-[#00A550] font-black uppercase text-[10px] mt-1 bg-[#00A550]/10 px-2 py-0.5 rounded border border-[#00A550]/20 w-fit">
                          {currentUserType} account verified status scale
                        </span>
                      </div>
                    </div>

                    {/* Role Specific Details */}
                    {currentUserType === 'worker' ? (
                      <div className="border-t border-dashed border-white/10 pt-5 flex flex-col gap-4 text-xs" id="worker-details-profile">
                        <div className="grid grid-cols-2 gap-3 uppercase">
                          <div className="bg-black border border-white/10 p-3 rounded-xl">
                            <span className="text-[8px] text-gray-500 font-black block">Specialty specialty</span>
                            <span className="text-xs text-white font-black">{(currentUser as any).category}</span>
                          </div>
                          <div className="bg-black border border-white/10 p-3 rounded-xl">
                            <span className="text-[8px] text-gray-500 font-black block">Experience Rank</span>
                            <span className="text-xs text-white font-black">{(currentUser as any).experience} Level</span>
                          </div>
                        </div>

                        {/* Premium Boost info */}
                        <div className="bg-[#00A550]/5 border border-[#00A550]/20 rounded-2xl p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mt-2" id="premium-boost-promo">
                          <div className="flex flex-col text-left">
                            <h4 className="text-xs font-black text-emerald-400 uppercase flex items-center gap-1">
                              <Sparkles size={14} className="text-[#00A550]" /> Profile Boosting Dashboard
                            </h4>
                            <p className="text-[10px] text-gray-300 uppercase mt-1 leading-normal font-bold">
                              Pay 2,000 RWF via Mobile Money to rank at the absolute top of search inputs and earn 5x more contracting client phone calls.
                            </p>
                          </div>

                          <button
                            onClick={() => setShowSelfBoostGate(true)}
                            className="bg-[#00a550] hover:bg-emerald-600 text-white px-4.5 py-3 rounded-xl text-xs font-black uppercase cursor-pointer shrink-0 transition"
                            id="btn-self-promo-boost-momo"
                          >
                            Pay 2,000 RWF MoM
                          </button>
                        </div>
                      </div>
                    ) : (
                      // Employer specifications details
                      <div className="border-t border-dashed border-white/10 pt-5 flex flex-col gap-4 text-xs uppercase text-left" id="employer-details-profile">
                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-black border border-white/10 p-3 rounded-xl">
                            <span className="text-[8px] text-gray-500 font-black block">Core category needed</span>
                            <span className="text-xs text-white font-black">{(currentUser as any).categoryNeeded || 'All Trades'}</span>
                          </div>
                          <div className="bg-black border border-white/10 p-3 rounded-xl">
                            <span className="text-[8px] text-gray-500 font-black block">Contract duration needed</span>
                            <span className="text-xs text-white font-black">{(currentUser as any).workDuration || 'Ad-Hoc'}</span>
                          </div>
                        </div>

                        {/* Employer MoMo Logs */}
                        <div className="flex flex-col gap-2" id="employer-unlocked-logs">
                          <span className="text-[9px] text-gray-500 font-black">Unlocked labor profiles catalog:</span>
                          <div className="bg-black p-4 rounded-xl border border-white/10 flex flex-col gap-1 text-[10px]" id="unlocked-details-container">
                            {((currentUser as any).unlockedWorkers || []).length === 0 ? (
                              <p className="text-[9.5px] text-gray-500 italic py-2">No contact reveals processed yet. Unlock numbers on individual cards.</p>
                            ) : (
                              <div className="flex flex-col gap-2">
                                <span className="font-extrabold text-[#00A550]">SUCCESSFULLY UNLOCKED IN THIS SESSION:</span>
                                <ul className="list-disc pl-4 flex flex-col gap-1 font-black">
                                  {((currentUser as any).unlockedWorkers || []).map((id: string) => {
                                    const wk = workers.find(w => w.id === id);
                                    return <li key={id} className="text-white uppercase">{wk ? wk.fullName : id} ({wk ? wk.category : 'Labor Specialty'})</li>;
                                  })}
                                </ul>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* App terms of use list */}
                    <div className="border-t border-white/10 pt-4 flex flex-col gap-1.5" id="app-about">
                      <span className="text-[9px] text-gray-500 uppercase font-black">Platform Registry Coordinates</span>
                      <p className="text-[10px] text-gray-500 leading-normal uppercase font-sans">
                        Umukozi matches connects local labor with developers legally. By using this software, both parties agree to standard wage guidelines and national labor security guidelines.
                      </p>
                    </div>

                  </div>
                ) : (
                  <div className="py-20 text-center uppercase text-gray-450 border border-dashed border-white/15 rounded-2xl" id="not-logged-in-profile">
                    No active login profile found. Register to save statistics.
                  </div>
                )}

              </div>
            )}
          </div>
        )}

      </div>

      {/* BOTTOM NAVIGATION TRACKER DOCK */}
      <nav className="fixed bottom-0 left-0 right-0 h-20 bg-[#0a0a0a] border-t border-white/10 flex justify-around items-center z-30 shadow-2xl px-2" id="bottom-navigation-dockbar">
        
        {/* Navigation Tab items (Home | Search | Messages | Profile | Notifications) */}
        
        {/* Tab 1: Home */}
        <button
          onClick={() => {
            setSelectedWorkerId(null);
            setCurrentTab('home');
          }}
          className={`flex flex-col items-center justify-center p-2 text-center transition cursor-pointer select-none ${
            currentTab === 'home' && !selectedWorkerId ? 'text-[#00A550]' : 'text-gray-500 hover:text-white'
          }`}
          id="btn-nav-home"
        >
          <Home size={20} className={currentTab === 'home' && !selectedWorkerId ? 'stroke-[2.5px]' : ''} />
          <span className="text-[9px] mt-1 font-black uppercase tracking-wider">{t.home}</span>
        </button>

        {/* Tab 2: Search */}
        <button
          onClick={() => {
            setSelectedWorkerId(null);
            setCurrentTab('search');
          }}
          className={`flex flex-col items-center justify-center p-2 text-center transition cursor-pointer select-none ${
            currentTab === 'search' || selectedWorkerId ? 'text-[#00A550]' : 'text-gray-500 hover:text-white'
          }`}
          id="btn-nav-search"
        >
          <Search size={20} className={currentTab === 'search' || selectedWorkerId ? 'stroke-[2.5px]' : ''} />
          <span className="text-[9px] mt-1 font-black uppercase tracking-wider">{t.search}</span>
        </button>

        {/* Tab 3: Messages */}
        <button
          onClick={() => {
            setSelectedWorkerId(null);
            setCurrentTab('messages');
          }}
          className={`flex flex-col items-center justify-center p-2 text-center transition cursor-pointer select-none ${
            currentTab === 'messages' && !selectedWorkerId ? 'text-[#00A550]' : 'text-gray-500 hover:text-white'
          }`}
          id="btn-nav-messages"
        >
          <MessageSquare size={20} className={currentTab === 'messages' && !selectedWorkerId ? 'stroke-[2.5px]' : ''} />
          <span className="text-[9px] mt-1 font-black uppercase tracking-wider">{t.messages}</span>
        </button>

        {/* Tab 4: Notifications with indicators */}
        <button
          onClick={() => {
            setSelectedWorkerId(null);
            setCurrentTab('notifications');
          }}
          className={`flex flex-col items-center justify-center p-2 text-center transition cursor-pointer select-none relative ${
            currentTab === 'notifications' && !selectedWorkerId ? 'text-[#00A550]' : 'text-gray-500 hover:text-white'
          }`}
          id="btn-nav-notifications"
        >
          <div className="relative">
            <Bell size={20} className={currentTab === 'notifications' && !selectedWorkerId ? 'stroke-[2.5px]' : ''} />
            {unreadCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-red-600 text-white border border-white text-[8px] font-black rounded-full h-4.5 w-4.5 flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </div>
          <span className="text-[9px] mt-1 font-black uppercase tracking-wider">{t.notifications}</span>
        </button>

        {/* Tab 5: Profile */}
        <button
          onClick={() => {
            setSelectedWorkerId(null);
            setCurrentTab('profile');
          }}
          className={`flex flex-col items-center justify-center p-2 text-center transition cursor-pointer select-none ${
            currentTab === 'profile' && !selectedWorkerId ? 'text-[#00A550]' : 'text-gray-500 hover:text-white'
          }`}
          id="btn-nav-profile"
        >
          <User size={20} className={currentTab === 'profile' && !selectedWorkerId ? 'stroke-[2.5px]' : ''} />
          <span className="text-[9px] mt-1 font-black uppercase tracking-wider">{t.profile}</span>
        </button>

      </nav>
    </div>
  );
};

