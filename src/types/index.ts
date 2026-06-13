export type Language = "rw" | "en" | "fr" | "sw";
export type UserRole = "worker" | "employer";

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
  location: Location;
  skills: string[];
  experiencedIn: string[];
  summary?: string;
  workTypes?: string;
  availableAreas?: string;
  registeredAt: string;
}

export interface EmployerProfile {
  id: string;
  fullName: string;
  phoneNumber: string;
  location: Location;
  hasPaid: boolean;
  registeredAt: string;
}

export interface JobPosting {
  id: string;
  employerId: string;
  employerName: string;
  employerPhone: string;
  skillNeeded: string;
  description: string;
  duration: string;
  district: string;
  sector: string;
  postedAt: string;
}

export interface AppState {
  language: Language;
  screen: string;
  workers: WorkerProfile[];
  employer: EmployerProfile | null;
  hasPaid: boolean;
  jobs: JobPosting[];
}
