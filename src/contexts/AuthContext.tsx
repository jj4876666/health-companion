import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, UserRole, AuditLogEntry, generateEmecId } from '@/types/emec';
import { supabase } from '@/integrations/supabase/client';

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

  interface SupabaseProfile {
    user_id: string;
    full_name?: string;
    emec_id: string;
    account_type?: string;
    avatar_url?: string;
    created_at: string;
    date_of_birth?: string;
    blood_group?: string;
    parent_user_id?: string;
    emergency_contact?: unknown;
  }

  interface SupabaseSession {
    user: {
      id: string;
      email?: string;
      email_confirmed_at?: string;
    };
  }

  const fetchProfileWithRetry = async (userId: string, maxRetries = 4): Promise<SupabaseProfile | null> => {
    for (let i = 0; i < maxRetries; i++) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();
      if (profile) return profile as unknown as SupabaseProfile;
      await new Promise(resolve => setTimeout(resolve, 30 + (i * 30)));
    }
    return null;
  };

  const buildLiveUser = (session: SupabaseSession, profile: SupabaseProfile): User => {
    let age = 25;
    if (profile.date_of_birth) {
      const dob = new Date(profile.date_of_birth);
      const today = new Date();
      age = today.getFullYear() - dob.getFullYear();
      const m = today.getMonth() - dob.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
      if (age < 0) age = 0;
    }

    const ec = profile.emergency_contact as { name?: string; phone?: string; relationship?: string } | null;

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
      age,
      bloodGroup: profile.blood_group || '',
      allergies: [],
      medicalConditions: [],
      medications: [],
      completedQuizzes: [],
      points: 0,
      parentId: profile.parent_user_id || '',
      emergencyContact: {
        name: ec?.name || '',
        phone: ec?.phone || '',
        relationship: ec?.relationship || '',
      },
      restrictions: { sensitiveContent: age < 13, requiresParentApproval: age < 18 },
    } as User;
  };

  const loadSessionUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      const profile = await fetchProfileWithRetry(session.user.id);
      if (profile) {
        const user = buildLiveUser(session as SupabaseSession, profile);
        setCurrentUser(user);
        setIsLiveUser(true);
      }
    }
  };

  useEffect(() => {
    sessionStorage.removeItem('signup_in_progress');

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (sessionStorage.getItem('signup_in_progress')) return;

      if (session?.user) {
        const profile = await fetchProfileWithRetry(session.user.id);
        if (profile) {
          const user = buildLiveUser(session, profile);
          setCurrentUser(user);
          setIsLiveUser(true);
        }
      } else if (!session && isLiveUser) {
        setCurrentUser(null);
        setIsLiveUser(false);
      }
    });

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        const profile = await fetchProfileWithRetry(session.user.id);
        if (profile) {
          const user = buildLiveUser(session, profile);
          setCurrentUser(user);
          setIsLiveUser(true);
        }
      }
    });

    const savedAudit = localStorage.getItem(AUDIT_KEY);
    if (savedAudit) {
      try { setAuditLog(JSON.parse(savedAudit)); } catch { setAuditLog([]); }
    }

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    localStorage.setItem(AUDIT_KEY, JSON.stringify(auditLog));
  }, [auditLog]);

  const addAuditEntry = (entry: Omit<AuditLogEntry, 'id' | 'timestamp'>) => {
    const newEntry: AuditLogEntry = { ...entry, id: `audit-${Date.now()}`, timestamp: new Date().toISOString() };
    setAuditLog(prev => [newEntry, ...prev]);
  };

  // EMEC ID login via Supabase - look up the user's email by EMEC ID then sign in
  const loginWithEmecId = (_emecId: string, _password: string): boolean => {
    // EMEC ID login is now handled asynchronously via the login page
    return false;
  };

  // Legacy methods kept for interface compatibility
  const login = (_role: UserRole, _pin: string): boolean => false;
  const switchAccount = (_role: UserRole, _pin: string): boolean => false;

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
    return newUser;
  };

  const logout = () => {
    if (currentUser) {
      addAuditEntry({ userId: currentUser.id, userName: currentUser.name, userRole: currentUser.role, action: 'LOGOUT', target: 'System', details: 'Logged out' });
    }
    supabase.auth.signOut();
    setCurrentUser(null);
    setIsLiveUser(false);
  };

  const value: AuthContextType = {
    currentUser, isAuthenticated: !!currentUser, isLiveUser: true,
    login, loginWithEmecId, logout, switchAccount, registerUser, addAuditEntry, loadSessionUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
