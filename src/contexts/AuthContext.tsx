import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, UserRole, AuditLogEntry, ChildUser, ParentUser, AdminUser, AdultUser, generateEmecId } from '@/types/emec';
import { demoAuditLog } from '@/data/demoAuditLog';
import { getDemoUserByRole, validateEmecLogin } from '@/data/demoUsers';

// NOTE: this file intentionally keeps local/demo behavior and stores new users/records in localStorage only.

const STORAGE_KEY = 'emec_auth_v1';
const AUDIT_KEY = 'emec_audit_v1';

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (role: UserRole, pin: string) => boolean;
  loginWithEmecId: (emecId: string, password: string) => boolean;
  logout: () => void;
  switchAccount: (role: UserRole, pin: string) => boolean;
  registerUser: (payload: { name: string; email?: string; phone?: string; password: string; role?: UserRole; }) => User;
  addAuditEntry: (entry: Omit<AuditLogEntry, 'id' | 'timestamp'>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [auditLog, setAuditLog] = useState<AuditLogEntry[]>([]);

  useEffect(() => {
    const savedAuth = localStorage.getItem(STORAGE_KEY);
    const savedAudit = localStorage.getItem(AUDIT_KEY);

    if (savedAuth) {
      try {
        setCurrentUser(JSON.parse(savedAuth));
      } catch (e) {
        console.error('Failed to parse saved auth', e);
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

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(AUDIT_KEY, JSON.stringify(auditLog));
  }, [auditLog]);

  const addAuditEntry = (entry: Omit<AuditLogEntry, 'id' | 'timestamp'>) => {
    const newEntry: AuditLogEntry = {
      ...entry,
      id: `audit-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
    setAuditLog(prev => [newEntry, ...prev]);
  };

  const login = (role: UserRole, pin: string): boolean => {
    const user = getDemoUserByRole(role);
    if (user) {
      setCurrentUser(user);
      addAuditEntry({ userId: user.id, userName: user.name, userRole: role, action: 'LOGIN', target: 'System', details: `Logged in as ${role}` });
      return true;
    }
    return false;
  };

  const loginWithEmecId = (emecId: string, password: string): boolean => {
    const user = validateEmecLogin(emecId, password);
    if (user) {
      setCurrentUser(user);
      addAuditEntry({ userId: user.id, userName: user.name, userRole: user.role, action: 'LOGIN', target: 'System', details: `Logged in with EMEC ID: ${emecId}` });
      return true;
    }
    return false;
  };

  const logout = () => {
    if (currentUser) {
      addAuditEntry({ userId: currentUser.id, userName: currentUser.name, userRole: currentUser.role, action: 'LOGOUT', target: 'System', details: 'Logged out' });
    }
    setCurrentUser(null);
  };

  const switchAccount = (role: UserRole, pin: string): boolean => {
    const user = getDemoUserByRole(role);
    if (user) {
      if (currentUser) {
        addAuditEntry({ userId: currentUser.id, userName: currentUser.name, userRole: currentUser.role, action: 'SWITCH_ACCOUNT', target: user.name, details: `Switched from ${currentUser.role} to ${role}` });
      }
      setCurrentUser(user);
      return true;
    }
    return false;
  };

  // registerUser: local/demo only — creates a local user and empty local records under records_<id>
  const registerUser = (payload: { name: string; email?: string; phone?: string; password: string; role?: UserRole; }) => {
    const id = `local-${Date.now()}`;
    const emecId = generateEmecId();
    const newUser: User = {
      id,
      name: payload.name,
      email: payload.email,
      role: (payload.role as UserRole) || 'adult',
      emecId,
      password: payload.password,
      profilePicture: '/placeholder.svg',
      createdAt: new Date().toISOString(),
      isVerified: true,
      verificationDate: new Date().toISOString(),
    } as User;

    setCurrentUser(newUser);
    addAuditEntry({ userId: newUser.id, userName: newUser.name, userRole: newUser.role, action: 'REGISTER', target: 'System', details: 'Local/demo registration' });

    // Create empty local records store
    const recordsKey = `records_${newUser.id}`;
    if (!localStorage.getItem(recordsKey)) {
      localStorage.setItem(recordsKey, JSON.stringify([]));
    }

    return newUser;
  };

  const value: AuthContextType = {
    currentUser,
    isAuthenticated: !!currentUser,
    login,
    loginWithEmecId,
    logout,
    switchAccount,
    registerUser,
    addAuditEntry,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
