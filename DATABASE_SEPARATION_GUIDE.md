# Database Separation Implementation Guide

## Overview

The Health Companion App now implements a **dual-database architecture** that separates demo accounts from production accounts while maintaining full functionality for both.

## Architecture

### Demo Database (localStorage)
- **Storage**: Browser localStorage
- **Users**: All predefined demo accounts
- **Data**: Stored locally in the browser
- **Purpose**: Testing, demonstrations, and offline functionality

### Production Database (Supabase)
- **Storage**: Supabase PostgreSQL database
- **Users**: All newly registered accounts
- **Data**: Stored in cloud database
- **Purpose**: Real user data with authentication and persistence

## Database Routing Logic

### Key Files

#### 1. `src/integrations/supabase/databaseRouter.ts`
**Purpose**: Central routing logic for database operations

**Key Functions**:
- `isDemoUser(user)` - Checks if user is a demo account
- `isDemoEmecId(emecId)` - Checks if EMEC ID belongs to demo account
- `getDatabaseClient(user)` - Returns appropriate database client
- `dbOperation(user, operation)` - Wrapper for database operations
- `getDemoStorageKey(user, dataType)` - Generates localStorage keys
- `getUserDatabaseType(user)` - Returns 'demo' or 'production'

**Example Usage**:
```typescript
import { getDatabaseClient, isDemoUser } from '@/integrations/supabase/databaseRouter';

const dbClient = getDatabaseClient(currentUser);

if (!dbClient) {
  // Demo user - use localStorage
  const data = localStorage.getItem(key);
} else {
  // Production user - use Supabase
  const { data } = await dbClient.from('table').select();
}
```

#### 2. `src/contexts/AuthContext.tsx`
**Purpose**: Authentication and user session management

**Database Routing Points**:
- **Line 6**: Import database router
- **Line 52-62**: Production database profile fetching
- **Line 65-95**: Production user object building
- **Line 98-107**: Production session loading
- **Line 110-145**: Auth state change handling (production vs demo)
- **Line 163-172**: Demo user persistence to localStorage
- **Line 180-189**: Demo login function
- **Line 192-201**: Demo EMEC ID login
- **Line 204-215**: Logout (handles both databases)
- **Line 218-228**: Demo account switching
- **Line 231-250**: Demo user registration

**Console Logging**:
All database operations log to console with `[DB ROUTER]` prefix for debugging.

#### 3. `src/components/dashboards/HealthOfficerDashboard.tsx`
**Purpose**: Health officer dashboard with patient management

**Database Routing Points**:
- **Line 6**: Import database router
- **Line 73-110**: `fetchPatients()` - Loads patients from appropriate database
- **Line 113-138**: `fetchPatientUpdates()` - Loads patient updates
- **Line 250-310**: `handleSaveUpdate()` - Saves medical updates

**Demo Data**:
- Demo patients are hardcoded for demonstration
- Demo updates are stored in localStorage with patient-specific keys

## Demo Accounts

All demo accounts are defined in `src/data/demoUsers.ts`:

| Account Type | Name | EMEC ID | Password |
|-------------|------|---------|----------|
| Child | Kevin Otieno | KOT2025A001 | kevin2026 |
| Teen | Faith Achieng | FAC2025A002 | faith2025 |
| Adult | James Mwangi | AJM2025B002 | james2025 |
| Parent | Grace Achieng | GAC2025C003 | grace2025 |
| Admin | Dr. Omondi Wekesa | ADM2025D004 | admin2025 |

## Production Accounts

### Registration
- New accounts are registered through `ProductionSignupForm.tsx`
- Registration creates Supabase auth user + profile
- All data is stored in Supabase database

### Login
- Production users login through Supabase authentication
- Session is managed by Supabase
- `isLiveUser` flag is set to `true`

## Data Flow

### Demo User Flow
```
1. User logs in with demo EMEC ID
2. AuthContext checks demo accounts
3. User object loaded from demoUsers.ts
4. isLiveUser = false
5. All data operations use localStorage
6. Console logs: "[DB ROUTER] Demo user..."
```

### Production User Flow
```
1. User registers/logs in through Supabase
2. AuthContext receives Supabase session
3. Profile fetched from Supabase
4. isLiveUser = true
5. All data operations use Supabase
6. Console logs: "[DB ROUTER] Production user..."
```

## Features Preserved

All features work identically for both demo and production users:

✅ **BMR Calculator** - Client-side calculation (no database)
✅ **First Aid Guidance** - Static content (no database)
✅ **Multilingual Support** - Client-side translation (no database)
✅ **Health Games** - Points stored appropriately per user type
✅ **Education Hub** - Content access based on user age
✅ **Medical Records** - Stored in appropriate database
✅ **Medication Reminders** - Stored in appropriate database
✅ **Quizzes** - Results stored in appropriate database

## localStorage Keys

### Demo User Data
- `emec_auth_v1` - Current demo user session
- `emec_audit_v1` - Audit log for demo users
- `demo_{EMEC_ID}_{dataType}` - User-specific data
- `demo_{EMEC_ID}_patient_updates_{patientId}` - Medical updates
- `records_{userId}` - Medical records

### Production User Data
- Supabase manages sessions (no localStorage for auth)
- All data in Supabase tables:
  - `profiles` - User profiles
  - `medical_updates` - Medical records
  - `prescriptions` - Prescriptions
  - `appointments` - Appointments

## Testing

### Test Demo Account
```typescript
// Login as demo admin
loginWithEmecId('ADM2025D004', 'admin2025');

// Check console for:
// [DB ROUTER] Demo EMEC login: Dr. Omondi Wekesa (demo database)

// Add patient update - should save to localStorage
// Check console for:
// [DB ROUTER] Saved medical update to demo database (localStorage)
```

### Test Production Account
```typescript
// Register new account through signup form
// Login with new credentials

// Check console for:
// [DB ROUTER] Loaded production session: {name}

// Add patient update - should save to Supabase
// Check console for:
// [DB ROUTER] Saved medical update to production database (Supabase)
```

## Debugging

### Console Logs
All database routing operations log with `[DB ROUTER]` prefix:
- User login/logout
- Database operations
- Data loading
- Data saving

### Check User Type
```typescript
import { getUserDatabaseType } from '@/integrations/supabase/databaseRouter';

console.log(getUserDatabaseType(currentUser)); // 'demo' or 'production'
```

### Verify Database Client
```typescript
import { getDatabaseClient } from '@/integrations/supabase/databaseRouter';

const client = getDatabaseClient(currentUser);
if (client) {
  console.log('Using production database (Supabase)');
} else {
  console.log('Using demo database (localStorage)');
}
```

## Migration Path

### Adding Database Routing to New Components

1. **Import the router**:
```typescript
import { getDatabaseClient, getDemoStorageKey } from '@/integrations/supabase/databaseRouter';
```

2. **Check user type**:
```typescript
const dbClient = getDatabaseClient(currentUser);
```

3. **Handle both cases**:
```typescript
if (!dbClient) {
  // Demo database logic (localStorage)
  const key = getDemoStorageKey(currentUser, 'dataType');
  const data = localStorage.getItem(key);
} else {
  // Production database logic (Supabase)
  const { data } = await dbClient.from('table').select();
}
```

4. **Add console logging**:
```typescript
console.log('[DB ROUTER] Operation completed for', getUserDatabaseType(currentUser), 'user');
```

## Security Considerations

### Demo Database
- ✅ No sensitive data stored
- ✅ Data is local to browser
- ✅ No authentication required
- ⚠️ Data can be cleared by user
- ⚠️ Not suitable for real patient data

### Production Database
- ✅ Supabase authentication required
- ✅ Row-level security policies
- ✅ Data encrypted in transit and at rest
- ✅ Audit logging
- ✅ HIPAA-compliant infrastructure

## Future Enhancements

### Potential Improvements
1. **Offline Sync**: Sync production data to localStorage for offline access
2. **Data Migration**: Tool to migrate demo data to production
3. **Hybrid Mode**: Allow production users to access demo features
4. **Analytics**: Track usage patterns for demo vs production
5. **Admin Dashboard**: View demo vs production user statistics

## Troubleshooting

### Issue: Demo user data not persisting
**Solution**: Check browser localStorage is enabled and not full

### Issue: Production user can't save data
**Solution**: Verify Supabase connection and authentication

### Issue: Wrong database being used
**Solution**: Check console logs for `[DB ROUTER]` messages to verify routing

### Issue: Demo accounts not working
**Solution**: Verify `src/data/demoUsers.ts` is properly imported

## Summary

The database separation is now complete with:
- ✅ Demo accounts use localStorage
- ✅ Production accounts use Supabase
- ✅ All features work for both user types
- ✅ Clear separation with console logging
- ✅ Easy to extend to new components
- ✅ Maintains backward compatibility
