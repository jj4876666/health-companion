import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, UserRole, AuditLogEntry, generateEmecId } from '@/types/emec';
import { demoAuditLog } from '@/data/demoAuditLog';
import { getDemoUserByRole, validateEmecLogin } from '@/data/demoUsers';
import { supabase } from '@/integrations/supabase/client';
// DATABASE ROUTING: Import database router for demo/production separation
import { isDemoUser, getUserDatabaseType } from '@/integrations/supabase/databaseRouter';

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
    emergency_contact?: { name: string; phone: string; relationship: string };
  }

  interface SupabaseSession {
    user: {
      id: string;
      email?: string;
      email_confirmed_at?: string;
    };
  }

  // Helper to wait for profile creation by trigger
  // PRODUCTION DATABASE: Only used for real Supabase accounts
  // OPTIMIZED: Reduced retry delay from 500ms to 150ms for faster login
  const fetchProfileWithRetry = async (userId: string, maxRetries = 6): Promise<SupabaseProfile | null> => {
    for (let i = 0; i < maxRetries; i++) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();
      if (profile) return profile as SupabaseProfile;
      // Progressive delay: 50ms, 100ms, 150ms, 200ms, 250ms, 300ms (max 1.05s total)
      await new Promise(resolve => setTimeout(resolve, 50 + (i * 50)));
    }
    return null;
  };

  // PRODUCTION DATABASE: Build user object from Supabase session
  // Shared helper to build a live user from a session + profile
  const buildLiveUser = (session: SupabaseSession, profile: SupabaseProfile): User => {
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
    } as User;
  };

  // Called by signup form after clearing the signup_in_progress flag
  // PRODUCTION DATABASE: Load user from Supabase session
  const loadSessionUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      const profile = await fetchProfileWithRetry(session.user.id);
      if (profile) {
        const user = buildLiveUser(session as SupabaseSession, profile);
        setCurrentUser(user);
        setIsLiveUser(true);
        console.log(`[DB ROUTER] Loaded production user: ${user.name} (${getUserDatabaseType(user)} database)`);
      }
    }
  };

  useEffect(() => {
    // Always clear stale signup flag on mount — the signup form sets it fresh when needed
    sessionStorage.removeItem('signup_in_progress');

    // PRODUCTION DATABASE: Listen for Supabase auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      // Skip auto-setting user while signup form is showing its success screen
      if (sessionStorage.getItem('signup_in_progress')) {
        return;
      }

      if (session?.user) {
        const profile = await fetchProfileWithRetry(session.user.id);
        if (profile) {
          const user = buildLiveUser(session, profile);
          setCurrentUser(user);
          setIsLiveUser(true);
          console.log(`[DB ROUTER] Auth state changed - production user: ${user.name}`);
        }
      } else if (!session && isLiveUser) {
        setCurrentUser(null);
        setIsLiveUser(false);
        console.log('[DB ROUTER] Production user logged out');
      }
    });

    // Check existing session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        // PRODUCTION DATABASE: User has active Supabase session
        const profile = await fetchProfileWithRetry(session.user.id);
        if (profile) {
          const user = buildLiveUser(session, profile);
          setCurrentUser(user);
          setIsLiveUser(true);
          console.log(`[DB ROUTER] Restored production session: ${user.name}`);
        }
      } else {
        // DEMO DATABASE: Check localStorage for demo user
        const savedAuth = localStorage.getItem(STORAGE_KEY);
        if (savedAuth) {
          try { 
            const user = JSON.parse(savedAuth);
            setCurrentUser(user);
            console.log(`[DB ROUTER] Restored demo user: ${user.name} (${getUserDatabaseType(user)} database)`);
          } catch {
            // Ignore parse errors
          }
        }
      }
    });

    const savedAudit = localStorage.getItem(AUDIT_KEY);
    if (savedAudit) {
      try { 
        setAuditLog(JSON.parse(savedAudit)); 
      } catch { 
        setAuditLog(demoAuditLog); 
      }
    } else {
      setAuditLog(demoAuditLog);
    }

    return () => subscription.unsubscribe();
  }, []);

  // DEMO DATABASE: Persist demo user to localStorage only
  // Production users are managed by Supabase
  useEffect(() => {
    if (currentUser && !isLiveUser) {
      // Demo user - save to localStorage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(currentUser));
      console.log(`[DB ROUTER] Saved demo user to localStorage: ${currentUser.name}`);
    } else if (!currentUser) {
      localStorage.removeItem(STORAGE_KEY);
    }
    // Production users (isLiveUser=true) are NOT saved to localStorage
  }, [currentUser, isLiveUser]);

  useEffect(() => {
    localStorage.setItem(AUDIT_KEY, JSON.stringify(auditLog));
  }, [auditLog]);

  const addAuditEntry = (entry: Omit<AuditLogEntry, 'id' | 'timestamp'>) => {
    const newEntry: AuditLogEntry = { ...entry, id: `audit-${Date.now()}`, timestamp: new Date().toISOString() };
    setAuditLog(prev => [newEntry, ...prev]);
  };

  // DEMO DATABASE: Login with demo account (uses localStorage)
  const login = (role: UserRole, pin: string): boolean => {
    const user = getDemoUserByRole(role);
    if (user) {
      setCurrentUser(user);
      setIsLiveUser(false);
      addAuditEntry({ userId: user.id, userName: user.name, userRole: role, action: 'LOGIN', target: 'System', details: `Logged in as ${role}` });
      console.log(`[DB ROUTER] Demo login: ${user.name} (demo database)`);
      return true;
    }
    return false;
  };

  // DEMO DATABASE: Login with EMEC ID (checks demo accounts first)
  const loginWithEmecId = (emecId: string, password: string): boolean => {
    const user = validateEmecLogin(emecId, password);
    if (user) {
      setCurrentUser(user);
      setIsLiveUser(false);
      addAuditEntry({ userId: user.id, userName: user.name, userRole: user.role, action: 'LOGIN', target: 'System', details: `Logged in with EMEC ID: ${emecId}` });
      console.log(`[DB ROUTER] Demo EMEC login: ${user.name} (demo database)`);
      return true;
    }
    return false;
  };

  const logout = () => {
    if (currentUser) {
      addAuditEntry({ userId: currentUser.id, userName: currentUser.name, userRole: currentUser.role, action: 'LOGOUT', target: 'System', details: 'Logged out' });
      console.log(`[DB ROUTER] Logout: ${currentUser.name} (${getUserDatabaseType(currentUser)} database)`);
    }
    // PRODUCTION DATABASE: Sign out from Supabase if production user
    if (isLiveUser) {
      supabase.auth.signOut();
    }
    setCurrentUser(null);
    setIsLiveUser(false);
    localStorage.removeItem(STORAGE_KEY);
  };

  // DEMO DATABASE: Switch between demo accounts
  const switchAccount = (role: UserRole, pin: string): boolean => {
    const user = getDemoUserByRole(role);
    if (user) {
      if (currentUser) {
        addAuditEntry({ userId: currentUser.id, userName: currentUser.name, userRole: currentUser.role, action: 'SWITCH_ACCOUNT', target: user.name, details: `Switched from ${currentUser.role} to ${role}` });
      }
      setCurrentUser(user);
      setIsLiveUser(false);
      console.log(`[DB ROUTER] Switched to demo account: ${user.name}`);
      return true;
    }
    return false;
  };

  // DEMO DATABASE: Register local/demo user (uses localStorage)
  // Note: Production registration happens through ProductionSignupForm with Supabase
  // DEMO DATABASE: Register local/demo user (uses localStorage)
  // Note: Production registration happens through ProductionSignupForm with Supabase
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
    console.log(`[DB ROUTER] Registered demo user: ${newUser.name} (demo database)`);

    // DEMO DATABASE: Initialize demo user's medical records in localStorage
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
