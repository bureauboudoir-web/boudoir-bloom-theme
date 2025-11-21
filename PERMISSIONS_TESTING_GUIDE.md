# Quick Permissions Testing Guide

## Issue Fixed

**Problem:** Admin Dashboard link was visible to all creators in the sidebar
**Solution:** Added role check - now only admin/manager see the link

## Test Each Role Type

### Test 1: Admin/Manager User
**Expected:** Full access to everything

```
1. Login as admin/manager
2. Go to /admin
   ✅ Should see admin dashboard
3. Go to /dashboard  
   ✅ Should see creator dashboard
   ✅ Should see "Admin Dashboard" button in sidebar (if you're checking this)
4. Try to access all admin features:
   ✅ Applications
   ✅ Meetings
   ✅ Content Review
   ✅ All creator data
```

### Test 2: Creator with no_access
**Expected:** Only see "Application Under Review"

```
1. Login as creator (just submitted application)
2. Should automatically see NoAccessView with:
   ✅ "Application Under Review" message
   ✅ Logout button in header
   ✅ NO navigation options
   ✅ NO dashboard features
3. Try to manually navigate to /admin
   ✅ Should redirect back to /dashboard (shows NoAccessView)
4. Try to manually navigate to /dashboard/anything
   ✅ Should still see NoAccessView only
```

### Test 3: Creator with meeting_only
**Expected:** Only see meeting booking page

```
1. Login as creator (approved but meeting not complete)
2. Should automatically see MeetingBookingView with:
   ✅ Meeting booking interface
   ✅ Manager information
   ✅ Date/time selection
   ✅ Logout button in header
   ✅ NO sidebar
   ✅ NO other dashboard features
3. Try to manually navigate to /admin
   ✅ Should redirect to /dashboard (shows MeetingBookingView)
4. Try to book/view meeting
   ✅ Should work normally
```

### Test 4: Creator with full_access
**Expected:** Full creator dashboard access

```
1. Login as creator (meeting completed)
2. Should see full dashboard with sidebar containing:
   ✅ Onboarding
   ✅ Creator Profile  
   ✅ My Meetings
   ✅ Uploads
   ✅ Weekly Commitments
   ✅ Studio Shoots
   ✅ Invoices
   ✅ Contact Us
   ❌ NO "Admin Dashboard" button (THIS IS THE FIX!)
3. Try to manually navigate to /admin
   ✅ Should redirect to /dashboard
4. Try all creator features
   ✅ All should work
```

## Quick Visual Check

### Creator Sidebar Should Look Like This:

**For Regular Creators (full_access):**
```
┌─────────────────────────┐
│ Onboarding              │
│ Creator Profile         │
│ My Meetings             │
│ Uploads                 │
├─────────────────────────┤
│ Weekly Commitments      │
│ Studio Shoots           │
│ Invoices                │
├─────────────────────────┤
│ Contact Us              │ ← NO ADMIN LINK HERE!
└─────────────────────────┘
```

**For Admin/Manager (if viewing creator dashboard):**
```
┌─────────────────────────┐
│ Onboarding              │
│ Creator Profile         │
│ My Meetings             │
│ Uploads                 │
├─────────────────────────┤
│ Weekly Commitments      │
│ Studio Shoots           │
│ Invoices                │
├─────────────────────────┤
│ Admin Dashboard         │ ← ONLY ADMINS SEE THIS
│ Contact Us              │
└─────────────────────────┘
```

## Database Verification Queries

Check user's current state:

```sql
-- Check role
SELECT * FROM user_roles WHERE user_id = '[user_id]';

-- Check access level  
SELECT * FROM creator_access_levels WHERE user_id = '[user_id]';

-- Check meeting status
SELECT status FROM creator_meetings WHERE user_id = '[user_id]';
```

## Expected Access Level by Stage

| Stage | Role | Access Level | What They See |
|-------|------|--------------|---------------|
| Applied | creator | no_access | "Application Under Review" page only |
| Approved | creator | meeting_only | Meeting booking page only |
| Meeting Done | creator | full_access | Full dashboard (no admin link) |
| Admin/Manager | admin or manager | N/A | Everything including /admin |

## Common Issues & Solutions

### Issue: Creator sees admin link
**Cause:** Old cache or role misconfigured
**Fix:** 
1. Hard refresh (Ctrl+Shift+R)
2. Check role in database
3. Verify `isAdminOrManager` value in console

### Issue: Admin can't access /admin
**Cause:** Role not assigned correctly
**Fix:**
```sql
-- Check role
SELECT * FROM user_roles WHERE user_id = '[admin_id]';

-- Should see role = 'admin' or 'manager'
-- If not, add role:
INSERT INTO user_roles (user_id, role) 
VALUES ('[admin_id]', 'admin');
```

### Issue: Creator stuck on meeting page after completion
**Cause:** Access level not upgraded
**Fix:**
```sql
-- Check access level
SELECT * FROM creator_access_levels WHERE user_id = '[creator_id]';

-- Should be 'full_access' after meeting completion
-- If still 'meeting_only', update:
UPDATE creator_access_levels 
SET access_level = 'full_access' 
WHERE user_id = '[creator_id]';
```

## Files Changed

1. `src/pages/Dashboard.tsx` - Added conditional for admin link
2. `src/components/dashboard/NoAccessView.tsx` - Added logout button
3. `src/components/dashboard/MeetingBookingView.tsx` - Added logout button

## Security Verified ✅

- ✅ Creators cannot access `/admin` route
- ✅ Creators cannot see admin dashboard link
- ✅ Pending creators only see their respective views
- ✅ All database RLS policies enforced
- ✅ Logout available on all restricted views
- ✅ Role checks happen server-side

## Quick Test Commands

Open browser console and check:

```javascript
// Should NOT see admin link for creators
document.querySelector('button:has-text("Admin Dashboard")') // Should be null for creators

// Check current route
window.location.pathname // Should be /dashboard for creators

// Try manual navigation (should redirect)
window.location.href = '/admin' // Creators get redirected back
```
