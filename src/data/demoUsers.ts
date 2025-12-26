import { ChildUser, ParentUser, AdminUser, User } from '@/types/emec';

// Demo PIN codes (would be hashed in production)
export const DEMO_PINS = {
  child: '1234',
  parent: '5678',
  admin: '9999',
};

export const demoChild: ChildUser = {
  id: 'child-001',
  name: 'Kevin Otieno',
  email: 'kevin.demo@emec.app',
  role: 'child',
  pin: DEMO_PINS.child,
  profilePicture: '/placeholder.svg',
  createdAt: '2025-01-01T00:00:00Z',
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

export const demoParent: ParentUser = {
  id: 'parent-001',
  name: 'Grace Achieng',
  email: 'grace.demo@emec.app',
  role: 'parent',
  pin: DEMO_PINS.parent,
  profilePicture: '/placeholder.svg',
  createdAt: '2025-01-01T00:00:00Z',
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
  name: 'Demo Admin',
  email: 'admin.demo@emec.app',
  role: 'admin',
  pin: DEMO_PINS.admin,
  profilePicture: '/placeholder.svg',
  createdAt: '2025-01-01T00:00:00Z',
  facilityName: 'Mbita Sub-County Hospital',
  facilityLicense: 'SHA-001-2025',
  isVerified: true,
  verificationDate: '2025-01-02T00:00:00Z',
};

export const allDemoUsers: User[] = [demoChild, demoParent, demoAdmin];

export const getDemoUserByRole = (role: string): User | null => {
  switch (role) {
    case 'child':
      return demoChild;
    case 'parent':
      return demoParent;
    case 'admin':
      return demoAdmin;
    default:
      return null;
  }
};

export const validatePin = (role: string, pin: string): boolean => {
  const user = getDemoUserByRole(role);
  return user?.pin === pin;
};
