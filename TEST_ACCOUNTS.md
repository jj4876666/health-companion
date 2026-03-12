# Test Accounts - Verification Guide

## Demo Accounts (localStorage - No Internet Required)

### 1. Child Account (Age 9)
- **EMEC ID**: `KOT2025A001`
- **Password**: `kevin2026`
- **Name**: Kevin Otieno
- **Dashboard**: Child Dashboard (games, simple interface)
- **Features**: Educational games, health tracking, parental controls

### 2. Teen Account (Age 14)
- **EMEC ID**: `FAC2025A002`
- **Password**: `faith2025`
- **Name**: Faith Achieng
- **Dashboard**: Teen Dashboard (age-appropriate content)
- **Features**: Puberty education, mental health, more independence

### 3. Adult Account (Age 32)
- **EMEC ID**: `AJM2025B002`
- **Password**: `james2025`
- **Name**: James Mwangi
- **Dashboard**: Adult Dashboard (full features)
- **Features**: Full medical records, medication tracking, health calculators

### 4. Parent Account
- **EMEC ID**: `GAC2025C003`
- **Password**: `grace2025`
- **Name**: Grace Achieng
- **Dashboard**: Parent Dashboard (child management)
- **Features**: Manage children, approve requests, view child records

### 5. Health Officer/Admin Account
- **EMEC ID**: `ADM2025D004`
- **Password**: `admin2025`
- **Name**: Dr. Omondi Wekesa
- **Dashboard**: Admin Dashboard (patient management)
- **Features**: View/edit patient records, create medical updates, facility management
- **Facility**: Mbita Sub-County Hospital

## Testing Checklist

### ✅ Login Test
1. Open http://localhost:8080/
2. Wait for splash screen (1.5 seconds first time, then skipped)
3. Click "Login with EMEC ID"
4. Enter credentials from above
5. Should login instantly (demo accounts)

### ✅ Child Account Test
- [ ] Login with KOT2025A001 / kevin2026
- [ ] Dashboard shows child-friendly interface
- [ ] Games are accessible
- [ ] Educational content is age-appropriate
- [ ] Parental controls are active

### ✅ Teen Account Test
- [ ] Login with FAC2025A002 / faith2025
- [ ] Dashboard shows teen interface
- [ ] Puberty/mental health content accessible
- [ ] More features than child account
- [ ] Still has some parental controls

### ✅ Adult Account Test
- [ ] Login with AJM2025B002 / james2025
- [ ] Dashboard shows full adult interface
- [ ] All features accessible
- [ ] Medical records visible
- [ ] BMR calculator works
- [ ] First aid guide accessible

### ✅ Parent Account Test
- [ ] Login with GAC2025C003 / grace2025
- [ ] Dashboard shows linked children
- [ ] Can view child records
- [ ] Pending approvals visible
- [ ] Can manage child accounts

### ✅ Health Officer Account Test
- [ ] Login with ADM2025D004 / admin2025
- [ ] Dashboard shows patient list
- [ ] Can search patients
- [ ] Can add medical updates
- [ ] Facility name displayed
- [ ] Demo patients visible

## Database Routing Verification

### Demo Accounts (localStorage)
Open browser console (F12) and look for:
```
[DB ROUTER] Demo EMEC login: {name} (demo database)
[DB ROUTER] Loaded demo patients from localStorage
```

### Production Accounts (Supabase)
For new registrations, console should show:
```
[DB ROUTER] Loaded production session: {name}
[DB ROUTER] Loaded production patients from Supabase
```

## Common Issues

### Issue: Login takes too long
- **Expected**: Demo login should be instant
- **Check**: Look for `[DB ROUTER]` logs in console
- **Solution**: Clear browser cache and reload

### Issue: Dashboard not loading
- **Check**: Verify EMEC ID is exactly 11 characters
- **Check**: Password is case-sensitive
- **Solution**: Copy-paste credentials from this file

### Issue: Features not working
- **Check**: Browser console for errors
- **Check**: Network tab for failed requests
- **Solution**: Refresh page or clear localStorage

## Performance Expectations

### First Load
- Splash screen: 1.5 seconds
- Demo login: Instant (0ms)
- Dashboard load: < 500ms
- **Total**: ~2 seconds

### Subsequent Loads (same session)
- Splash screen: Skipped (0ms)
- Demo login: Instant (0ms)
- Dashboard load: < 500ms
- **Total**: < 1 second

## Production Account Testing

### Create New Account
1. Click "Create New Account"
2. Choose account type (Adult/Child/Health Officer)
3. Fill in required fields
4. Submit form
5. Should complete in ~1 second
6. EMEC ID generated automatically

### Production Login
1. Use email and password from registration
2. Should login in ~1 second
3. Data stored in Supabase (cloud)
4. Works across devices

## Browser Console Commands

### Check Current User
```javascript
localStorage.getItem('emec_auth_v1')
```

### Check Demo Data
```javascript
Object.keys(localStorage).filter(k => k.startsWith('demo_'))
```

### Clear All Data
```javascript
localStorage.clear()
sessionStorage.clear()
location.reload()
```

## Support

If any account is not working:
1. Check browser console for errors
2. Verify credentials match exactly
3. Clear browser cache
4. Check `[DB ROUTER]` logs
5. Verify dev server is running

## Notes

- Demo accounts work offline
- Production accounts require internet
- All passwords are case-sensitive
- EMEC IDs must be exactly 11 characters
- Splash screen shows once per session
- Database routing is automatic
