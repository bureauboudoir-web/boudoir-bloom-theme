# Creator Signup Flow - Complete Implementation

## Overview
This document describes the complete creator signup and onboarding flow for Bureau Boudoir.

## Flow Stages

### Stage 1: Application Submission
**Location:** `/signup` page

**What Happens:**
1. Creator fills out application form with:
   - Full Name
   - Email
   - Phone Number
   - Experience Level
2. Form submits to `creator_applications` table with status `pending`
3. Creator receives confirmation email via `send-application-received` edge function
4. Creator is redirected to confirmation page

**Access Level:** No account yet
**Database Changes:**
- New row in `creator_applications` table

---

### Stage 2: Admin Review
**Location:** Admin Dashboard → Applications tab

**What Happens:**
1. Admin sees pending application
2. Admin can:
   - **Approve** → Triggers full approval flow
   - **Decline** → Updates status and optionally sends decline email

**Access Level:** Admin only
**Database Changes:** None until action taken

---

### Stage 3: Application Approval
**Location:** Admin Dashboard → Applications tab
**Edge Function:** `approve-creator-application`

**What Happens:**
1. Admin clicks "Approve"
2. Edge function executes:
   - Creates auth user account (email confirmed automatically)
   - Assigns `creator` role in `user_roles` table
   - Sets access level to `meeting_only` in `creator_access_levels`
   - Creates meeting record with status `not_booked`
   - Updates application status to `approved`
   - Generates password reset link
   - Sends welcome email via `send-meeting-invitation` with:
     - Password reset link
     - Login URL
     - Instructions to book meeting
3. Creator receives email with account setup link

**Access Level:** `meeting_only` (newly created)
**Database Changes:**
- New auth user
- New `user_roles` entry (role: creator)
- New `creator_access_levels` entry (level: meeting_only)
- New `creator_meetings` entry (status: not_booked)
- Updated `creator_applications` (status: approved)

---

### Stage 4: Creator Account Setup
**Location:** Password reset link → `/login`

**What Happens:**
1. Creator clicks password reset link from email
2. Sets up their password
3. Logs in to platform
4. System checks access level = `meeting_only`
5. Creator is shown **MeetingBookingView** (full-page mode)
   - Can only see meeting booking interface
   - No access to dashboard yet

**Access Level:** `meeting_only`
**UI Shown:** Full-page meeting booking interface with logout option

---

### Stage 5: Meeting Booking
**Location:** MeetingBookingView (creator side)

**What Happens:**
1. Creator sees their assigned manager
2. Selects meeting type (online/in-person)
3. Picks available date and time from manager's calendar
4. Clicks "Request Meeting"
5. Meeting record updated:
   - `meeting_date` set
   - `meeting_time` set
   - `meeting_type` set
   - `status` → `pending`
6. Manager receives notification email via `send-manager-meeting-request`

**Access Level:** `meeting_only`
**Database Changes:**
- Updated `creator_meetings` (status: pending, date/time set)

---

### Stage 6: Admin Meeting Confirmation
**Location:** Admin Dashboard → Meetings tab

**What Happens:**
1. Admin sees pending meeting request
2. Admin reviews and clicks "Confirm"
3. Admin provides:
   - Meeting link (if online)
   - OR Meeting location (if in-person)
4. Meeting record updated:
   - `status` → `confirmed`
   - `meeting_link` or `meeting_location` set
5. Creator receives confirmation email via `send-meeting-confirmation`

**Access Level:** Still `meeting_only`
**Database Changes:**
- Updated `creator_meetings` (status: confirmed, link/location set)
**Creator UI:** Meeting shows as "Confirmed" with details

---

### Stage 7: Meeting Takes Place
**In Real Life:** The actual introduction meeting happens

**What Happens:**
- Meeting occurs at scheduled time
- Manager and creator meet (online or in-person)
- Manager can optionally help with initial onboarding using "Assisted Onboarding" feature

**No system changes during actual meeting**

---

### Stage 8: Meeting Completion & Access Grant
**Location:** Admin Dashboard → Meetings tab

**What Happens:**
1. After meeting, admin clicks "Mark as Complete"
2. Admin optionally adds meeting notes
3. System executes:
   - Meeting updated:
     - `status` → `completed`
     - `completed_at` set to current timestamp
     - `meeting_notes` saved
   - Access level upgraded:
     - `creator_access_levels.access_level` → `full_access`
   - Creator receives "Full Access Granted" email via `send-access-granted`

**Access Level:** `full_access` (UPGRADED!)
**Database Changes:**
- Updated `creator_meetings` (status: completed)
- Updated `creator_access_levels` (level: full_access)

---

### Stage 9: Full Dashboard Access
**Location:** `/dashboard` (creator side)

**What Happens:**
1. Creator logs in (or refreshes page)
2. System checks access level = `full_access`
3. Creator now sees **full dashboard** with all features:
   - ✅ Onboarding form (10 steps)
   - ✅ Creator Profile
   - ✅ My Meetings (view only)
   - ✅ Content Uploads
   - ✅ Weekly Commitments
   - ✅ Studio Shoots
   - ✅ Invoices
   - ✅ Contact Support

**Access Level:** `full_access`
**UI Shown:** Complete creator dashboard with all sections

---

## Access Level Logic

### How Access Levels Work
The `useAccessLevel` hook fetches the creator's access level from `creator_access_levels` table.

**Dashboard.tsx** conditionally renders based on access level:

```typescript
if (accessLevel === 'no_access') {
  return <NoAccessView />;
}

if (accessLevel === 'meeting_only') {
  return <MeetingBookingView />;
}

// Default: full_access shows full dashboard
```

### Access Level States

| Level | When Set | What Creator Sees | Can Do |
|-------|----------|-------------------|---------|
| `no_access` | Initial account creation (if manual) | "Application Under Review" message | Only logout |
| `meeting_only` | On approval | Meeting booking interface | Book/view meeting, logout |
| `full_access` | After meeting completion | Full dashboard | Everything |

---

## Email Communications

### 1. Application Received
**Trigger:** Creator submits application
**Function:** `send-application-received`
**Content:** "Thank you for applying, we'll review soon"

### 2. Meeting Invitation (Approval)
**Trigger:** Admin approves application
**Function:** `send-meeting-invitation`
**Content:**
- Welcome message
- Password reset link
- Login URL
- Instructions to book meeting
- Note that dashboard unlocks after meeting

### 3. Meeting Request to Manager
**Trigger:** Creator books meeting time
**Function:** `send-manager-meeting-request`
**Content:**
- Creator details
- Requested date/time/type
- Link to admin dashboard

### 4. Meeting Confirmation to Creator
**Trigger:** Admin confirms meeting
**Function:** `send-meeting-confirmation`
**Content:**
- Meeting confirmed
- Date, time, duration
- Meeting link (online) OR location (in-person)

### 5. Full Access Granted
**Trigger:** Admin completes meeting
**Function:** `send-access-granted`
**Content:**
- Congratulations on completing intro meeting
- Dashboard now unlocked
- Link to dashboard
- Next steps (complete onboarding, etc.)

### 6. Application Declined (Optional)
**Trigger:** Admin declines application
**Function:** `send-application-declined`
**Content:**
- Sorry message
- Optional reason from admin

---

## Key Files & Components

### Frontend Components
- `src/pages/Signup.tsx` - Application form
- `src/components/dashboard/NoAccessView.tsx` - Pending application view
- `src/components/dashboard/MeetingBookingView.tsx` - Meeting booking UI (2 modes)
- `src/pages/Dashboard.tsx` - Main dashboard (access level gating)
- `src/components/admin/ApplicationsManagement.tsx` - Admin reviews applications
- `src/components/admin/AdminMeetings.tsx` - Admin manages meetings

### Backend Functions
- `supabase/functions/approve-creator-application/` - Full approval flow
- `supabase/functions/send-application-received/` - Confirmation email
- `supabase/functions/send-meeting-invitation/` - Welcome + setup email
- `supabase/functions/send-manager-meeting-request/` - Notify manager
- `supabase/functions/send-meeting-confirmation/` - Confirm meeting
- `supabase/functions/send-access-granted/` - Full access notification
- `supabase/functions/send-application-declined/` - Decline notification

### Database Tables
- `creator_applications` - Application records
- `creator_access_levels` - Access level per user
- `creator_meetings` - Meeting records
- `user_roles` - Role assignments
- `profiles` - User profile data
- `onboarding_data` - Onboarding form data (unlocked at stage 9)

### Hooks
- `useAccessLevel` - Fetches current access level
- `useAuth` - Authentication state
- `useUserRole` - User role checks
- `useOnboarding` - Onboarding data management

---

## Testing the Flow

### Complete Flow Test
1. **Submit Application**
   - Go to `/signup`
   - Fill form, submit
   - Check email for confirmation

2. **Admin Approval**
   - Login as admin
   - Go to Admin Dashboard → Applications
   - Find pending application
   - Click "Approve"
   - Verify success message

3. **Creator Account Setup**
   - Check creator's email inbox
   - Click password reset link
   - Set password
   - Login at `/login`
   - Should see **meeting booking page only**

4. **Book Meeting**
   - Select meeting type
   - Choose date from calendar
   - Select time slot
   - Click "Request Meeting"
   - Verify success message

5. **Admin Confirms Meeting**
   - Login as admin
   - Go to Admin Dashboard → Meetings → Pending tab
   - Click "Confirm" on meeting
   - Add meeting link/location
   - Click "Confirm Meeting"

6. **Creator Sees Confirmation**
   - Check creator's email
   - Login as creator
   - Should still see meeting booking page
   - Meeting should show as "Confirmed" with details

7. **Admin Completes Meeting**
   - After actual meeting happens
   - Admin goes to Meetings → Upcoming tab
   - Clicks "Mark as Complete"
   - Optionally adds notes
   - Clicks "Complete & Unlock Access"

8. **Creator Gets Full Access**
   - Check creator's email for access granted message
   - Login as creator
   - Should now see **FULL DASHBOARD**
   - All tabs available: Onboarding, Profile, Uploads, etc.

---

## Common Issues & Solutions

### Issue: Creator can't see dashboard after approval
**Cause:** Access level not set correctly
**Fix:** Check `creator_access_levels` table, should be `meeting_only` after approval

### Issue: Creator sees "Application Under Review" after approval
**Cause:** No row in `creator_access_levels` table
**Fix:** Re-run approval or manually insert access level record

### Issue: Meeting booking doesn't show time slots
**Cause:** Manager has no availability set
**Fix:** Admin sets availability in Admin Dashboard → Availability Settings

### Issue: Creator gets full dashboard immediately after approval
**Cause:** Access level set to `full_access` instead of `meeting_only`
**Fix:** Update `creator_access_levels` to `meeting_only`

### Issue: Email not received
**Cause:** Resend API key not configured or invalid
**Fix:** Check `RESEND_API_KEY` secret in settings

---

## Security Considerations

1. **Role Verification:** All admin actions check user roles via `has_role()` function
2. **RLS Policies:** All tables have Row Level Security enabled
3. **Access Gating:** Dashboard components check access level before rendering
4. **Email Validation:** All email functions validate input
5. **Session Management:** Auth state handled by Supabase auth
6. **No Client-Side Role Storage:** Roles never stored in localStorage/sessionStorage

---

## Future Enhancements

- [ ] Email templates with better styling
- [ ] SMS notifications for meeting confirmations
- [ ] Calendar integration (Google Calendar, iCal)
- [ ] Automated meeting reminders
- [ ] Multiple managers per creator
- [ ] Rescheduling functionality
- [ ] Video call integration (Zoom, Google Meet)
- [ ] Meeting recording storage
- [ ] Onboarding progress tracking
- [ ] Automated follow-ups
