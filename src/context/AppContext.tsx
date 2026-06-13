import React, { createContext, useContext, useState } from "react";
import { Language, WorkerProfile, EmployerProfile } from "../types";

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
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>("en");
  const [screen, setScreen] = useState("language");
  const [workers, setWorkers] = useState<WorkerProfile[]>([]);
  const [employer, setEmployer] = useState<EmployerProfile | null>(null);
  const [hasPaid, setHasPaid] = useState(false);
  const [workerLocation, setWorkerLocation] = useState<WorkerLocation | null>(null);

  const addWorker = (worker: WorkerProfile) => {
    setWorkers(prev => [...prev, worker]);
  };

  return (
    <AppContext.Provider value={{
      language, setLanguage,
      screen, setScreen,
      workers, addWorker,
      employer, setEmployer,
      hasPaid, setHasPaid,
      workerLocation, setWorkerLocation
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
