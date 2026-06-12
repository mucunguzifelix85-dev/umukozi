import React, { createContext, useContext, useState } from "react";
import { Language, WorkerProfile, EmployerProfile } from "../types";

interface AppContextType {
  language: Language;
  setLanguage: (l: Language) => void;
  screen: string;
  setScreen: (s: string) => void;
  workers: WorkerProfile[];
  addWorker: (w: WorkerProfile) => void;
  employer: EmployerProfile | null;
  setEmployer: (e: EmployerProfile) => void;
  hasPaid: boolean;
  setHasPaid: (v: boolean) => void;
}

const AppContext = createContext<AppContextType>({} as AppContextType);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>("en");
  const [screen, setScreen] = useState("language");
  const [workers, setWorkers] = useState<WorkerProfile[]>([]);
  const [employer, setEmployer] = useState<EmployerProfile | null>(null);
  const [hasPaid, setHasPaid] = useState(false);

  const addWorker = (w: WorkerProfile) => setWorkers(prev => [...prev, w]);

  return (
    <AppContext.Provider value={{
      language, setLanguage,
      screen, setScreen,
      workers, addWorker,
      employer, setEmployer,
      hasPaid, setHasPaid
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
