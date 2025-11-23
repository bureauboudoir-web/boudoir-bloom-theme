# Bureau Boudoir Troubleshooting Guide

Quick solutions to common issues on the Bureau Boudoir platform.

## Table of Contents

1. [Login & Authentication Issues](#login--authentication-issues)
2. [Email Issues](#email-issues)
3. [Meeting Issues](#meeting-issues)
4. [Onboarding Issues](#onboarding-issues)
5. [Upload Issues](#upload-issues)
6. [Contract Issues](#contract-issues)
7. [Dashboard Issues](#dashboard-issues)
8. [Performance Issues](#performance-issues)

---

## Login & Authentication Issues

### Cannot Log In - "Invalid credentials"

**Solution:**
1. Verify email address is correct
2. Check password (case-sensitive)
3. Try **Forgot Password** to reset
4. Clear browser cache and cookies
5. Try incognito/private browsing mode

**Still Not Working?**
- Check if account was created (look for welcome email)
- Contact support with your email address

### Magic Link Expired

**Problem:** Clicked invitation link but says expired

**Solution:**
1. Magic links expire after 60 minutes
2. Contact admin to resend invitation
3. Check spam folder for latest email
4. Don't click link multiple times (invalidates it)

### Logged Out Unexpectedly

**Problem:** Keep getting logged out

**Solution:**
1. Session timeout is set to 30 minutes of inactivity
2. This is normal security behavior
3. Just log back in
4. Check "Remember Me" if available

### "Access Denied" After Login

**Problem:** Can log in but dashboard shows no access

**Solution:**
1. Check your access level with admin
2. New creators start with `meeting_only` access
3. Full access granted after meeting completion
4. Contact support if you should have access

---

## Email Issues

### Not Receiving Emails

**Check:**
1. **Spam/Junk folder** - Most common cause
2. Email address correct in profile
3. Email filters or rules blocking `@resend.dev`
4. Corporate firewall blocking Bureau Boudoir emails

**Solutions:**
- Add `onboarding@resend.dev` to safe senders
- Check email logs (admins) for delivery status
- Update email address in settings if wrong
- Try alternative email address

### Email Received Late

**Problem:** Notification emails arrive hours late

**Explanation:**
- Email delays can occur due to:
  - Recipient email server delays
  - Spam filter processing time
  - Network issues
- Bureau Boudoir sends emails immediately
- Check email logs to confirm send time

**Solution:**
- Check dashboard notifications instead
- Set up alternative notification method
- Report if consistently delayed (>1 hour)

### Clicked Email Link - Nothing Happens

**Solutions:**
1. Copy link and paste in browser address bar
2. Try different browser
3. Disable browser extensions temporarily
4. Check if link expired
5. Request new email

---

## Meeting Issues

### Cannot See Available Time Slots

**Reasons:**
1. Manager hasn't set availability
2. All slots booked
3. Manager blocked dates
4. System error

**Solutions:**
- Contact your assigned manager
- Ask admin to check manager availability settings
- Try refreshing the page
- Check if meeting already booked

### Meeting Not Confirmed

**Problem:** Booked meeting but no confirmation

**Check:**
1. Email confirmation (check spam)
2. Dashboard **Meetings** tab shows booking
3. Meeting status (should say "confirmed")

**If Missing:**
- Meeting may not have saved
- Rebook and verify confirmation immediately
- Contact manager if still no confirmation

### Need to Reschedule Meeting

**Steps:**
1. Go to dashboard **Meetings** tab
2. Find your meeting
3. Click **Request Reschedule**
4. Enter new preferred date/time
5. Add brief reason
6. Manager will review and respond

**Note:** Reschedule at least 24 hours in advance

### Meeting Link Not Working (Online Meetings)

**Solutions:**
1. Copy link and paste in browser
2. Try different browser
3. Update browser to latest version
4. Check if link requires password (in email)
5. Contact manager for alternative link

### Meeting Marked Complete But No Access

**Problem:** Manager completed meeting but still have `meeting_only` access

**Solutions:**
1. Wait 5 minutes and refresh dashboard
2. Log out and log back in
3. Check timeline for "Full Access Granted" event
4. Contact admin if still no access after 15 minutes

---

## Onboarding Issues

### Cannot Progress Past Step 2

**Reason:** Steps 3-10 require meeting completion

**Solution:**
1. Complete your introductory meeting first
2. Meeting must be marked "complete" by manager
3. System automatically unlocks remaining steps
4. This is by design for proper onboarding flow

### Can't Save Onboarding Data

**Solutions:**
1. Check all required fields filled
2. Look for red error messages
3. Ensure data format correct (dates, numbers, etc.)
4. Try refreshing page and re-entering
5. Check browser console for errors (F12)

### Auto-Save Not Working

**Check:**
1. Internet connection stable
2. Browser allows localStorage
3. Not in incognito/private mode (disables auto-save)
4. Green "Saved" indicator should appear

**Solution:**
- Click **Save** manually before leaving page
- Don't rely solely on auto-save
- Report if consistently failing

### Onboarding Step Shows "Locked"

**Reasons:**
1. Previous steps not completed
2. Meeting not finished
3. Access level too low

**Solution:**
- Complete steps in order
- Ensure meeting completed
- Contact admin if you should have access

---

## Upload Issues

### File Upload Fails

**Common Causes:**
1. File too large (limit: depends on plan)
2. Unsupported file type
3. Poor internet connection
4. Browser issues

**Solutions:**
1. Check file size - compress if needed
2. Supported formats: JPG, PNG, MP4, MOV
3. Try different browser
4. Use wired connection if on WiFi
5. Upload smaller batches

### Upload Slow

**Tips:**
1. Upload during off-peak hours
2. Use wired internet connection
3. Close other bandwidth-heavy apps
4. Upload fewer files at once
5. Check your internet speed

### Cannot Link Upload to Commitment

**Solutions:**
1. Ensure commitment exists and is active
2. Select commitment from dropdown
3. Refresh page and try again
4. Contact manager if commitment missing

### Upload Rejected - Don't Know Why

**Steps:**
1. Check rejection reason (should be provided)
2. Review content guidelines
3. Ask manager for specific feedback
4. Improve and resubmit

---

## Contract Issues

### Cannot See Contract

**Reasons:**
1. Contract not generated yet (admin task)
2. Onboarding not complete
3. Browser cache issue

**Solutions:**
- Complete all 10 onboarding steps first
- Admin must generate contract
- Refresh page / clear cache
- Contact admin if you should have contract

### Digital Signature Not Working

**Solutions:**
1. Use mouse or trackpad (not finger on touchscreen)
2. Draw within the signature box
3. Try different browser
4. Refresh page and try again
5. Don't draw too quickly

### Contract PDF Won't Download

**Solutions:**
1. Disable popup blocker
2. Try different browser
3. Right-click link → "Save As"
4. Check downloads folder
5. Clear browser cache

### Signed Contract but Still Locked

**Problem:** Signed contract but features not unlocked

**Solution:**
1. Wait 5 minutes for system to process
2. Check email for signed copy confirmation
3. Verify signature appears on PDF
4. Log out and back in
5. Contact admin if still locked after 15 min

---

## Dashboard Issues

### Dashboard Won't Load

**Solutions:**
1. Refresh page (Ctrl+R / Cmd+R)
2. Clear browser cache
3. Try incognito/private mode
4. Check internet connection
5. Try different browser
6. Check browser console for errors (F12)

### Dashboard Shows Wrong Data

**Solutions:**
1. Hard refresh (Ctrl+Shift+R / Cmd+Shift+R)
2. Clear browser cache
3. Log out and log back in
4. Report specific data that's wrong

### Notifications Not Showing

**Check:**
1. Browser allows notifications
2. Not in "Do Not Disturb" mode
3. Notification bell icon in header
4. Dashboard tab active (some browsers pause inactive tabs)

**Solution:**
- Enable browser notifications in settings
- Keep dashboard tab active
- Refresh page regularly

### Cannot Access Certain Features

**Reasons:**
1. Insufficient access level
2. Role limitations (creator vs manager vs admin)
3. Feature under maintenance
4. Browser compatibility

**Solution:**
- Check your role and access level
- Contact admin if you should have access
- Update browser to latest version

---

## Performance Issues

### Page Loading Slowly

**Solutions:**
1. Check your internet speed
2. Close unnecessary browser tabs
3. Clear browser cache and cookies
4. Disable browser extensions temporarily
5. Try different browser
6. Use wired connection instead of WiFi

### Images Not Loading

**Solutions:**
1. Check internet connection
2. Disable ad blockers
3. Clear browser cache
4. Try incognito/private mode
5. Image host might be down (report it)

### Dashboard Freezing

**Solutions:**
1. Close other programs
2. Check computer memory usage
3. Restart browser
4. Update browser to latest version
5. Try less demanding browser (e.g., Firefox vs Chrome)

---

## Error Messages

### "Session Expired - Please Log In"

**Normal behavior** after 30 minutes of inactivity

**Solution:** Just log back in

### "Network Error - Please Try Again"

**Causes:**
1. Internet connection lost
2. Server temporarily unavailable
3. Firewall blocking request

**Solution:**
- Check internet connection
- Wait 1 minute and retry
- Try different network
- Contact support if persists

### "Permission Denied"

**Meaning:** You don't have access to that feature/data

**Solution:**
- Verify your role and access level
- Contact admin if you should have access
- Feature might be admin/manager only

### "Rate Limit Exceeded"

**Meaning:** Too many requests in short time

**Solution:**
- Wait 1-2 minutes
- Don't spam buttons/refresh rapidly
- Normal usage won't trigger this

---

## Browser-Specific Issues

### Safari Issues

**Common Problems:**
- LocalStorage disabled in Private Mode
- Tracking prevention blocking features

**Solutions:**
- Disable tracking prevention for site
- Use regular browsing (not private)
- Update to latest Safari version

### Firefox Issues

**Common Problems:**
- Enhanced tracking protection blocks some features
- Strict mode causes issues

**Solutions:**
- Add site to exceptions
- Lower tracking protection for site
- Clear Firefox cache

### Chrome/Edge Issues

**Common Problems:**
- Extensions interfering
- Sync issues

**Solutions:**
- Disable extensions one by one
- Try incognito mode
- Clear cache and cookies

---

## Mobile Issues

### Desktop Site on Mobile

**Solution:**
1. Mobile responsive design included
2. Should automatically adapt
3. Try portrait and landscape
4. Refresh page if stuck
5. Clear mobile browser cache

### Touch Issues

**Solutions:**
1. Some features work better on desktop
2. Use stylus for signatures
3. Zoom in for small buttons
4. Rotate device if needed

---

## When to Contact Support

Contact support if:
- Issue persists after trying all solutions
- Data loss or corruption
- Payment/invoice issues
- Account security concerns
- Bug in the system
- Need urgent assistance

**How to Contact:**
1. Use **Contact Support** in dashboard
2. Include:
   - Your email address
   - Browser and OS
   - Screenshot of error
   - Steps to reproduce
   - What you already tried

**Response Time:**
- General inquiries: 24-48 hours
- Urgent issues: 4-8 hours
- Critical bugs: Within 1 hour

---

## Preventive Measures

### Best Practices

1. **Use Updated Browser**
   - Chrome, Firefox, Edge, Safari latest versions
   - Enable automatic updates

2. **Stable Internet**
   - Wired connection preferred
   - Minimum 5 Mbps upload for file uploads

3. **Regular Maintenance**
   - Clear cache weekly
   - Close unused tabs
   - Restart browser daily

4. **Security**
   - Use strong unique password
   - Don't share account
   - Log out on shared computers
   - Enable 2FA if available

5. **Backups**
   - Save important data externally
   - Screenshot important info
   - Keep email confirmations

---

## Still Need Help?

If this guide didn't solve your issue:

1. Check the relevant user guide:
   - [Admin Guide](./ADMIN_GUIDE.md)
   - [Creator Onboarding Guide](./CREATOR_ONBOARDING_GUIDE.md)
   - [Manager Guide](./MANAGER_GUIDE.md)

2. Contact support through dashboard

3. Check for system status updates

4. Ask in community channels (if available)

---

**Last Updated**: November 2025  
**Version**: 1.0