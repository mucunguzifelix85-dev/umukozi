export type Language = "rw" | "en" | "fr" | "sw";
export type UserRole = "worker" | "employer";
export type ExperienceLevel = "Beginner" | "Intermediate" | "Expert";

export interface Location {
  province: string;
  district: string;
  sector: string;
  neighborhood: string;
}

export interface WorkerProfile {
  id: string;
  fullName: string;
  phoneNumber: string;
  nationalID?: string;
  location: Location;
  skills: string[];
  experiencedIn: string[];
  registeredAt: string;
}

export interface EmployerProfile {
  id: string;
  fullName: string;
  phoneNumber: string;
  nationalID?: string;
  location: Location;
  hasPaid: boolean;
  registeredAt: string;
}

export interface AppState {
  language: Language;
  screen: "language" | "role" | "register-worker" | "register-employer" | "payment" | "search";
  workers: WorkerProfile[];
  employer: EmployerProfile | null;
  hasPaid: boolean;
}
