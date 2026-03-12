# Background Color Feature - Testing Guide

## ✅ Server Status
- Dev server running at: http://localhost:8080/
- Build completed successfully
- All changes deployed

## How to Test

### Step 1: Open the App
1. Open browser and go to: http://localhost:8080/
2. Open browser console (Press F12)
3. Go to Console tab

### Step 2: Login
Login with any demo account:
- Child: `KOT2025A001` / `kevin2026`
- Teen: `FAC2025A002` / `faith2025`
- Adult: `AJM2025B002` / `james2025`
- Parent: `GAC2025C003` / `grace2025`
- Admin: `ADM2025D004` / `admin2025`

### Step 3: Navigate to Settings
1. Click on the Settings icon (gear icon) in navigation
2. Or go directly to: http://localhost:8080/settings

### Step 4: Find Background Color Section
1. Scroll down to "Appearance" section
2. You should see "Background Color" with a grid of color options
3. Each color shows a preview circle and name

### Step 5: Test Color Change
1. Click on "Warm Beige" (yellow/beige color)
2. **Expected Results**:
   - Toast notification appears: "Background Updated - Changed to Warm Beige"
   - Console shows: `[SETTINGS] Changing background to: warm Warm Beige`
   - Console shows: `[THEME] Applied background: warm Warm Beige`
   - **Background color changes to light beige immediately**
   - Checkmark appears on selected color

### Step 6: Test Other Colors
Try clicking each color:
- 🤍 Default (white)
- 🟡 Warm Beige (light yellow)
- 🔵 Cool Blue (light blue)
- 🟢 Fresh Mint (light green)
- 🟣 Soft Lavender (light purple)
- 🟠 Gentle Peach (light orange)
- 🌸 Light Rose (light pink)
- 🌿 Calm Sage (light green)
- 🌊 Clear Sky (light cyan)
- 🌼 Soft Cream (light yellow)

### Step 7: Verify Persistence
1. Select a color (e.g., "Cool Blue")
2. Navigate to Dashboard
3. Background should still be blue
4. Navigate to other pages (Games, Education, etc.)
5. Background should remain blue on all pages
6. Logout and login again
7. Background should still be blue

### Step 8: Test Reset
1. Go back to Settings
2. Click "Reset" button
3. Background should return to default white
4. Toast notification: "Reset to Default"

## What Should Happen

### Visual Changes
- ✅ Background color changes immediately when clicking a color
- ✅ All text remains readable (high contrast)
- ✅ Medical records are clear
- ✅ Cards and components are visible
- ✅ Navigation is readable
- ✅ Buttons are visible

### Console Logs
You should see these logs when clicking a color:
```
[SETTINGS] Changing background to: warm Warm Beige
[THEME] Applied background: warm Warm Beige
```

### localStorage
Check localStorage (F12 → Application → Local Storage):
- Key: `emec_background_color`
- Value: Selected color ID (e.g., "warm", "cool", "mint")

## Troubleshooting

### If background doesn't change:

1. **Check Console for Errors**:
   - Press F12
   - Look for red error messages
   - Share any errors you see

2. **Check if Logs Appear**:
   - Click a color
   - Look for `[SETTINGS]` and `[THEME]` logs
   - If logs appear but no color change, there's a CSS issue
   - If no logs appear, there's a JavaScript issue

3. **Hard Refresh**:
   - Press Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
   - This clears cache and reloads

4. **Clear localStorage**:
   ```javascript
   // In browser console
   localStorage.removeItem('emec_background_color');
   location.reload();
   ```

5. **Check Body Style**:
   ```javascript
   // In browser console
   console.log(document.body.style.backgroundColor);
   ```
   Should show a color value when a color is selected

## Technical Details

### How It Works

1. **ThemeContext** manages the selected color
2. **BackgroundWrapper** applies the color using:
   - Tailwind classes (e.g., `bg-amber-50`)
   - Inline styles on document.body
3. **localStorage** persists the selection
4. **useEffect** applies color on mount and change

### Files Involved
- `src/contexts/ThemeContext.tsx` - State management
- `src/components/layout/BackgroundWrapper.tsx` - Color application
- `src/pages/Settings.tsx` - UI for color selection
- `src/App.tsx` - Wraps app with providers

### Color Values
All colors use light shades for readability:
- Warm Beige: `#fffbeb` (bg-amber-50)
- Cool Blue: `#eff6ff` (bg-blue-50)
- Fresh Mint: `#ecfdf5` (bg-emerald-50)
- Soft Lavender: `#faf5ff` (bg-purple-50)
- Gentle Peach: `#fff7ed` (bg-orange-50)
- Light Rose: `#fdf2f8` (bg-pink-50)
- Calm Sage: `#f0fdf4` (bg-green-50)
- Clear Sky: `#ecfeff` (bg-cyan-50)
- Soft Cream: `#fefce8` (bg-yellow-50)

## Expected Behavior Summary

✅ **Working Correctly**:
- Click color → Background changes immediately
- Toast notification appears
- Console logs appear
- Color persists across pages
- Color persists after logout/login
- Reset button works
- All text remains readable

❌ **Not Working**:
- No visual change when clicking colors
- No console logs
- Background resets on page navigation
- Text becomes unreadable
- Errors in console

## Current Status

- ✅ Build successful
- ✅ Dev server running
- ✅ Code deployed
- ✅ Ready for testing

**Test URL**: http://localhost:8080/

Please test and let me know:
1. Do you see the color options in Settings?
2. Do console logs appear when clicking?
3. Does the background color change?
4. Does it persist across pages?
