
export enum AppTab {
  Home = 'home',
  Mentors = 'mentors',
  Natal = 'natal',
  Community = 'community',
  Profile = 'profile',
  Chat = 'chat'
}

export type ThemeMode = 'system' | 'light' | 'dark';

export type UserRole = 'user' | 'mentor' | 'mentor_pending' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarDataUrl?: string;
  createdAtIso?: string;
}

export interface UserSession {
  isAuthenticated: boolean;
  userId?: string;
  userName?: string;
}

export interface BirthProfile {
  fullName?: string;
  birthDate: string; // YYYY-MM-DD
  birthTime: string; // HH:mm
  birthCity: string; // Acts as birthPlace
  tzOffsetMinutes: number;
  savedAt: string;
}

export type PlanetKey = 'sun' | 'moon' | 'mercury' | 'venus' | 'mars' | 'jupiter' | 'saturn' | 'uranus' | 'neptune' | 'pluto';

// --- Blueprint Types (Prompt #4) ---

export interface AstrologySummary {
  sunSign: string;
  moonSign: string;
  risingSign: string;
  element?: string;
  modality?: string;
  planetDegrees: Record<PlanetKey, number>; // Needed for Chart Preview
}

export interface HumanDesignSummary {
  type: string;
  strategy: string;
  authority: string;
  profile: string;
  definition?: string;
  roleModel?: string;
}

export interface BlueprintSnapshot {
  birthProfileId: string; // e.g. hash of birth data
  astrology?: AstrologySummary;
  humanDesign?: HumanDesignSummary;
  generatedAtIso: string;
}

// -----------------------------------

export interface NavItem {
  label: string;
  path: string;
  icon: any;
  id: AppTab;
}

// Mentor & Booking Models
export interface SessionType {
  id: string;
  label: string;
  durationMin: number;
  price: number;
}

export interface MentorAvailability {
  weekdays: number[]; // 0=Sun, 6=Sat
  startHour: number;
  endHour: number;
}

export interface MentorProfile {
  userId: string;
  name: string;
  title: string;
  bio: string;
  tags: string[];
  languages: string[];
  priceFrom: number;
  sessionTypes: SessionType[];
  avatarUrl?: string;
  availability?: MentorAvailability;
  isVerified: boolean;
}

export type Mentor = MentorProfile & { id: string };

export type BookingStatus = 'pending_payment' | 'confirmed' | 'cancelled' | 'completed';

export interface Booking {
  id: string;
  userId: string;
  mentorId: string;
  sessionTypeId: string;
  startsAtIso: string;
  endsAtIso: string;
  note?: string;
  status: BookingStatus;
  meetingUrl?: string;
  createdAtIso: string;
  paymentId?: string;
}

// Payments
export interface PaymentRecord {
  id: string;
  userId: string;
  bookingId: string;
  amount: number;
  currency: string;
  provider: 'stripe_stub';
  status: 'succeeded' | 'failed' | 'pending';
  createdAtIso: string;
}

// Video
export interface VideoSession {
  id: string;
  bookingId: string;
  provider: 'jitsi_stub';
  joinUrl: string;
  createdAtIso: string;
}

// Community Models
export interface CommunityPost {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatarUrl?: string;
  createdAtIso: string;
  text: string;
  imageUrl?: string;
  language: string;
  tags?: string[];
  likeCount: number;
  commentCount: number;
}

export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  authorAvatarUrl?: string;
  createdAtIso: string;
  text: string;
}

export interface Report {
  id: string;
  postId: string;
  reporterId: string;
  reason: 'spam' | 'abuse' | 'other';
  note?: string;
  createdAtIso: string;
}

export type FeatureFlagKey = 
  | 'proEnabled' 
  | 'aiGuideEnabled' 
  | 'coursesEnabled' 
  | 'communityEnabled' 
  | 'paymentsEnabled' 
  | 'videoEnabled' 
  | 'humanDesignEnabled' 
  | 'astrologyEnabled';

export interface SubscriptionRecord {
  id: string;
  userId: string;
  plan: 'pro';
  status: 'active' | 'canceled' | 'expired';
  startedAtIso: string;
  expiresAtIso?: string;
}

export type NotificationType = 'booking_confirmed' | 'payment_success' | 'mentor_approved' | 'system_alert';

export interface NotificationItem {
  id: string;
  userId: string;
  type: NotificationType;
  titleKey: string;
  bodyKey?: string; // Optional i18n key or raw text
  createdAtIso: string;
  readAtIso?: string;
  payload?: any; // e.g. { bookingId: '...' }
}
