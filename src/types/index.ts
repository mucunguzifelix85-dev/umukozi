export type Language = 'rw' | 'en' | 'fr';

export type UserRole = 'worker' | 'employer' | 'admin' | 'moderator';

export type ExperienceLevel = 'Beginner' | 'Intermediate' | 'Expert';

export type WorkDuration = string;

export interface Location {
  province: string;
  district: string;
  sector: string;
  cell: string;
  village: string;
}

export interface Review {
  id: string;
  reviewerId: string;
  reviewerName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface WorkerProfile {
  id: string;
  fullName: string;
  phoneNumber: string;
  nationalID?: string;
  location: Location;
  category: string;
  experience: ExperienceLevel;
  photoUrl: string;
  rating: number;
  reviews: Review[];
  isPremium: boolean;
  premiumExpiresAt?: string;
  isSuspended: boolean;
  isVerified: boolean;
  viewsCount: number;
  showContactInfo: {
    phone: boolean;
    whatsapp: boolean;
  };
}

export interface EmployerProfile {
  id: string;
  companyName: string;
  fullName: string;
  phoneNumber: string;
  location: Location;
  categoryNeeded: string;
  workDuration: WorkDuration;
  hasPaidRegistrationFee: boolean;
  unlockedWorkers: string[]; // List of worker IDs unlocked via 500 RWF payments
  isSuspended: boolean;
}

export interface JobPost {
  id: string;
  employerId: string;
  employerName: string;
  title: string;
  category: string;
  location: Location;
  duration: WorkDuration;
  description: string;
  budget: string;
  datePosted: string;
}

export interface Transaction {
  id: string;
  userId: string;
  userName: string;
  amount: number;
  provider: 'MTN' | 'Airtel';
  phoneNumber: string;
  timestamp: string;
  status: 'PENDING' | 'SUCCESS' | 'FAILED';
  description: string;
}

export interface UserReport {
  id: string;
  reportedId: string;
  reportedName: string;
  reporterId: string;
  reporterName: string;
  reason: string;
  date: string;
  status: 'PENDING' | 'RESOLVED' | 'DISMISSED';
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  body: string;
  timestamp: string;
  read: boolean;
  type: 'job_match' | 'profile_view' | 'payment' | 'rating' | 'system';
}

export interface TranslationSet {
  welcome: string;
  tagline: string;
  lookingForWork: string;
  needWorker: string;
  registerTitle: string;
  fullName: string;
  phone: string;
  nationalId: string;
  province: string;
  district: string;
  sector: string;
  cell: string;
  village: string;
  skillCategory: string;
  expLevel: string;
  photo: string;
  submit: string;
  home: string;
  search: string;
  messages: string;
  profile: string;
  notifications: string;
  premiumUpgrade: string;
  adminHeader: string;
}
