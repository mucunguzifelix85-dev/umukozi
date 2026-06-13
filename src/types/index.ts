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
  skillsText: string;      // typed by worker, e.g. "Cleaning, cooking, childcare"
  lookingFor: string;      // typed by worker, e.g. "House cleaning job, full time"
  skills: string[];        // kept for search compatibility
  experiencedIn: string[];
  summary?: string;
  photoUrl?: string;
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
  neighborhood: string;
  photoUrl?: string;
  postedAt: string;
}
