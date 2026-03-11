# Database Architecture Diagram

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    HEALTH COMPANION APP                          │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │              User Authentication Layer                      │ │
│  │                 (AuthContext.tsx)                          │ │
│  └────────────────────┬───────────────────────────────────────┘ │
│                       │                                           │
│                       ▼                                           │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │           Database Router (databaseRouter.ts)              │ │
│  │                                                             │ │
│  │  ┌──────────────────────────────────────────────────────┐ │ │
│  │  │  isDemoUser(user) → boolean                          │ │ │
│  │  │  getDatabaseClient(user) → Supabase | null           │ │ │
│  │  │  getUserDatabaseType(user) → 'demo' | 'production'   │ │ │
│  │  └──────────────────────────────────────────────────────┘ │ │
│  └────────────────────┬───────────────────────────────────────┘ │
│                       │                                           │
│           ┌───────────┴───────────┐                              │
│           │                       │                              │
│           ▼                       ▼                              │
│  ┌─────────────────┐     ┌─────────────────┐                   │
│  │  DEMO DATABASE  │     │ PRODUCTION DB   │                   │
│  │  (localStorage) │     │   (Supabase)    │                   │
│  └─────────────────┘     └─────────────────┘                   │
└─────────────────────────────────────────────────────────────────┘
```

## User Flow Diagram

```
                    ┌─────────────┐
                    │   User      │
                    │   Login     │
                    └──────┬──────┘
                           │
                           ▼
                ┌──────────────────────┐
                │  Check EMEC ID       │
                │  in demoUsers.ts     │
                └──────┬───────────────┘
                       │
           ┌───────────┴───────────┐
           │                       │
           ▼                       ▼
    ┌─────────────┐         ┌─────────────┐
    │ DEMO USER   │         │ PRODUCTION  │
    │ FOUND       │         │ USER        │
    └──────┬──────┘         └──────┬──────┘
           │                       │
           ▼                       ▼
    ┌─────────────┐         ┌─────────────┐
    │ isLiveUser  │         │ isLiveUser  │
    │ = false     │         │ = true      │
    └──────┬──────┘         └──────┬──────┘
           │                       │
           ▼                       ▼
    ┌─────────────┐         ┌─────────────┐
    │ localStorage│         │  Supabase   │
    │ Operations  │         │ Operations  │
    └─────────────┘         └─────────────┘
```

## Data Flow - Demo User

```
┌──────────────────────────────────────────────────────────────┐
│ DEMO USER: Dr. Omondi (ADM2025D004)                          │
└──────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌──────────────────────────────────────────────────────────────┐
│ 1. Login with EMEC ID                                        │
│    loginWithEmecId('ADM2025D004', 'admin2025')              │
└──────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌──────────────────────────────────────────────────────────────┐
│ 2. Check demoUsers.ts                                        │
│    validateEmecLogin() → Returns demo user object            │
└──────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌──────────────────────────────────────────────────────────────┐
│ 3. Set User State                                            │
│    setCurrentUser(demoUser)                                  │
│    setIsLiveUser(false)                                      │
└──────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌──────────────────────────────────────────────────────────────┐
│ 4. Database Operations                                       │
│    getDatabaseClient(user) → returns null                    │
│    → Use localStorage                                        │
└──────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌──────────────────────────────────────────────────────────────┐
│ 5. Save Data                                                 │
│    Key: "demo_ADM2025D004_patient_updates_123"              │
│    localStorage.setItem(key, JSON.stringify(data))          │
└──────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌──────────────────────────────────────────────────────────────┐
│ 6. Console Log                                               │
│    [DB ROUTER] Saved to demo database (localStorage)        │
└──────────────────────────────────────────────────────────────┘
```

## Data Flow - Production User

```
┌──────────────────────────────────────────────────────────────┐
│ PRODUCTION USER: New Health Officer                          │
└──────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌──────────────────────────────────────────────────────────────┐
│ 1. Register Account                                          │
│    ProductionSignupForm → Supabase.auth.signUp()           │
└──────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌──────────────────────────────────────────────────────────────┐
│ 2. Supabase Creates                                          │
│    - Auth user in auth.users                                 │
│    - Profile in public.profiles (via trigger)                │
└──────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌──────────────────────────────────────────────────────────────┐
│ 3. Login / Session                                           │
│    Supabase.auth.getSession() → Returns session             │
└──────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌──────────────────────────────────────────────────────────────┐
│ 4. Build User Object                                         │
│    buildLiveUser(session, profile)                          │
│    setIsLiveUser(true)                                       │
└──────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌──────────────────────────────────────────────────────────────┐
│ 5. Database Operations                                       │
│    getDatabaseClient(user) → returns supabase client        │
│    → Use Supabase                                            │
└──────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌──────────────────────────────────────────────────────────────┐
│ 6. Save Data                                                 │
│    await supabase.from('medical_updates').insert(data)      │
└──────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌──────────────────────────────────────────────────────────────┐
│ 7. Console Log                                               │
│    [DB ROUTER] Saved to production database (Supabase)      │
└──────────────────────────────────────────────────────────────┘
```

## Component Integration

```
┌─────────────────────────────────────────────────────────────┐
│                    React Components                          │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │  HealthOfficerDashboard.tsx                        │    │
│  │  ┌──────────────────────────────────────────────┐ │    │
│  │  │  import { getDatabaseClient }                 │ │    │
│  │  │  const dbClient = getDatabaseClient(user)     │ │    │
│  │  │                                                │ │    │
│  │  │  if (!dbClient) {                             │ │    │
│  │  │    // Demo: localStorage operations           │ │    │
│  │  │  } else {                                      │ │    │
│  │  │    // Production: Supabase operations         │ │    │
│  │  │  }                                             │ │    │
│  │  └──────────────────────────────────────────────┘ │    │
│  └────────────────────────────────────────────────────┘    │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │  AdultDashboard.tsx                                │    │
│  │  ┌──────────────────────────────────────────────┐ │    │
│  │  │  // Same pattern as above                     │ │    │
│  │  │  getDatabaseClient() → route to correct DB    │ │    │
│  │  └──────────────────────────────────────────────┘ │    │
│  └────────────────────────────────────────────────────┘    │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │  ChildDashboard.tsx                                │    │
│  │  ┌──────────────────────────────────────────────┐ │    │
│  │  │  // Same pattern as above                     │ │    │
│  │  │  getDatabaseClient() → route to correct DB    │ │    │
│  │  └──────────────────────────────────────────────┘ │    │
│  └────────────────────────────────────────────────────┘    │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Storage Structure

### Demo Database (localStorage)

```
localStorage
├── emec_auth_v1                    // Current demo user session
├── emec_audit_v1                   // Audit log
├── demo_KOT2025A001_records        // Kevin's medical records
├── demo_KOT2025A001_medications    // Kevin's medications
├── demo_ADM2025D004_patient_updates_demo-patient-1  // Dr. Omondi's updates
└── demo_ADM2025D004_patient_updates_demo-patient-2  // Dr. Omondi's updates
```

### Production Database (Supabase)

```
Supabase PostgreSQL
├── auth.users                      // Authentication users
├── public.profiles                 // User profiles
│   ├── user_id (FK to auth.users)
│   ├── emec_id
│   ├── full_name
│   ├── account_type
│   └── ...
├── public.medical_updates          // Medical records
│   ├── id
│   ├── patient_id (FK to profiles)
│   ├── update_type
│   ├── title
│   ├── data (JSONB)
│   ├── officer_name
│   └── created_at
├── public.prescriptions            // Prescriptions
└── public.appointments             // Appointments
```

## Decision Tree

```
                    START
                      │
                      ▼
              ┌───────────────┐
              │ User Logged   │
              │ In?           │
              └───────┬───────┘
                      │
          ┌───────────┴───────────┐
          │                       │
          NO                     YES
          │                       │
          ▼                       ▼
    ┌─────────┐         ┌─────────────────┐
    │  Deny   │         │ Check EMEC ID   │
    │ Access  │         │ in demoUsers.ts │
    └─────────┘         └────────┬────────┘
                                 │
                     ┌───────────┴───────────┐
                     │                       │
                   FOUND                  NOT FOUND
                     │                       │
                     ▼                       ▼
            ┌─────────────────┐    ┌─────────────────┐
            │  DEMO USER      │    │ PRODUCTION USER │
            │  isLiveUser=false│   │ isLiveUser=true │
            └────────┬────────┘    └────────┬────────┘
                     │                       │
                     ▼                       ▼
            ┌─────────────────┐    ┌─────────────────┐
            │  localStorage   │    │    Supabase     │
            │  Operations     │    │   Operations    │
            └─────────────────┘    └─────────────────┘
```

## Key Identifiers

### Demo Users (Predefined)
```
┌──────────┬─────────────────┬──────────────┬────────────┐
│ Role     │ Name            │ EMEC ID      │ Database   │
├──────────┼─────────────────┼──────────────┼────────────┤
│ Child    │ Kevin Otieno    │ KOT2025A001  │ localStorage│
│ Teen     │ Faith Achieng   │ FAC2025A002  │ localStorage│
│ Adult    │ James Mwangi    │ AJM2025B002  │ localStorage│
│ Parent   │ Grace Achieng   │ GAC2025C003  │ localStorage│
│ Admin    │ Dr. Omondi      │ ADM2025D004  │ localStorage│
└──────────┴─────────────────┴──────────────┴────────────┘
```

### Production Users (Dynamic)
```
┌──────────┬─────────────────┬──────────────┬────────────┐
│ Role     │ Name            │ EMEC ID      │ Database   │
├──────────┼─────────────────┼──────────────┼────────────┤
│ Any      │ User Registered │ Generated    │ Supabase   │
│ Any      │ User Registered │ Generated    │ Supabase   │
│ Any      │ User Registered │ Generated    │ Supabase   │
│ ...      │ ...             │ ...          │ Supabase   │
└──────────┴─────────────────┴──────────────┴────────────┘
```

## Summary

```
┌─────────────────────────────────────────────────────────────┐
│                    KEY PRINCIPLES                            │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  1. ONE ROUTER - All database decisions go through          │
│     databaseRouter.ts                                        │
│                                                              │
│  2. TWO DATABASES - Demo (localStorage) and Production      │
│     (Supabase) never mix                                     │
│                                                              │
│  3. CLEAR SEPARATION - isLiveUser flag determines routing   │
│                                                              │
│  4. FULL LOGGING - All operations log with [DB ROUTER]      │
│                                                              │
│  5. TYPE SAFE - Full TypeScript support throughout          │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```
