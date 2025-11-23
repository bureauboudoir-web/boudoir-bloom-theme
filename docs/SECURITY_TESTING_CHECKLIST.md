# Security Testing Checklist

Use this checklist to verify security measures are working correctly before production launch.

## Access Control Testing

### Creator Access Levels

- [ ] **No Access**: Cannot access dashboard
  - [ ] Redirected to "No Access" page
  - [ ] Cannot view any creator-specific data
  - [ ] No API calls succeed

- [ ] **Meeting Only**: Limited access
  - [ ] Can only complete onboarding steps 1-2
  - [ ] Can book meetings
  - [ ] Cannot access steps 3-10 until meeting complete
  - [ ] Cannot upload content
  - [ ] Cannot view full commitments

- [ ] **Full Access**: Complete access
  - [ ] All 10 onboarding steps accessible
  - [ ] Can upload content
  - [ ] Can view commitments, shoots, invoices
  - [ ] Can sign contract
  - [ ] All dashboard tabs functional

### Role-Based Access

- [ ] **Creator**: Can only see own data
  - [ ] Cannot see other creators' data
  - [ ] Cannot access admin/manager dashboards
  - [ ] Cannot modify others' records
  
- [ ] **Manager**: Limited administrative access
  - [ ] Can only see assigned creators
  - [ ] Cannot see unassigned creators' data
  - [ ] Cannot access admin-only features
  - [ ] Cannot create admin accounts
  - [ ] Cannot modify roles

- [ ] **Admin**: Full access
  - [ ] Can see all creators
  - [ ] Can access all dashboard sections
  - [ ] Can create manager accounts
  - [ ] Can generate contracts
  - [ ] Can grant/revoke access

- [ ] **Super Admin**: Maximum privileges
  - [ ] All admin permissions
  - [ ] Can create other admins
  - [ ] Cannot be deleted if last super admin

---

## RLS Policy Testing

### Test as Creator User

```sql
-- Should return only YOUR data
SELECT * FROM profiles WHERE id != auth.uid();
-- Expected: 0 rows

SELECT * FROM onboarding_data WHERE user_id != auth.uid();
-- Expected: 0 rows

SELECT * FROM creator_contracts WHERE user_id != auth.uid();
-- Expected: 0 rows

SELECT * FROM weekly_commitments WHERE user_id != auth.uid();
-- Expected: 0 rows

SELECT * FROM content_uploads WHERE user_id != auth.uid();
-- Expected: 0 rows

SELECT * FROM invoices WHERE user_id != auth.uid();
-- Expected: 0 rows
```

### Test as Manager User

```sql
-- Should return only ASSIGNED creators
SELECT * FROM profiles 
WHERE id NOT IN (
  SELECT id FROM profiles WHERE assigned_manager_id = auth.uid()
);
-- Expected: 0 rows for non-admins

-- Should not access other managers' data
SELECT * FROM creator_meetings 
WHERE assigned_manager_id != auth.uid();
-- Expected: 0 rows for managers
```

### Test as Admin User

```sql
-- Should return ALL records
SELECT COUNT(*) FROM profiles;
SELECT COUNT(*) FROM creator_applications;
SELECT COUNT(*) FROM creator_contracts;
-- Expected: All records visible
```

---

## Input Validation Testing

### Form Validation

**Test Each Form:**
- [ ] Signup form
- [ ] Login form
- [ ] Onboarding forms (all 10 steps)
- [ ] Meeting booking form
- [ ] Content upload form
- [ ] Support ticket form
- [ ] Contract generation form
- [ ] Invoice creation form

**Test Cases for Each:**
1. **Empty Fields**: Submit with required fields empty
   - Expected: Validation error shown
   
2. **Invalid Format**: Wrong email format, invalid dates
   - Expected: Format error message

3. **Boundary Values**: Max length strings, extreme numbers
   - Expected: Rejected if over limit

4. **Special Characters**: SQL injection attempts, XSS attempts
   - Expected: Sanitized or rejected

5. **File Uploads**: 
   - [ ] Wrong file types rejected
   - [ ] Oversized files rejected
   - [ ] Malicious files rejected

### API Validation

**Test Edge Functions:**
- [ ] Missing required parameters return 400
- [ ] Invalid data types rejected
- [ ] SQL injection attempts blocked
- [ ] XSS attempts sanitized
- [ ] Rate limiting works (429 status after limit)

---

## Authentication Testing

### Password Security

- [ ] Minimum 8 characters enforced
- [ ] Requires uppercase, lowercase, number, special char
- [ ] Password not visible when typing
- [ ] "Show password" toggle works
- [ ] Cannot reuse last 3 passwords (if implemented)

### Session Management

- [ ] Session expires after 30 minutes inactivity
- [ ] User logged out properly
- [ ] No data accessible after logout
- [ ] Session timeout warning shows 2 minutes before

### Password Reset

- [ ] Reset email sent successfully
- [ ] Reset link expires after set time
- [ ] Can only use link once
- [ ] Old password stops working after reset
- [ ] New password validation enforced

---

## Data Protection Testing

### Personal Information

- [ ] Email addresses not exposed in URLs
- [ ] Phone numbers not in logs
- [ ] Addresses encrypted at rest
- [ ] DOB not visible to unauthorized users
- [ ] Emergency contacts private

### Sensitive Data

- [ ] Contract details only visible to creator + admin
- [ ] Invoice amounts only visible to creator + admin
- [ ] Onboarding answers private
- [ ] Boundary information highly restricted
- [ ] Meeting notes only visible to participants + admin

### File Storage

- [ ] Private files not publicly accessible
- [ ] Signed URLs expire
- [ ] Cannot guess file URLs
- [ ] Content uploads require authentication
- [ ] Contracts require authentication to download

---

## API Security Testing

### Edge Functions

**Rate Limiting:**
- [ ] Application emails: Max 10/min
- [ ] Meeting emails: Max 20/min
- [ ] Admin notifications: Max 50/min
- [ ] Returns 429 when exceeded

**Authentication:**
- [ ] Protected endpoints require auth header
- [ ] Invalid tokens rejected
- [ ] Expired tokens rejected

**Error Handling:**
- [ ] No sensitive data in error messages
- [ ] No stack traces to client
- [ ] Errors logged properly
- [ ] User-friendly error messages

---

## Email Security

### Email Logging

- [ ] All sent emails logged
- [ ] Failed emails logged with reason
- [ ] Retry count tracked
- [ ] Personal data not in logs (only email addresses)

### Email Content

- [ ] No sensitive data in subject lines
- [ ] Links use HTTPS only
- [ ] No credentials in email body
- [ ] Unsubscribe link included (if applicable)

---

## XSS Prevention

### Test Inputs

Test these in forms and see if script executes:
```
<script>alert('XSS')</script>
<img src=x onerror=alert('XSS')>
javascript:alert('XSS')
"><svg/onload=alert('XSS')>
```

**Expected:** 
- Input sanitized or escaped
- Script does NOT execute
- Shows as plain text if displayed

### Test Locations

- [ ] Onboarding text fields
- [ ] Support ticket message
- [ ] Admin notes
- [ ] Meeting notes
- [ ] Content descriptions
- [ ] Profile bio fields

---

## SQL Injection Prevention

### Test Inputs

Try these in text fields:
```
' OR '1'='1
'; DROP TABLE users--
' UNION SELECT * FROM profiles--
```

**Expected:**
- Input rejected or escaped
- No database error
- No unauthorized data access
- Error logged securely

### Protected Fields

- [ ] Search boxes
- [ ] Email fields
- [ ] Name fields
- [ ] Description fields
- [ ] Any user input that queries database

---

## File Upload Security

### Malicious Files

- [ ] Upload .exe file → Rejected
- [ ] Upload .php file → Rejected
- [ ] Upload SVG with script → Sanitized
- [ ] Upload file with double extension (image.jpg.exe) → Rejected
- [ ] Upload file over size limit → Rejected

### MIME Type Validation

- [ ] File extension matches content type
- [ ] Renaming .exe to .jpg is caught
- [ ] Content-Type header validated

---

## CSRF Protection

### Form Submissions

- [ ] All forms include CSRF token (if implemented)
- [ ] POST requests without token rejected
- [ ] Tokens expire after use
- [ ] Tokens tied to session

---

## Authorization Testing

### Horizontal Privilege Escalation

**Test as Creator A:**
```javascript
// Try to access Creator B's data by changing URL/API params
GET /api/profile/:creator_b_id
GET /api/onboarding/:creator_b_id
GET /api/contracts/:creator_b_contract_id
```

**Expected:** Access denied, 403 error

### Vertical Privilege Escalation

**Test as Creator:**
```javascript
// Try to access admin endpoints
GET /api/admin/users
POST /api/admin/create-manager
DELETE /api/users/:id
```

**Expected:** Access denied, 403 error

**Test as Manager:**
```javascript
// Try to access admin-only features
POST /api/admin/generate-contract
DELETE /api/users/:id
POST /api/admin/settings
```

**Expected:** Access denied, 403 error

---

## Audit Logging

### Actions That MUST Be Logged

- [ ] Role granted/revoked
- [ ] Access level changed
- [ ] Contract generated
- [ ] Contract signed
- [ ] Invoice created/paid
- [ ] Manager account created
- [ ] Email sent/failed
- [ ] Meeting completed

### Audit Log Content

Each log should include:
- [ ] Timestamp
- [ ] User who performed action
- [ ] Target user (if applicable)
- [ ] Action performed
- [ ] Reason (if applicable)
- [ ] IP address (for sensitive actions)

---

## Compliance Testing

### GDPR Compliance

- [ ] Privacy policy accessible
- [ ] Users can view their data
- [ ] Users can request data deletion
- [ ] Consent tracked for data processing
- [ ] Right to data portability

### Data Retention

- [ ] Old logs cleaned up (if policy exists)
- [ ] Deleted user data actually deleted
- [ ] Backup retention policy followed

---

## Performance & DDoS Protection

### Rate Limiting

- [ ] Email functions: Limits enforced
- [ ] File upload: Size and count limits
- [ ] API calls: Rate limited per endpoint
- [ ] Login attempts: Locked after 5 failures

### Resource Limits

- [ ] Max file upload size enforced
- [ ] Max concurrent uploads enforced
- [ ] Database query timeout configured
- [ ] Memory limits prevent DoS

---

## Incident Response Testing

### Simulate Security Incident

- [ ] Admin can lock user account
- [ ] Admin can revoke access immediately
- [ ] Audit logs capture security events
- [ ] Email alerts sent for suspicious activity
- [ ] Can restore from backup if needed

---

## Pre-Launch Final Checks

### Critical Security Verification

- [ ] All RLS policies enabled on tables with PII
- [ ] Database functions use `SECURITY DEFINER` properly
- [ ] No hardcoded secrets in code
- [ ] All environment variables configured
- [ ] HTTPS enforced
- [ ] CORS configured correctly
- [ ] Rate limiting active on all edge functions
- [ ] Error messages don't leak sensitive info
- [ ] All forms validate input
- [ ] File uploads restricted properly
- [ ] Session timeout working
- [ ] Audit logs capturing all critical actions

### Documentation Review

- [ ] Security policies documented
- [ ] Incident response plan exists
- [ ] User guides reviewed for security advice
- [ ] Admin guide includes security best practices

---

## Security Test Results Log

Date: __________  
Tester: __________  
Environment: [ ] Development [ ] Staging [ ] Production

| Test Category | Pass/Fail | Notes | Action Required |
|---------------|-----------|-------|-----------------|
| Access Control | | | |
| RLS Policies | | | |
| Input Validation | | | |
| Authentication | | | |
| File Uploads | | | |
| API Security | | | |
| Email Security | | | |
| Audit Logging | | | |

**Critical Issues Found:**
_List any critical security issues that MUST be fixed before launch_

**Medium Issues Found:**
_List medium priority issues to fix soon_

**Low Issues Found:**
_List minor issues for future improvement_

---

**Sign-off Required Before Production:**

- [ ] Security Lead: ______________ Date: __________
- [ ] Technical Lead: ______________ Date: __________
- [ ] Admin: ______________ Date: __________

---

**Remember: Security is an ongoing process. Re-run this checklist:**
- Before every major release
- After any authentication/authorization changes
- Monthly for production systems
- After security incidents

**Last Updated**: November 2025  
**Version**: 1.0