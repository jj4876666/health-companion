import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole, ChildUser, ParentUser, AdminUser, AdultUser, AuditLogEntry, PendingChange } from '@/types/emec';
import { allDemoUsers, getDemoUserByRole, validateEmecLogin, demoChild, demoTeen, demoParent, demoAdmin, demoAdult, demoAdultFree, demoAdultPremium, getUserByEmecId } from '@/data/demoUsers';
import { demoAuditLog } from '@/data/demoAuditLog';
import { useToast } from '@/hooks/use-toast';

// Extended demo children for parent-child linking
const demoChildrenData: ChildUser[] = [
  {
    ...demoChild,
    id: 'child-001',
    name: 'Kevin Otieno',
    age: 9,
    emecId: 'KOT2025A001',
  },
  {
    id: 'child-002',
    name: 'Faith Achieng',
    email: 'faith.demo@emec.app',
    role: 'child',
    emecId: 'FAC2025A002',
    password: 'faith2025',
    profilePicture: '/placeholder.svg',
    createdAt: '2025-01-01T00:00:00Z',
    isVerified: true,
    verificationDate: '2025-01-02T00:00:00Z',
    age: 14,
    bloodGroup: 'A+',
    allergies: ['Dust'],
    parentId: 'parent-001',
    points: 380,
    completedQuizzes: ['quiz-001', 'quiz-003'],
    restrictions: {
      sensitiveContent: false,
      requiresParentApproval: true,
    },
  },
  {
    id: 'child-003',
    name: 'Brian Odhiambo',
    email: 'brian.demo@emec.app',
    role: 'child',
    emecId: 'BOD2025A003',
    password: 'brian2025',
    profilePicture: '/placeholder.svg',
    createdAt: '2025-01-01T00:00:00Z',
    isVerified: true,
    verificationDate: '2025-01-02T00:00:00Z',
    age: 4,
    bloodGroup: 'O-',
    allergies: [],
    parentId: 'parent-001',
    points: 50,
    completedQuizzes: [],
    restrictions: {
      sensitiveContent: true,
      requiresParentApproval: true,
    },
  },
];

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (role: UserRole, pin: string) => boolean;
  loginWithEmecId: (emecId: string, password: string) => boolean;
  logout: () => void;
  switchAccount: (role: UserRole, pin: string) => boolean;
  switchAccountWithEmec: (emecId: string, password: string) => boolean;
  switchAccountType: (role: UserRole) => void;
  auditLog: AuditLogEntry[];
  addAuditEntry: (entry: Omit<AuditLogEntry, 'id' | 'timestamp'>) => void;
  getChildUser: () => ChildUser | null;
  getParentUser: () => ParentUser | null;
  getAdminUser: () => AdminUser | null;
  getAdultUser: () => AdultUser | null;
  updateChildPoints: (points: number) => void;
  approveRequest: (approvalId: string) => void;
  rejectRequest: (approvalId: string) => void;
  // Admin patient editing
  requestPatientEdit: (patientEmecId: string, fieldChanged: string, oldValue: string, newValue: string) => void;
  // Patient approval of admin changes
  pendingChanges: PendingChange[];
  approveChange: (changeId: string) => void;
  rejectChange: (changeId: string) => void;
  // Parent-child linking
  linkedChildren: ChildUser[];
  activeChildId: string | null;
  setActiveChildId: (childId: string | null) => void;
  getActiveChild: () => ChildUser | null;
  viewingAsChild: boolean;
  setViewingAsChild: (viewing: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'emec_auth';
const AUDIT_KEY = 'emec_audit_log';
const PENDING_CHANGES_KEY = 'emec_pending_changes';
const PATIENT_DATA_KEY = 'emec_patient_data';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [auditLog, setAuditLog] = useState<AuditLogEntry[]>([]);
  const [pendingChanges, setPendingChanges] = useState<PendingChange[]>([]);
  const [linkedChildren, setLinkedChildren] = useState<ChildUser[]>(demoChildrenData);
  const [activeChildId, setActiveChildId] = useState<string | null>(null);
  const [viewingAsChild, setViewingAsChild] = useState(false);
  const { toast } = useToast();

  // Load from localStorage on mount
  useEffect(() => {
    const savedAuth = localStorage.getItem(STORAGE_KEY);
    const savedAudit = localStorage.getItem(AUDIT_KEY);
    const savedPendingChanges = localStorage.getItem(PENDING_CHANGES_KEY);
    
    if (savedAuth) {
      try {
        const parsed = JSON.parse(savedAuth);
        setCurrentUser(parsed);
      } catch (e) {
        console.error('Failed to parse saved auth:', e);
      }
    }
    
    if (savedAudit) {
      try {
        setAuditLog(JSON.parse(savedAudit));
      } catch (e) {
        setAuditLog(demoAuditLog);
      }
    } else {
      setAuditLog(demoAuditLog);
    }

    if (savedPendingChanges) {
      try {
        setPendingChanges(JSON.parse(savedPendingChanges));
      } catch (e) {
        setPendingChanges([]);
      }
    }
  }, []);

  // Save to localStorage when auth changes
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [currentUser]);

  // Save audit log
  useEffect(() => {
    localStorage.setItem(AUDIT_KEY, JSON.stringify(auditLog));
  }, [auditLog]);

  // Save pending changes
  useEffect(() => {
    localStorage.setItem(PENDING_CHANGES_KEY, JSON.stringify(pendingChanges));
  }, [pendingChanges]);

  const login = (role: UserRole, pin: string): boolean => {
    const user = getDemoUserByRole(role);
    if (user) {
      setCurrentUser(user);
      addAuditEntry({
        userId: user.id,
        userName: user.name,
        userRole: role,
        action: 'LOGIN',
        target: 'System',
        details: `Logged in as ${role}`,
      });
      return true;
    }
    return false;
  };

  const loginWithEmecId = (emecId: string, password: string): boolean => {
    const user = validateEmecLogin(emecId, password);
    if (user) {
      setCurrentUser(user);
      addAuditEntry({
        userId: user.id,
        userName: user.name,
        userRole: user.role,
        action: 'LOGIN',
        target: 'System',
        details: `Logged in with EMEC ID: ${emecId}`,
      });
      return true;
    }
    return false;
  };

  const logout = () => {
    if (currentUser) {
      addAuditEntry({
        userId: currentUser.id,
        userName: currentUser.name,
        userRole: currentUser.role,
        action: 'LOGOUT',
        target: 'System',
        details: 'Logged out',
      });
    }
    setCurrentUser(null);
  };

  const switchAccount = (role: UserRole, pin: string): boolean => {
    const user = getDemoUserByRole(role);
    if (user) {
      if (currentUser) {
        addAuditEntry({
          userId: currentUser.id,
          userName: currentUser.name,
          userRole: currentUser.role,
          action: 'SWITCH_ACCOUNT',
          target: user.name,
          details: `Switched from ${currentUser.role} to ${role}`,
        });
      }
      setCurrentUser(user);
      toast({
        title: "Account switched successfully",
        description: `Now logged in as ${user.name}`,
      });
      return true;
    }
    return false;
  };

  const switchAccountWithEmec = (emecId: string, password: string): boolean => {
    const user = validateEmecLogin(emecId, password);
    if (user) {
      if (currentUser) {
        addAuditEntry({
          userId: currentUser.id,
          userName: currentUser.name,
          userRole: currentUser.role,
          action: 'SWITCH_ACCOUNT',
          target: user.name,
          details: `Switched account using EMEC ID: ${emecId}`,
        });
      }
      setCurrentUser(user);
      toast({
        title: "Account switched successfully",
        description: `Now logged in as ${user.name}`,
      });
      return true;
    }
    return false;
  };

  const addAuditEntry = (entry: Omit<AuditLogEntry, 'id' | 'timestamp'>) => {
    const newEntry: AuditLogEntry = {
      ...entry,
      id: `audit-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
    setAuditLog((prev) => [newEntry, ...prev]);
  };

  const getChildUser = (): ChildUser | null => {
    if (currentUser?.role === 'child') {
      return currentUser as ChildUser;
    }
    return demoChild;
  };

  const getParentUser = (): ParentUser | null => {
    if (currentUser?.role === 'parent') {
      return currentUser as ParentUser;
    }
    return demoParent;
  };

  const getAdminUser = (): AdminUser | null => {
    if (currentUser?.role === 'admin') {
      return currentUser as AdminUser;
    }
    return demoAdmin;
  };

  const getAdultUser = (): AdultUser | null => {
    if (currentUser?.role === 'adult') {
      return currentUser as AdultUser;
    }
    return demoAdult;
  };

  const updateChildPoints = (points: number) => {
    const childData = localStorage.getItem('emec_child_data');
    let child = childData ? JSON.parse(childData) : { ...demoChild };
    child.points = (child.points || 0) + points;
    localStorage.setItem('emec_child_data', JSON.stringify(child));
    
    if (currentUser?.role === 'child') {
      setCurrentUser({ ...currentUser, points: child.points } as ChildUser);
    }
  };

  const approveRequest = (approvalId: string) => {
    toast({
      title: "Request Approved",
      description: "The change has been approved and applied.",
    });
    addAuditEntry({
      userId: currentUser?.id || 'parent-001',
      userName: currentUser?.name || 'Grace Achieng',
      userRole: 'parent',
      action: 'APPROVE_REQUEST',
      target: 'Kevin Otieno',
      details: `Approved request ${approvalId}`,
    });
  };

  const rejectRequest = (approvalId: string) => {
    toast({
      title: "Request Rejected",
      description: "The change has been rejected.",
      variant: "destructive",
    });
    addAuditEntry({
      userId: currentUser?.id || 'parent-001',
      userName: currentUser?.name || 'Grace Achieng',
      userRole: 'parent',
      action: 'REJECT_REQUEST',
      target: 'Kevin Otieno',
      details: `Rejected request ${approvalId}`,
    });
  };

  // Admin requests to edit patient data
  const requestPatientEdit = (patientEmecId: string, fieldChanged: string, oldValue: string, newValue: string) => {
    if (currentUser?.role !== 'admin') {
      toast({
        title: "Unauthorized",
        description: "Only admins can request patient edits",
        variant: "destructive",
      });
      return;
    }

    const admin = currentUser as AdminUser;
    const patient = getUserByEmecId(patientEmecId);
    
    if (!patient) {
      toast({
        title: "Patient not found",
        description: "The EMEC ID was not found in the system",
        variant: "destructive",
      });
      return;
    }

    const newChange: PendingChange = {
      id: `change-${Date.now()}`,
      adminId: admin.id,
      adminName: admin.name,
      facilityName: admin.facilityName,
      fieldChanged,
      oldValue,
      newValue,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    setPendingChanges(prev => [...prev, newChange]);
    
    addAuditEntry({
      userId: admin.id,
      userName: admin.name,
      userRole: 'admin',
      action: 'REQUEST_EDIT',
      target: patient.name,
      details: `Requested to change ${fieldChanged} from "${oldValue}" to "${newValue}"`,
      facilityName: admin.facilityName,
    });

    toast({
      title: "Edit Request Submitted",
      description: `Request sent to ${patient.name} for approval`,
    });
  };

  // Patient approves admin's change request
  const approveChange = (changeId: string) => {
    const change = pendingChanges.find(c => c.id === changeId);
    if (!change) return;

    // Update the change status
    setPendingChanges(prev => 
      prev.map(c => c.id === changeId 
        ? { ...c, status: 'approved', resolvedAt: new Date().toISOString() } 
        : c
      )
    );

    // Apply the change to patient data
    const patientData = localStorage.getItem(PATIENT_DATA_KEY);
    let data = patientData ? JSON.parse(patientData) : {};
    data[change.fieldChanged] = change.newValue;
    localStorage.setItem(PATIENT_DATA_KEY, JSON.stringify(data));

    addAuditEntry({
      userId: currentUser?.id || '',
      userName: currentUser?.name || '',
      userRole: currentUser?.role || 'adult',
      action: 'APPROVE_CHANGE',
      target: change.adminName,
      details: `Approved change: ${change.fieldChanged} → "${change.newValue}"`,
    });

    toast({
      title: "Change Approved",
      description: `${change.fieldChanged} has been updated to "${change.newValue}"`,
    });
  };

  // Patient rejects admin's change request
  const rejectChange = (changeId: string) => {
    const change = pendingChanges.find(c => c.id === changeId);
    if (!change) return;

    setPendingChanges(prev => 
      prev.map(c => c.id === changeId 
        ? { ...c, status: 'rejected', resolvedAt: new Date().toISOString() } 
        : c
      )
    );

    addAuditEntry({
      userId: currentUser?.id || '',
      userName: currentUser?.name || '',
      userRole: currentUser?.role || 'adult',
      action: 'REJECT_CHANGE',
      target: change.adminName,
      details: `Rejected change: ${change.fieldChanged}`,
    });

    toast({
      title: "Change Rejected",
      description: "The requested change has been rejected",
      variant: "destructive",
    });
  };

  // Quick account type switching for demo
  const switchAccountType = (role: UserRole | 'teen' | 'adultFree' | 'adultPremium') => {
    let newUser: User | null = null;
    switch (role) {
      case 'child':
        newUser = demoChild;
        break;
      case 'teen':
        newUser = demoTeen;
        break;
      case 'adult':
        newUser = demoAdult;
        break;
      case 'adultFree':
        newUser = demoAdultFree;
        break;
      case 'adultPremium':
        newUser = demoAdultPremium;
        break;
      case 'parent':
        newUser = demoParent;
        break;
      case 'admin':
        newUser = demoAdmin;
        break;
    }
    if (newUser) {
      setCurrentUser(newUser);
      setActiveChildId(null);
      setViewingAsChild(false);
      toast({
        title: "Account Switched",
        description: `Now viewing as ${newUser.name}`,
      });
    }
  };

  const getActiveChild = (): ChildUser | null => {
    if (!activeChildId) return null;
    return linkedChildren.find(child => child.id === activeChildId) || null;
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        login,
        loginWithEmecId,
        logout,
        switchAccount,
        switchAccountWithEmec,
        switchAccountType,
        auditLog,
        addAuditEntry,
        getChildUser,
        getParentUser,
        getAdminUser,
        getAdultUser,
        updateChildPoints,
        approveRequest,
        rejectRequest,
        requestPatientEdit,
        pendingChanges,
        approveChange,
        rejectChange,
        linkedChildren,
        activeChildId,
        setActiveChildId,
        getActiveChild,
        viewingAsChild,
        setViewingAsChild,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}