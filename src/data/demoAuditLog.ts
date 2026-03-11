import { AuditLogEntry } from '@/types/emec';

export const demoAuditLog: AuditLogEntry[] = [
  {
    id: 'audit-001',
    timestamp: '2025-01-15T09:00:00Z',
    userId: 'admin-001',
    userName: 'Demo Admin',
    userRole: 'admin',
    action: 'VIEW_RECORD',
    target: 'Kevin Otieno',
    details: 'Viewed patient medical record',
    facilityName: 'Mbita Sub-County Hospital',
  },
  {
    id: 'audit-002',
    timestamp: '2025-01-15T09:15:00Z',
    userId: 'admin-001',
    userName: 'Demo Admin',
    userRole: 'admin',
    action: 'UPDATE_ALLERGY',
    target: 'Kevin Otieno',
    details: 'Added allergy: Peanuts (pending parent approval)',
    facilityName: 'Mbita Sub-County Hospital',
  },
  {
    id: 'audit-003',
    timestamp: '2025-01-15T10:30:00Z',
    userId: 'parent-001',
    userName: 'Grace Achieng',
    userRole: 'parent',
    action: 'APPROVE_CHANGE',
    target: 'Kevin Otieno',
    details: 'Approved allergy addition: Peanuts',
  },
  {
    id: 'audit-004',
    timestamp: '2025-01-16T08:00:00Z',
    userId: 'child-001',
    userName: 'Kevin Otieno',
    userRole: 'child',
    action: 'COMPLETE_QUIZ',
    target: 'Health Quiz: Hygiene Basics',
    details: 'Scored 8/10, earned 80 points',
  },
  {
    id: 'audit-005',
    timestamp: '2025-01-16T14:30:00Z',
    userId: 'admin-001',
    userName: 'Demo Admin',
    userRole: 'admin',
    action: 'REQUEST_UPDATE',
    target: 'Kevin Otieno',
    details: 'Requested blood group update: B+ → A+',
    facilityName: 'Mbita Sub-County Hospital',
  },
];

export const getAuditLogForUser = (userId: string): AuditLogEntry[] => {
  return demoAuditLog.filter(
    (entry) => entry.userId === userId || entry.target.includes(userId)
  );
};
