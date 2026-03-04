

## Diagnosis: Signup Form Hangs on "Creating Account..."

### Root Cause

There's a **race condition** between two competing profile-fetch loops:

1. **`ProductionSignupForm.waitForProfile`** — 15 retries × 600ms = ~9 seconds
2. **`AuthContext.onAuthStateChange` → `fetchProfileWithRetry`** — 8 retries × 500ms = ~4 seconds

When signup completes, `onAuthStateChange` fires with `SIGNED_IN`. The AuthContext's `fetchProfileWithRetry` succeeds, sets `currentUser` (making `isAuthenticated = true`), which likely causes the login page to redirect or re-render — **unmounting the signup form mid-execution**. The form's `setStep('success')` never fires because the component is gone.

However, the redirect to `/dashboard` also isn't completing cleanly because the `AdultDashboard` may crash for new users, or the navigation happens while async operations are still pending.

### Plan

**1. Skip `waitForProfile` in the signup form — let AuthContext handle it**

In `ProductionSignupForm.tsx`, after signup succeeds (`data.user` exists):
- Set `createdEmecId` immediately using a fallback
- Call `setStep('success')` immediately
- Remove the `waitForProfile` call entirely — the AuthContext listener already handles profile loading
- The success screen shows the EMEC ID and "Go to Dashboard" button, giving the trigger time to complete

**2. Add early EMEC ID retrieval from the signup response**

Since the trigger creates the profile synchronously during the signup transaction, do a single quick profile fetch (no retry loop) just to grab the EMEC ID for display. If it fails, use the fallback ID.

**3. Prevent AuthContext from navigating away during signup**

Add a guard so that `onAuthStateChange` doesn't set `currentUser` if the signup form is still showing. This can be done by:
- Having the signup form set a temporary flag (e.g., `sessionStorage.setItem('signup_in_progress', 'true')`)
- Clearing it when the success screen mounts or when "Go to Dashboard" is clicked
- AuthContext checks this flag before auto-setting the user

### Technical Details

**File: `src/components/auth/ProductionSignupForm.tsx`**
- Remove `waitForProfile` retry loop from `signUp` function
- After `supabase.auth.signUp` succeeds, do ONE quick profile fetch (no loop)
- Immediately proceed to success screen regardless of profile fetch result
- Profile update still runs but doesn't block the UI

**File: `src/contexts/AuthContext.tsx`**  
- In `onAuthStateChange`, check for a `signup_in_progress` flag
- If set, skip auto-setting `currentUser` to prevent premature navigation
- The "Go to Dashboard" button will clear the flag and navigate manually

This approach ensures the signup form always reaches the success screen within ~1 second instead of hanging for 9+ seconds.

