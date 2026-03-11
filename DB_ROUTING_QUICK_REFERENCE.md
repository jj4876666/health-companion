# Database Routing - Quick Reference Card

## 🎯 Quick Decision Tree

```
Is user logged in?
├─ YES → Check isLiveUser flag
│   ├─ isLiveUser = true → PRODUCTION DATABASE (Supabase)
│   └─ isLiveUser = false → DEMO DATABASE (localStorage)
└─ NO → No database access
```

## 📋 Code Templates

### Template 1: Fetch Data
```typescript
import { getDatabaseClient } from '@/integrations/supabase/databaseRouter';

const fetchData = async () => {
  const dbClient = getDatabaseClient(currentUser);
  
  if (!dbClient) {
    // DEMO: Load from localStorage
    const data = localStorage.getItem(`demo_${currentUser.emecId}_mydata`);
    return data ? JSON.parse(data) : [];
  } else {
    // PRODUCTION: Load from Supabase
    const { data } = await dbClient.from('my_table').select();
    return data || [];
  }
};
```

### Template 2: Save Data
```typescript
import { getDatabaseClient, getDemoStorageKey } from '@/integrations/supabase/databaseRouter';

const saveData = async (newData) => {
  const dbClient = getDatabaseClient(currentUser);
  
  if (!dbClient) {
    // DEMO: Save to localStorage
    const key = getDemoStorageKey(currentUser, 'mydata');
    localStorage.setItem(key, JSON.stringify(newData));
    console.log('[DB ROUTER] Saved to demo database');
  } else {
    // PRODUCTION: Save to Supabase
    await dbClient.from('my_table').insert(newData);
    console.log('[DB ROUTER] Saved to production database');
  }
};
```

### Template 3: Update Data
```typescript
const updateData = async (id, updates) => {
  const dbClient = getDatabaseClient(currentUser);
  
  if (!dbClient) {
    // DEMO: Update in localStorage
    const key = getDemoStorageKey(currentUser, 'mydata');
    const existing = JSON.parse(localStorage.getItem(key) || '[]');
    const updated = existing.map(item => 
      item.id === id ? { ...item, ...updates } : item
    );
    localStorage.setItem(key, JSON.stringify(updated));
  } else {
    // PRODUCTION: Update in Supabase
    await dbClient.from('my_table').update(updates).eq('id', id);
  }
};
```

## 🔍 Helper Functions

| Function | Purpose | Returns |
|----------|---------|---------|
| `isDemoUser(user)` | Check if user is demo | boolean |
| `isDemoEmecId(emecId)` | Check if EMEC ID is demo | boolean |
| `getDatabaseClient(user)` | Get database client | Supabase \| null |
| `getDemoStorageKey(user, type)` | Generate localStorage key | string |
| `getUserDatabaseType(user)` | Get database type | 'demo' \| 'production' |

## 🎨 Console Log Format

Always use this format for consistency:
```typescript
console.log('[DB ROUTER] {action} for {user type} user');

// Examples:
console.log('[DB ROUTER] Loaded demo patients from localStorage');
console.log('[DB ROUTER] Saved to production database (Supabase)');
console.log('[DB ROUTER] Demo login: Kevin Otieno (demo database)');
```

## 🔐 Demo Account EMEC IDs

Quick reference for testing:
- `KOT2025A001` - Child (Kevin)
- `FAC2025A002` - Teen (Faith)
- `AJM2025B002` - Adult (James)
- `GAC2025C003` - Parent (Grace)
- `ADM2025D004` - Admin (Dr. Omondi)

## ⚡ Common Patterns

### Pattern: Check User Type Before Operation
```typescript
if (isDemoUser(currentUser)) {
  // Demo-specific logic
} else {
  // Production-specific logic
}
```

### Pattern: Conditional Database Query
```typescript
const data = await dbOperation(currentUser, async (client) => {
  if (!client) return getDemoData();
  return await client.from('table').select();
});
```

### Pattern: Storage Key Generation
```typescript
// For demo users only
const key = getDemoStorageKey(currentUser, 'records');
// Result: "demo_KOT2025A001_records"
```

## 🚨 Important Rules

1. **Never mix databases** - Demo users should never touch Supabase
2. **Always log operations** - Use `[DB ROUTER]` prefix
3. **Check client first** - Always call `getDatabaseClient()` before operations
4. **Handle both cases** - Every database operation needs demo + production paths
5. **Preserve demo data** - Never delete or modify demo account definitions

## 📊 Testing Checklist

- [ ] Demo user can login
- [ ] Demo user data saves to localStorage
- [ ] Demo user data loads from localStorage
- [ ] Production user can register
- [ ] Production user can login
- [ ] Production user data saves to Supabase
- [ ] Production user data loads from Supabase
- [ ] Console logs show correct database type
- [ ] No cross-contamination between databases

## 🔧 Debugging Commands

```typescript
// In browser console:

// Check current user type
console.log(getUserDatabaseType(currentUser));

// Check if demo user
console.log(isDemoUser(currentUser));

// View localStorage keys
Object.keys(localStorage).filter(k => k.startsWith('demo_'));

// Clear demo data (careful!)
Object.keys(localStorage)
  .filter(k => k.startsWith('demo_'))
  .forEach(k => localStorage.removeItem(k));
```

## 📁 File Locations

| File | Purpose |
|------|---------|
| `src/integrations/supabase/databaseRouter.ts` | Core routing logic |
| `src/contexts/AuthContext.tsx` | Auth + routing integration |
| `src/components/dashboards/HealthOfficerDashboard.tsx` | Example implementation |
| `src/data/demoUsers.ts` | Demo account definitions |

## 💡 Pro Tips

1. **Use TypeScript** - The router is fully typed
2. **Check console** - All operations log their database type
3. **Test both paths** - Always test with demo AND production users
4. **Keep it simple** - Use the provided templates
5. **Document changes** - Add `// DATABASE ROUTING:` comments

---

**Need more details?** See `DATABASE_SEPARATION_GUIDE.md` for comprehensive documentation.
