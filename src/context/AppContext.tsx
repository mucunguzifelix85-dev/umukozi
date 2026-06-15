import React, { createContext, useContext, useState, useEffect } from "react";
import { Language, WorkerProfile, EmployerProfile, JobPosting } from "../types";

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
  const [workerLocation, setWorkerLocation] = useState<WorkerLocation | null>(null);
  const [workers, setWorkers]             = useState<WorkerProfile[]>([]);
  const [employer, setEmployer]           = useState<EmployerProfile | null>(null);
  const [jobs, setJobs]                   = useState<JobPosting[]>(SEED_JOBS);

  // Auto-expire jobs whose expiresAt has passed
  useEffect(() => {
    const interval = setInterval(() => {
      const nowIso = new Date().toISOString();
      setJobs(prev => prev.map(j =>
        j.status === "open" && j.expiresAt < nowIso
          ? { ...j, status: "expired" }
          : j
      ));
    }, 30000); // check every 30s
    return () => clearInterval(interval);
  }, []);

  const activeJobs = jobs.filter(j => j.status === "open" && j.expiresAt > new Date().toISOString());

  const addJob = (j: JobPosting) => setJobs(prev => [j, ...prev]);

  const markJobFilled = (jobId: string) =>
    setJobs(prev => prev.map(j => j.id === jobId ? { ...j, status: "filled" } : j));

  const addWorker = (w: WorkerProfile) => setWorkers(prev => [w, ...prev]);

  return (
    <AppContext.Provider value={{
      language, setLanguage,
      screen, setScreen,
      workerLocation, setWorkerLocation,
      workers, addWorker,
      employer, setEmployer,
      jobs, activeJobs, addJob,
      markJobFilled,
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
