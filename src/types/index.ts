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
  expiresAt: string;
  status: "open" | "filled" | "expired";
}

export type MessageAttachmentType = "image" | "video" | "audio" | "file";

export interface MessageAttachment {
  type: MessageAttachmentType;
  url: string;
  name?: string;
  mimeType?: string;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  text?: string;
  attachment?: MessageAttachment;
  sentAt: string;
  read: boolean;
}

export interface ChatParticipant {
  id: string;
  name: string;
  phoneNumber: string;
  photoUrl?: string;
  role: UserRole;
}

export interface Conversation {
  id: string;
  participants: ChatParticipant[];
  messages: ChatMessage[];
  updatedAt: string;
}
