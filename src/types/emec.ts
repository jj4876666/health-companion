// EMEC App TypeScript Types

export type UserRole = 'child' | 'parent' | 'admin' | 'adult';

// Generate EMEC ID (11 characters: 3 letters + 8 alphanumeric)
export function generateEmecId(): string {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const alphanumeric = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  
  let id = '';
  // First 3 characters are letters
  for (let i = 0; i < 3; i++) {
    id += letters.charAt(Math.floor(Math.random() * letters.length));
  }
  // Next 8 characters are alphanumeric
  for (let i = 0; i < 8; i++) {
    id += alphanumeric.charAt(Math.floor(Math.random() * alphanumeric.length));
  }
  return id;
}

export interface User {
  id: string;
  name: string;
  email?: string;
  role: UserRole;
  emecId: string; // 11-character EMEC ID
  password: string; // For demo - would be hashed in production
  profilePicture?: string;
  createdAt: string;
  isVerified: boolean;
  verificationDate?: string;
}

export interface ChildUser extends User {
  role: 'child';
  age: number;
  bloodGroup: string;
  allergies: string[];
  parentId: string;
  points: number;
  completedQuizzes: string[];
  restrictions: {
    sensitiveContent: boolean;
    requiresParentApproval: boolean;
  };
}

export interface AdultUser extends User {
  role: 'adult';
  age: number;
  bloodGroup: string;
  allergies: string[];
  medicalConditions: string[];
  medications: string[];
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  mealPlan?: MealPlan;
  pendingChanges: PendingChange[];
}

export interface ParentUser extends User {
  role: 'parent';
  linkedChildren: string[];
  pendingApprovals: Approval[];
}

export interface AdminUser extends User {
  role: 'admin';
  facilityName: string;
  facilityLicense: string;
  canEditPatients: boolean;
  canCreateMealPlans: boolean;
  canPrescribeMedication: boolean;
}

export interface PendingChange {
  id: string;
  adminId: string;
  adminName: string;
  facilityName: string;
  fieldChanged: string;
  oldValue: string;
  newValue: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  resolvedAt?: string;
}

export interface MealPlan {
  id: string;
  createdBy: string;
  facilityName: string;
  meals: {
    day: string;
    breakfast: string;
    lunch: string;
    dinner: string;
    snacks: string;
  }[];
  notes: string;
  createdAt: string;
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  prescribedBy: string;
  facilityName: string;
  startDate: string;
  endDate?: string;
  instructions: string;
}

export interface Approval {
  id: string;
  type: 'content_access' | 'data_edit' | 'admin_change';
  childId: string;
  requestedBy: string;
  description: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  resolvedAt?: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  action: string;
  target: string;
  details: string;
  facilityName?: string;
}

export interface Quiz {
  id: string;
  title: string;
  titleSw: string;
  description: string;
  descriptionSw: string;
  category: 'health' | 'nutrition' | 'safety' | 'hygiene';
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
  questions: QuizQuestion[];
  isAgeRestricted: boolean;
  minAge?: number;
}

export interface QuizQuestion {
  id: string;
  question: string;
  questionSw: string;
  options: string[];
  optionsSw: string[];
  correctIndex: number;
  explanation: string;
  explanationSw: string;
}

export interface QuizResult {
  quizId: string;
  userId: string;
  score: number;
  totalQuestions: number;
  pointsEarned: number;
  completedAt: string;
}

export interface HealthFacility {
  id: string;
  name: string;
  licenseNumber: string;
  type: 'hospital' | 'clinic' | 'dispensary';
  distance: string;
  coordinates: { lat: number; lng: number };
  phone: string;
  emergencyPhone: string;
  isVerified: boolean;
}

export interface Donation {
  id: string;
  donorId: string;
  donorName: string;
  amount: number;
  currency: string;
  charityName: string;
  isPublic: boolean;
  message?: string;
  createdAt: string;
  status: 'pending' | 'completed' | 'failed';
}

export interface HealthEducationTopic {
  id: string;
  title: string;
  titleSw: string;
  content: string;
  contentSw: string;
  category: 'puberty' | 'nutrition' | 'hygiene' | 'mental_health' | 'first_aid' | 'diseases';
  isAgeRestricted: boolean;
  minAge?: number;
  imageUrl?: string;
}

export interface Allergy {
  id: string;
  name: string;
  type: 'food' | 'medication' | 'environmental';
  symptoms: string[];
  severity: 'mild' | 'moderate' | 'severe';
  treatment: string;
}

export interface AppSettings {
  theme: 'light' | 'dark';
  backgroundColor: string;
  language: 'en' | 'sw';
  microphoneEnabled: boolean;
  notificationsEnabled: boolean;
}

export interface AppState {
  currentUser: User | null;
  isOnline: boolean;
  isAuthenticated: boolean;
  showSplash: boolean;
  auditLog: AuditLogEntry[];
  settings: AppSettings;
}

// Translation type
export type TranslationKey = string;
export interface Translations {
  [key: string]: {
    en: string;
    sw: string;
  };
}