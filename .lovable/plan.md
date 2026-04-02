
## Phase 1: Fix Existing Build Errors
Fix the 10+ TypeScript errors blocking the build before making any structural changes.

## Phase 2: Remove Demo Data Files
Delete demo-specific data files:
- `src/data/demoUsers.ts` — hardcoded Kevin, Faith, James, Grace, Dr. Omondi accounts
- `src/data/demoAuditLog.ts` — fake audit log entries
- `src/data/demoQuizzes.ts` — if demo-only

## Phase 3: Remove Demo Context & Controls
- Delete `src/contexts/DemoContext.tsx` — demo mode state management
- Delete `src/components/demo/DemoControls.tsx` — role/age switching panel
- Remove all `isDemoMode` / `useDemoContext` references from components

## Phase 4: Update Auth Flow
- Update `AuthContext.tsx` to remove demo user login logic (localStorage-based)
- Update `LoginPage.tsx` / `EnhancedLoginPage.tsx` to remove demo account references
- Keep dual login (Email + EMEC ID) but both routes authenticate against the real database
- EMEC ID login → query `profiles` table by `emec_id`, verify password via Supabase Auth

## Phase 5: Update Database Router
- Remove or simplify `src/integrations/supabase/databaseRouter.ts` — no more demo/production split
- All users route to Supabase (real database)

## Phase 6: Update Dashboards
- Remove demo data fallbacks from `AdultDashboard.tsx`, `ChildDashboard.tsx`, `TeenDashboard.tsx`, `ParentDashboard.tsx`, `AdminDashboard.tsx`
- All dashboards fetch from real database only
- Empty states shown when no data exists

## Phase 7: Update Health Officer Dashboard
- Remove demo patient list
- Fetch only real patients from `profiles` table
- Keep medical update functionality (already working with real DB)

## Phase 8: Clean Up
- Remove leftover demo markdown files (AUDIT_LOG_FEATURE.md, etc.)
- Update `TEST_ACCOUNTS.md` to reflect production-only accounts
- Remove `src/data/healthFacilities.ts` if demo-only

## What Stays
- All role-based dashboards (Child, Teen, Adult, Parent, Admin)
- Dual login (Email + EMEC ID) — both hitting real database
- Real-time medical updates via Supabase
- All UI components and pages
- Education content, games, calculators (content-only, not demo-dependent)
