import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, UserRole, AuditLogEntry, generateEmecId } from '@/types/emec';
import { demoAuditLog } from '@/data/demoAuditLog';
import { getDemoUserByRole, validateEmecLogin } from '@/data/demoUsers';
import { supabase } from '@/integrations/supabase/client';

const STORAGE_KEY = 'emec_auth_v1';
const AUDIT_KEY = 'emec_audit_v1';

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  isLiveUser: boolean;
  login: (role: UserRole, pin: string) => boolean;
  loginWithEmecId: (emecId: string, password: string) => boolean;
  logout: () => void;
  switchAccount: (role: UserRole, pin: string) => boolean;
  registerUser: (payload: { name: string; email?: string; phone?: string; password: string; role?: UserRole; }) => User;
  addAuditEntry: (entry: Omit<AuditLogEntry, 'id' | 'timestamp'>) => void;
  loadSessionUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLiveUser, setIsLiveUser] = useState(false);
  const [auditLog, setAuditLog] = useState<AuditLogEntry[]>([]);

  // Helper to wait for profile creation by trigger
  const fetchProfileWithRetry = async (userId: string, maxRetries = 8): Promise<any> => {
    for (let i = 0; i < maxRetries; i++) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();
      if (profile) return profile;
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    return null;
  };

  // Listen for Supabase auth state changes
  // Shared helper to build a live user from a session + profile
  const buildLiveUser = (session: any, profile: any): User => {
    // Compute age from date_of_birth
    let age = 25; // default
    if (profile.date_of_birth) {
      const dob = new Date(profile.date_of_birth);
      const today = new Date();
      age = today.getFullYear() - dob.getFullYear();
      const m = today.getMonth() - dob.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
      if (age < 0) age = 0;
    }

    return {
      id: session.user.id,
      name: profile.full_name || session.user.email || 'User',
      email: session.user.email,
      role: (profile.account_type as UserRole) || 'adult',
      emecId: profile.emec_id,
      password: '',
      profilePicture: profile.avatar_url || '/placeholder.svg',
      createdAt: profile.created_at,
      isVerified: !!session.user.email_confirmed_at,
      verificationDate: session.user.email_confirmed_at || undefined,
      // Extended fields for dashboards
      age,
      bloodGroup: profile.blood_group || 'Unknown',
      allergies: [],
      medicalConditions: [],
      medications: [],
      completedQuizzes: [],
      points: 0,
      parentId: profile.parent_user_id || '',
      emergencyContact: profile.emergency_contact || { name: 'Not set', phone: 'Not set', relationship: 'Not set' },
      restrictions: { sensitiveContent: age < 13, requiresParentApproval: age < 18 },
    } as any;
  };

  // Called by signup form after clearing the signup_in_progress flag
  const loadSessionUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      const profile = await fetchProfileWithRetry(session.user.id);
      if (profile) {
        setCurrentUser(buildLiveUser(session, profile));
        setIsLiveUser(true);
      }
    }
  };

  useEffect(() => {
    // Always clear stale signup flag on mount — the signup form sets it fresh when needed
    sessionStorage.removeItem('signup_in_progress');

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      // Skip auto-setting user while signup form is showing its success screen
      if (sessionStorage.getItem('signup_in_progress')) {
        return;
      }

      if (session?.user) {
        const profile = await fetchProfileWithRetry(session.user.id);
        if (profile) {
          setCurrentUser(buildLiveUser(session, profile));
          setIsLiveUser(true);
        }
      } else if (!session && isLiveUser) {
        setCurrentUser(null);
        setIsLiveUser(false);
      }
    });

    // Check existing session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        const profile = await fetchProfileWithRetry(session.user.id);
        if (profile) {
          setCurrentUser(buildLiveUser(session, profile));
          setIsLiveUser(true);
        }
      } else {
        const savedAuth = localStorage.getItem(STORAGE_KEY);
        if (savedAuth) {
          try { setCurrentUser(JSON.parse(savedAuth)); } catch {}
        }
      }
    });

    const savedAudit = localStorage.getItem(AUDIT_KEY);
    if (savedAudit) {
      try { setAuditLog(JSON.parse(savedAudit)); } catch { setAuditLog(demoAuditLog); }
    } else {
      setAuditLog(demoAuditLog);
    }

    return () => subscription.unsubscribe();
  }, []);

  // Persist demo user to localStorage
  useEffect(() => {
    if (currentUser && !isLiveUser) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(currentUser));
    } else if (!currentUser) {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [currentUser, isLiveUser]);

  useEffect(() => {
    localStorage.setItem(AUDIT_KEY, JSON.stringify(auditLog));
  }, [auditLog]);

  const addAuditEntry = (entry: Omit<AuditLogEntry, 'id' | 'timestamp'>) => {
    const newEntry: AuditLogEntry = { ...entry, id: `audit-${Date.now()}`, timestamp: new Date().toISOString() };
    setAuditLog(prev => [newEntry, ...prev]);
  };

  const login = (role: UserRole, pin: string): boolean => {
    const user = getDemoUserByRole(role);
    if (user) {
      setCurrentUser(user);
      setIsLiveUser(false);
      addAuditEntry({ userId: user.id, userName: user.name, userRole: role, action: 'LOGIN', target: 'System', details: `Logged in as ${role}` });
      return true;
    }
    return false;
  };

  const loginWithEmecId = (emecId: string, password: string): boolean => {
    const user = validateEmecLogin(emecId, password);
    if (user) {
      setCurrentUser(user);
      setIsLiveUser(false);
      addAuditEntry({ userId: user.id, userName: user.name, userRole: user.role, action: 'LOGIN', target: 'System', details: `Logged in with EMEC ID: ${emecId}` });
      return true;
    }
    return false;
  };

  const logout = () => {
    if (currentUser) {
      addAuditEntry({ userId: currentUser.id, userName: currentUser.name, userRole: currentUser.role, action: 'LOGOUT', target: 'System', details: 'Logged out' });
    }
    if (isLiveUser) {
      supabase.auth.signOut();
    }
    setCurrentUser(null);
    setIsLiveUser(false);
    localStorage.removeItem(STORAGE_KEY);
  };

  const switchAccount = (role: UserRole, pin: string): boolean => {
    const user = getDemoUserByRole(role);
    if (user) {
      if (currentUser) {
        addAuditEntry({ userId: currentUser.id, userName: currentUser.name, userRole: currentUser.role, action: 'SWITCH_ACCOUNT', target: user.name, details: `Switched from ${currentUser.role} to ${role}` });
      }
      setCurrentUser(user);
      setIsLiveUser(false);
      return true;
    }
    return false;
  };

  const registerUser = (payload: { name: string; email?: string; phone?: string; password: string; role?: UserRole; }) => {
    const id = `local-${Date.now()}`;
    const emecIdVal = generateEmecId();
    const newUser: User = {
      id, name: payload.name, email: payload.email,
      role: (payload.role as UserRole) || 'adult',
      emecId: emecIdVal, password: payload.password,
      profilePicture: '/placeholder.svg',
      createdAt: new Date().toISOString(),
      isVerified: true, verificationDate: new Date().toISOString(),
    } as User;

    setCurrentUser(newUser);
    setIsLiveUser(false);
    addAuditEntry({ userId: newUser.id, userName: newUser.name, userRole: newUser.role, action: 'REGISTER', target: 'System', details: 'Local/demo registration' });

    const recordsKey = `records_${newUser.id}`;
    if (!localStorage.getItem(recordsKey)) {
      localStorage.setItem(recordsKey, JSON.stringify([]));
    }
    return newUser;
  };

  const value: AuthContextType = {
    currentUser, isAuthenticated: !!currentUser, isLiveUser,
    login, loginWithEmecId, logout, switchAccount, registerUser, addAuditEntry, loadSessionUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
