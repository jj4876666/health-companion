import { ChildUser, ParentUser, AdminUser, AdultUser, User, generateEmecId } from '@/types/emec';

// Demo EMEC IDs (11 characters: 3 letters + 8 alphanumeric)
export const DEMO_EMEC_IDS = {
  child: 'KOT2025A001',      // Kevin - Child (9 years)
  teen: 'FAC2025A002',       // Faith - Teen (14 years)
  adult: 'AJM2025B002',      // James - Adult
  parent: 'GAC2025C003',
  admin: 'ADM2025D004',
};

// Demo passwords
export const DEMO_PASSWORDS = {
  child: 'kevin2025',
  teen: 'faith2025',
  adult: 'james2025',
  parent: 'grace2025',
  admin: 'admin2025',
};

export const demoChild: ChildUser = {
  id: 'child-001',
  name: 'Kevin Otieno',
  email: 'kevin.demo@emec.app',
  role: 'child',
  emecId: DEMO_EMEC_IDS.child,
  password: DEMO_PASSWORDS.child,
  profilePicture: '/placeholder.svg',
  createdAt: '2025-01-01T00:00:00Z',
  isVerified: true,
  verificationDate: '2025-01-02T00:00:00Z',
  age: 9,
  bloodGroup: 'O+',
  allergies: ['Penicillin', 'Peanuts'],
  parentId: 'parent-001',
  points: 250,
  completedQuizzes: ['quiz-001', 'quiz-002'],
  restrictions: {
    sensitiveContent: true,
    requiresParentApproval: true,
  },
};

// Faith - Teen account (14 years) - distinct from Kevin
export const demoTeen: ChildUser = {
  id: 'teen-001',
  name: 'Faith Achieng',
  email: 'faith.demo@emec.app',
  role: 'child',
  emecId: DEMO_EMEC_IDS.teen,
  password: DEMO_PASSWORDS.teen,
  profilePicture: '/placeholder.svg',
  createdAt: '2025-01-01T00:00:00Z',
  isVerified: true,
  verificationDate: '2025-01-02T00:00:00Z',
  age: 14,
  bloodGroup: 'A+',
  allergies: ['Dust', 'Pollen'],
  parentId: 'parent-001',
  points: 480,
  completedQuizzes: ['quiz-001', 'quiz-003', 'quiz-005'],
  restrictions: {
    sensitiveContent: false,  // Teens can access puberty/mental health content
    requiresParentApproval: true,
  },
};

export const demoAdult: AdultUser = {
  id: 'adult-001',
  name: 'James Mwangi',
  email: 'james.demo@emec.app',
  role: 'adult',
  emecId: DEMO_EMEC_IDS.adult,
  password: DEMO_PASSWORDS.adult,
  profilePicture: '/placeholder.svg',
  createdAt: '2025-01-01T00:00:00Z',
  isVerified: true,
  verificationDate: '2025-01-03T00:00:00Z',
  age: 32,
  bloodGroup: 'A+',
  allergies: ['Sulfa drugs', 'Shellfish'],
  medicalConditions: ['Hypertension'],
  medications: ['Amlodipine 5mg daily'],
  emergencyContact: {
    name: 'Mary Mwangi',
    phone: '+254712345678',
    relationship: 'Spouse',
  },
  pendingChanges: [],
};

export const demoParent: ParentUser = {
  id: 'parent-001',
  name: 'Grace Achieng',
  email: 'grace.demo@emec.app',
  role: 'parent',
  emecId: DEMO_EMEC_IDS.parent,
  password: DEMO_PASSWORDS.parent,
  profilePicture: '/placeholder.svg',
  createdAt: '2025-01-01T00:00:00Z',
  isVerified: true,
  verificationDate: '2025-01-02T00:00:00Z',
  linkedChildren: ['child-001'],
  pendingApprovals: [
    {
      id: 'approval-001',
      type: 'content_access',
      childId: 'child-001',
      requestedBy: 'child-001',
      description: 'Access to Puberty Education content',
      status: 'pending',
      createdAt: '2025-01-15T10:00:00Z',
    },
    {
      id: 'approval-002',
      type: 'admin_change',
      childId: 'child-001',
      requestedBy: 'admin-001',
      description: 'Update blood group from O+ to A+',
      status: 'pending',
      createdAt: '2025-01-16T14:30:00Z',
    },
  ],
};

export const demoAdmin: AdminUser = {
  id: 'admin-001',
  name: 'Dr. Omondi Wekesa',
  email: 'admin.demo@emec.app',
  role: 'admin',
  emecId: DEMO_EMEC_IDS.admin,
  password: DEMO_PASSWORDS.admin,
  profilePicture: '/placeholder.svg',
  createdAt: '2025-01-01T00:00:00Z',
  isVerified: true,
  verificationDate: '2025-01-02T00:00:00Z',
  facilityName: 'Mbita Sub-County Hospital',
  facilityLicense: 'SHA-001-2025',
  canEditPatients: true,
  canCreateMealPlans: true,
  canPrescribeMedication: true,
};

export const allDemoUsers: User[] = [
  demoChild, 
  demoTeen, 
  demoAdult, 
  demoParent, 
  demoAdmin
];

export const getDemoUserByRole = (role: string): User | null => {
  switch (role) {
    case 'child':
      return demoChild;
    case 'teen':
      return demoTeen;
    case 'adult':
      return demoAdult;
    case 'parent':
      return demoParent;
    case 'admin':
      return demoAdmin;
    default:
      return null;
  }
};

export const getUserByEmecId = (emecId: string): User | null => {
  return allDemoUsers.find(user => user.emecId.toUpperCase() === emecId.toUpperCase()) || null;
};

export const validateEmecLogin = (emecId: string, password: string): User | null => {
  const user = getUserByEmecId(emecId);
  if (user && user.password === password) {
    return user;
  }
  return null;
};

// Legacy PIN validation for backward compatibility
export const DEMO_PINS = {
  child: '1234',
  teen: '1414',
  parent: '5678',
  admin: '9999',
};

export const validatePin = (role: string, pin: string): boolean => {
  const pins: Record<string, string> = DEMO_PINS;
  return pins[role] === pin;
};