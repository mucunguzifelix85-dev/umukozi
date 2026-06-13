import React, { createContext, useContext, useState } from "react";
import { Language, WorkerProfile, EmployerProfile, JobPosting } from "../types";

interface WorkerLocation {
  district: string;
  sector: string;
  village: string;
}

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  screen: string;
  setScreen: (screen: string) => void;
  workers: WorkerProfile[];
  addWorker: (worker: WorkerProfile) => void;
  employer: EmployerProfile | null;
  setEmployer: (employer: EmployerProfile) => void;
  hasPaid: boolean;
  setHasPaid: (paid: boolean) => void;
  workerLocation: WorkerLocation | null;
  setWorkerLocation: (location: WorkerLocation) => void;
  jobs: JobPosting[];
  addJob: (job: JobPosting) => void;
}

const AppContext = createContext<AppContextType | null>(null);

// Seed jobs so the feed is never empty during testing
const SEED_JOBS: JobPosting[] = [
  {
    id: "J001", employerId: "E001",
    employerName: "Mutesi Christine", employerPhone: "0788100001",
    skillNeeded: "House Cleaning / Ubusuku", description: "Ndashaka umunyakazi wo gutunga inzu. Akazi ni buri munsi mu gitondo. Gahunda ifatika.",
    duration: "Buri munsi (Daily)", district: "Gasabo", sector: "Kimironko", postedAt: "2026-06-10"
  },
  {
    id: "J002", employerId: "E002",
    employerName: "Habimana Jean", employerPhone: "0788100002",
    skillNeeded: "Construction / Ubwubatsi", description: "Seeking experienced mason for house construction project in Remera. Work starts immediately.",
    duration: "3 months", district: "Gasabo", sector: "Remera", postedAt: "2026-06-11"
  },
  {
    id: "J003", employerId: "E003",
    employerName: "Uwase Solange", employerPhone: "0788100003",
    skillNeeded: "Cooking / Guteka", description: "Je cherche une cuisinière pour ma famille. Travail du lundi au samedi, repas du soir inclus.",
    duration: "Permanent", district: "Kicukiro", sector: "Kicukiro", postedAt: "2026-06-12"
  },
  {
    id: "J004", employerId: "E004",
    employerName: "Nkurunziza Paul", employerPhone: "0788100004",
    skillNeeded: "Plumbing / Amazi", description: "Ndashaka umuntu uzi gukora amazi mu nzu nshya. Akazi gafata iminsi ibiri.",
    duration: "2 days", district: "Gasabo", sector: "Kimironko", postedAt: "2026-06-12"
  },
  {
    id: "J005", employerId: "E005",
    employerName: "Ingabire Marie", employerPhone: "0788100005",
    skillNeeded: "Child Care / Kubungabunga Abana", description: "Looking for a responsible nanny for 2 children aged 3 and 5. Monday to Friday.",
    duration: "Permanent", district: "Nyarugenge", sector: "Kiyovu", postedAt: "2026-06-09"
  },
  {
    id: "J006", employerId: "E006",
    employerName: "Bizimana Eric", employerPhone: "0788100006",
    skillNeeded: "Electrical / Amashanyarazi", description: "Need electrician to install wiring in new office. Must have experience with commercial buildings.",
    duration: "1 week", district: "Kicukiro", sector: "Gikondo", postedAt: "2026-06-11"
  },
  {
    id: "J007", employerId: "E007",
    employerName: "Mukamana Rose", employerPhone: "0788100007",
    skillNeeded: "Farming / Ubuhinzi", description: "Murashaka abantu bo guhinga inzabibu no gutunza inka. Akazi kari mu murima.",
    duration: "Icyumweru", district: "Musanze", sector: "Muhoza", postedAt: "2026-06-08"
  },
  {
    id: "J008", employerId: "E008",
    employerName: "Nsengimana Claude", employerPhone: "0788100008",
    skillNeeded: "Security / Umurinzi", description: "Seeking night security guard for commercial building. Must have ID and references.",
    duration: "Permanent", district: "Gasabo", sector: "Kacyiru", postedAt: "2026-06-10"
  },
  {
    id: "J009", employerId: "E009",
    employerName: "Uwimana Diane", employerPhone: "0788100009",
    skillNeeded: "Tailoring / Gukata Imyenda", description: "Recherche couturière expérimentée pour confection de vêtements sur mesure. Atelier à domicile.",
    duration: "Permanent", district: "Huye", sector: "Ngoma", postedAt: "2026-06-07"
  },
  {
    id: "J010", employerId: "E010",
    employerName: "Sebahizi Théo", employerPhone: "0788100010",
    skillNeeded: "Driving / Gutwara Imodoka", description: "Looking for a driver for family errands and school drop-off. Must have valid licence.",
    duration: "Permanent", district: "Gasabo", sector: "Kacyiru", postedAt: "2026-06-13"
  },
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>("en");
  const [screen, setScreen] = useState("language");
  const [workers, setWorkers] = useState<WorkerProfile[]>([]);
  const [employer, setEmployer] = useState<EmployerProfile | null>(null);
  const [hasPaid, setHasPaid] = useState(false);
  const [workerLocation, setWorkerLocation] = useState<WorkerLocation | null>(null);
  const [jobs, setJobs] = useState<JobPosting[]>(SEED_JOBS);

  const addWorker = (worker: WorkerProfile) => setWorkers(prev => [...prev, worker]);
  const addJob = (job: JobPosting) => setJobs(prev => [job, ...prev]);

  return (
    <AppContext.Provider value={{
      language, setLanguage,
      screen, setScreen,
      workers, addWorker,
      employer, setEmployer,
      hasPaid, setHasPaid,
      workerLocation, setWorkerLocation,
      jobs, addJob,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
};
