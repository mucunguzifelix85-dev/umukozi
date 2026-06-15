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
  skillsText: string;
  lookingFor: string;
  skills: string[];
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
  expiresAt: string;        // ISO string — employer sets this
  status: "open" | "filled" | "expired";  // filled = employer found worker
}
