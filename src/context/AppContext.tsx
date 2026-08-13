import React, { createContext, useContext, useState, useEffect } from "react";
import { Language, WorkerProfile, EmployerProfile, JobPosting, Conversation, ChatMessage, ChatParticipant, MessageAttachment } from "../types";

interface WorkerLocation {
  province: string;
  district: string;
  sector: string;
  village: string;
}

interface AppContextType {
  language: Language;
  setLanguage: (l: Language) => void;
  screen: string;
  setScreen: (s: string) => void;
  activeTab: string;
  setActiveTab: (t: string) => void;
  workerLocation: WorkerLocation | null;
  setWorkerLocation: (loc: WorkerLocation) => void;
  workers: WorkerProfile[];
  addWorker: (w: WorkerProfile) => void;
  employer: EmployerProfile | null;
  setEmployer: (e: EmployerProfile) => void;
  jobs: JobPosting[];
  activeJobs: JobPosting[];
  addJob: (j: JobPosting) => void;
  markJobFilled: (jobId: string) => void;
  hasPaid: boolean;
  setHasPaid: (v: boolean) => void;
  currentUser: ChatParticipant;
  conversations: Conversation[];
  getOrCreateConversation: (otherParty: ChatParticipant) => string;
  sendMessage: (conversationId: string, text?: string, attachment?: MessageAttachment) => void;
  markConversationRead: (conversationId: string) => void;
}

const AppContext = createContext<AppContextType | null>(null);

const now = new Date();
const future = (h: number) => new Date(now.getTime() + h * 3600000).toISOString();
const past   = (h: number) => new Date(now.getTime() - h * 3600000).toISOString();

const SEED_JOBS: JobPosting[] = [
  {
    id: "J001",
    employerId: "E001",
    employerName: "Uwimana Jean",
    employerPhone: "0781234567",
    skillNeeded: "House Cleaner",
    description: "We need a reliable house cleaner for our family home in Kimironko. The job includes sweeping, mopping, cleaning bathrooms and kitchen. Must be trustworthy and hardworking.",
    duration: "Full time",
    district: "Gasabo",
    sector: "Kimironko",
    neighborhood: "Bibare",
    postedAt: past(2),
    expiresAt: future(46),
    status: "open",
  },
  {
    id: "J002",
    employerId: "E002",
    employerName: "Mukamana Alice",
    employerPhone: "0722345678",
    skillNeeded: "Cook / Chef",
    description: "Looking for an experienced cook who can prepare Rwandan and international dishes. Family of 5. Morning shift only, 6am to 12pm Monday to Saturday.",
    duration: "Part time",
    district: "Kicukiro",
    sector: "Niboye",
    neighborhood: "Gahanga",
    postedAt: past(5),
    expiresAt: future(19),
    status: "open",
  },
  {
    id: "J003",
    employerId: "E003",
    employerName: "Habimana Peter",
    employerPhone: "0733456789",
    skillNeeded: "Childcare / Nanny",
    description: "We are looking for a caring and experienced nanny for our 2-year-old child. Must have experience with young children and be patient and gentle.",
    duration: "Full time",
    district: "Nyarugenge",
    sector: "Nyakabanda",
    neighborhood: "Muhima",
    postedAt: past(1),
    expiresAt: future(71),
    status: "open",
  },
  {
    id: "J004",
    employerId: "E004",
    employerName: "Ingabire Rose",
    employerPhone: "0789567890",
    skillNeeded: "Gardener",
    description: "Need a gardener to maintain our compound, trim hedges, water plants and keep the garden clean. 3 days per week.",
    duration: "Part time",
    district: "Gasabo",
    sector: "Remera",
    neighborhood: "Rukiri",
    postedAt: past(10),
    expiresAt: past(1),
    status: "expired",
  },
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage]           = useState<Language>("en");
  const [screen, setScreen]               = useState("language");
  const [activeTab, setActiveTab]         = useState("home");
  const [workerLocation, setWorkerLocation] = useState<WorkerLocation | null>(null);
  const [workers, setWorkers]             = useState<WorkerProfile[]>([]);
  const [employer, setEmployer]           = useState<EmployerProfile | null>(null);
  const [jobs, setJobs]                   = useState<JobPosting[]>(SEED_JOBS);
  const [hasPaid, setHasPaid]             = useState(true);
  const [conversations, setConversations] = useState<Conversation[]>([]);

  // Identity used for chat — falls back to a generic "Me" participant
  const currentUser: ChatParticipant = employer
    ? { id: employer.id, name: employer.fullName, phoneNumber: employer.phoneNumber, photoUrl: undefined, role: "employer" }
    : { id: "me", name: "Me", phoneNumber: "", photoUrl: undefined, role: "worker" };

  // Auto-expire jobs whose expiresAt has passed
  useEffect(() => {
    const interval = setInterval(() => {
      const nowIso = new Date().toISOString();
      setJobs(prev => prev.map(j =>
        j.status === "open" && j.expiresAt < nowIso
          ? { ...j, status: "expired" }
          : j
      ));
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const activeJobs = jobs.filter(j => j.status === "open" && j.expiresAt > new Date().toISOString());

  const addJob = (j: JobPosting) => setJobs(prev => [j, ...prev]);

  const markJobFilled = (jobId: string) =>
    setJobs(prev => prev.map(j => j.id === jobId ? { ...j, status: "filled" } : j));

  const addWorker = (w: WorkerProfile) => setWorkers(prev => [w, ...prev]);

  const getOrCreateConversation = (otherParty: ChatParticipant): string => {
    const existing = conversations.find(c =>
      c.participants.some(p => p.id === otherParty.id) &&
      c.participants.some(p => p.id === currentUser.id)
    );
    if (existing) return existing.id;

    const newConvo: Conversation = {
      id: `conv-${Date.now()}`,
      participants: [currentUser, otherParty],
      messages: [],
      updatedAt: new Date().toISOString(),
    };
    setConversations(prev => [newConvo, ...prev]);
    return newConvo.id;
  };

  const sendMessage = (conversationId: string, text?: string, attachment?: MessageAttachment) => {
    const msg: ChatMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      conversationId,
      senderId: currentUser.id,
      senderName: currentUser.name,
      text,
      attachment,
      sentAt: new Date().toISOString(),
      read: false,
    };
    setConversations(prev => prev.map(c =>
      c.id === conversationId
        ? { ...c, messages: [...c.messages, msg], updatedAt: msg.sentAt }
        : c
    ));
  };

  const markConversationRead = (conversationId: string) => {
    setConversations(prev => prev.map(c =>
      c.id === conversationId
        ? { ...c, messages: c.messages.map(m => ({ ...m, read: true })) }
        : c
    ));
  };

  return (
    <AppContext.Provider value={{
      language, setLanguage,
      screen, setScreen,
      activeTab, setActiveTab,
      workerLocation, setWorkerLocation,
      workers, addWorker,
      employer, setEmployer,
      jobs, activeJobs, addJob,
      markJobFilled,
      hasPaid, setHasPaid,
      currentUser,
      conversations,
      getOrCreateConversation,
      sendMessage,
      markConversationRead,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
};
