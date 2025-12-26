import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole, ChildUser, ParentUser, AdminUser, AuditLogEntry } from '@/types/emec';
import { allDemoUsers, getDemoUserByRole, validatePin, demoChild, demoParent, demoAdmin } from '@/data/demoUsers';
import { demoAuditLog } from '@/data/demoAuditLog';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (role: UserRole, pin: string) => boolean;
  logout: () => void;
  switchAccount: (role: UserRole, pin: string) => boolean;
  auditLog: AuditLogEntry[];
  addAuditEntry: (entry: Omit<AuditLogEntry, 'id' | 'timestamp'>) => void;
  getChildUser: () => ChildUser | null;
  getParentUser: () => ParentUser | null;
  getAdminUser: () => AdminUser | null;
  updateChildPoints: (points: number) => void;
  approveRequest: (approvalId: string) => void;
  rejectRequest: (approvalId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'emec_auth';
const AUDIT_KEY = 'emec_audit_log';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [auditLog, setAuditLog] = useState<AuditLogEntry[]>([]);
  const { toast } = useToast();

  // Load from localStorage on mount
  useEffect(() => {
    const savedAuth = localStorage.getItem(STORAGE_KEY);
    const savedAudit = localStorage.getItem(AUDIT_KEY);
    
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

  const login = (role: UserRole, pin: string): boolean => {
    if (validatePin(role, pin)) {
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
    if (validatePin(role, pin)) {
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
    // For parent/admin, return the linked child
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
    // Demo: Update parent's pending approvals
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

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        login,
        logout,
        switchAccount,
        auditLog,
        addAuditEntry,
        getChildUser,
        getParentUser,
        getAdminUser,
        updateChildPoints,
        approveRequest,
        rejectRequest,
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
