# Production Deployment Checklist

Complete this checklist before deploying Bureau Boudoir to production.

## Pre-Deployment Checks

### Environment Configuration

- [ ] **Supabase Project**
  - [ ] Production Supabase project created
  - [ ] Database connection string configured
  - [ ] Service role key secured
  - [ ] Anon key configured

- [ ] **Environment Variables**
  - [ ] `VITE_SUPABASE_URL` set correctly
  - [ ] `VITE_SUPABASE_PUBLISHABLE_KEY` set
  - [ ] All `.env` variables documented
  - [ ] No secrets committed to Git

- [ ] **API Keys**
  - [ ] Resend API key configured
  - [ ] Domain verified in Resend
  - [ ] API key permissions verified
  - [ ] Sentry DSN configured (if using)

### Database Setup

- [ ] **Migrations**
  - [ ] All migrations applied successfully
  - [ ] No pending schema changes
  - [ ] Indexes created (30+ indexes from Phase 5)
  - [ ] Database functions deployed

- [ ] **RLS Policies**
  - [ ] RLS enabled on all tables
  - [ ] Policies tested for each role
  - [ ] No data leaks verified
  - [ ] Security audit passed

- [ ] **Initial Data**
  - [ ] Contract templates uploaded (3 versions)
  - [ ] Permissions configured
  - [ ] Role permissions mapped
  - [ ] Super admin account created

### Edge Functions

- [ ] **All Functions Deployed**
  - [ ] approve-creator-application
  - [ ] check-contract-expiry
  - [ ] complete-invitation-setup
  - [ ] complete-invitation
  - [ ] create-manager-account
  - [ ] create-test-accounts
  - [ ] delete-user-account
  - [ ] fetch-url-metadata
  - [ ] generate-contract-pdf
  - [ ] resend-meeting-invitation
  - [ ] send-access-granted
  - [ ] send-admin-notification
  - [ ] send-application-declined
  - [ ] send-application-received
  - [ ] send-contract-notification
  - [ ] send-meeting-confirmation
  - [ ] send-meeting-invitation
  - [ ] send-meeting-reminder
  - [ ] send-manager-meeting-request
  - [ ] send-manager-welcome
  - [ ] send-shoot-invitation
  - [ ] sync-to-gdrive
  - [ ] retry-failed-emails (NEW)
  - [ ] track-invitation-link
  - [ ] verify-invitation-token

- [ ] **Function Testing**
  - [ ] Rate limiting works (test with rapid requests)
  - [ ] Error handling tested
  - [ ] Logging verified
  - [ ] No sensitive data in logs

### Cron Jobs

- [ ] **Email Retry Job**
  - [ ] Set up cron: `*/30 * * * *` (every 30 minutes)
  - [ ] Calls `retry-failed-emails` function
  - [ ] Verified working with test failed email

- [ ] **Contract Expiry Check**
  - [ ] Set up cron: `0 0 * * *` (daily at midnight)
  - [ ] Calls `check-contract-expiry` function
  - [ ] Verified notifications sent

- [ ] **Invoice Overdue Update**
  - [ ] Set up cron: `0 1 * * *` (daily at 1 AM)
  - [ ] Calls `update_overdue_invoices` function
  - [ ] Verified status updates

### Storage Buckets

- [ ] **content-uploads**
  - [ ] Public bucket set up correctly
  - [ ] File size limits configured
  - [ ] Allowed MIME types set
  - [ ] Tested upload and retrieval

- [ ] **contracts**
  - [ ] Private bucket (requires auth)
  - [ ] RLS policies on storage.objects
  - [ ] Signed URLs working
  - [ ] Tested PDF storage

---

## Security Verification

### Authentication

- [ ] Auth configured correctly
  - [ ] Email confirmation enabled (or disabled for testing)
  - [ ] Password requirements enforced
  - [ ] Session timeout: 30 minutes
  - [ ] Magic links expire: 60 minutes

### Access Control

Run [Security Testing Checklist](./SECURITY_TESTING_CHECKLIST.md):

- [ ] RLS policies tested
- [ ] Role-based access verified
- [ ] No horizontal privilege escalation possible
- [ ] No vertical privilege escalation possible
- [ ] Input validation working on all forms

### Data Protection

- [ ] PII encrypted at rest
- [ ] Sensitive data not in logs
- [ ] File uploads virus scanned (if applicable)
- [ ] Backup encryption enabled

---

## Performance Testing

### Load Testing

- [ ] **Database Performance**
  - [ ] All indexes created
  - [ ] Query performance acceptable (<100ms for common queries)
  - [ ] Connection pooling configured
  - [ ] No N+1 query issues

- [ ] **Frontend Performance**
  - [ ] Lazy loading implemented
  - [ ] Bundle size optimized
  - [ ] Images optimized
  - [ ] Lighthouse score >90

- [ ] **Edge Functions**
  - [ ] Cold start time acceptable (<2s)
  - [ ] Warm requests fast (<500ms)
  - [ ] No memory leaks
  - [ ] Timeout handling configured

### Stress Testing

- [ ] 100 simultaneous users: OK
- [ ] File uploads during peak: OK
- [ ] Email sending at scale: OK
- [ ] Database queries under load: OK

---

## Monitoring Setup

### Error Tracking

- [ ] **Sentry Configured**
  - [ ] DSN added to main.tsx
  - [ ] Error capturing working
  - [ ] Source maps uploaded
  - [ ] Alert rules configured

### Logging

- [ ] **Application Logs**
  - [ ] Edge function logs accessible
  - [ ] Database logs enabled
  - [ ] Auth logs enabled
  - [ ] Error logs captured

- [ ] **Email Logs**
  - [ ] All emails logged to `email_logs` table
  - [ ] Failed emails trigger retry
  - [ ] Log retention policy set

### Alerts

- [ ] High error rate alerts
- [ ] Failed email alerts (if >10% fail rate)
- [ ] Database connection alerts
- [ ] Rate limit exceeded alerts

---

## User Testing

### Test User Flows

- [ ] **Creator Journey** (end-to-end)
  1. Apply → Approved → Receive invitation
  2. Access account → Set password
  3. Complete steps 1-2
  4. Book meeting
  5. Meeting completed → Full access granted
  6. Complete steps 3-10
  7. Sign contract
  8. Upload content

- [ ] **Admin Journey**
  1. Review application → Approve
  2. Assign to manager
  3. Generate contract after onboarding
  4. Create invoice
  5. Review content

- [ ] **Manager Journey**
  1. Receive welcome email
  2. Set availability
  3. Receive meeting request
  4. Complete meeting
  5. Review content
  6. Assign commitments

### Mobile Testing

- [ ] iOS Safari: All features work
- [ ] Android Chrome: All features work
- [ ] Responsive design: 375px - 1920px
- [ ] Touch targets: Minimum 44px
- [ ] Forms usable on mobile

### Browser Testing

- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

---

## Email Deliverability

### Resend Configuration

- [ ] Domain verified at resend.com/domains
- [ ] SPF records configured
- [ ] DKIM records configured
- [ ] DMARC policy set
- [ ] Test emails landing in inbox (not spam)

### Email Templates

- [ ] All 11 email types tested:
  - [ ] application_received
  - [ ] application_declined
  - [ ] meeting_invitation
  - [ ] meeting_confirmation
  - [ ] meeting_reminder
  - [ ] manager_meeting_request
  - [ ] manager_welcome
  - [ ] contract_notification
  - [ ] access_granted
  - [ ] shoot_invitation
  - [ ] admin_notification

- [ ] Mobile-responsive email design
- [ ] Unsubscribe link (if required)
- [ ] Links work correctly
- [ ] Images load

---

## Content Verification

### Static Content

- [ ] Hero images optimized
- [ ] Logo images present
- [ ] Rose graphics present
- [ ] All assets in correct folders
- [ ] No broken image links

### Legal Pages

- [ ] Terms & Conditions complete
- [ ] Privacy Policy present
- [ ] Cookie Policy (if applicable)
- [ ] Contact information correct

### Documentation

- [ ] Admin Guide complete
- [ ] Manager Guide complete
- [ ] Creator Onboarding Guide complete
- [ ] Troubleshooting Guide complete
- [ ] Security Testing Checklist complete
- [ ] All guides accessible to relevant roles

---

## Backup & Recovery

### Backup Strategy

- [ ] Database backup schedule configured (daily)
- [ ] Storage bucket backup enabled
- [ ] Backup retention: 30 days minimum
- [ ] Backup restoration tested

### Disaster Recovery

- [ ] Recovery plan documented
- [ ] RTO (Recovery Time Objective): 4 hours
- [ ] RPO (Recovery Point Objective): 24 hours
- [ ] Incident response team identified
- [ ] Contact list for emergencies

---

## Communication

### Internal Team

- [ ] Admin team briefed on launch
- [ ] Manager team trained
- [ ] Support team ready
- [ ] Contact list updated

### External Communication

- [ ] Launch announcement ready
- [ ] Social media posts scheduled
- [ ] Email campaign prepared
- [ ] Press release (if applicable)

---

## Post-Launch Monitoring

### First 24 Hours

Monitor closely:
- [ ] Error rates (target: <1%)
- [ ] Email delivery (target: >98%)
- [ ] Response times (<2s avg)
- [ ] User registrations
- [ ] Critical user paths working

### First Week

- [ ] Daily error log review
- [ ] User feedback collection
- [ ] Performance metrics stable
- [ ] No security incidents
- [ ] Support ticket volume manageable

### First Month

- [ ] Monthly security audit
- [ ] Performance optimization
- [ ] User satisfaction survey
- [ ] Feature requests collected
- [ ] Backup restoration test

---

## Rollback Plan

### If Critical Issues Found

**Severity 1 (Data Loss / Security Breach):**
1. Immediate rollback to previous version
2. Investigate root cause
3. Fix in development
4. Re-test completely
5. Re-deploy when safe

**Severity 2 (Major Feature Broken):**
1. Disable affected feature
2. Fix and hotfix deploy
3. Monitor closely
4. Full regression test

**Severity 3 (Minor Issues):**
1. Document for next release
2. Monitor impact
3. Fix in regular update cycle

---

## Launch Day Timeline

### T-24 Hours
- [ ] Final security scan
- [ ] Database backup
- [ ] All tests passing
- [ ] Team notified

### T-12 Hours
- [ ] Backup verified
- [ ] Monitoring dashboards set up
- [ ] Emergency contacts confirmed
- [ ] Coffee supplies ready ☕

### T-2 Hours
- [ ] Team online and ready
- [ ] Support channels open
- [ ] Final smoke test
- [ ] Go/No-Go decision

### Launch (T-0)
- [ ] Deploy to production
- [ ] Verify deployment successful
- [ ] Run smoke tests
- [ ] Monitor errors

### T+1 Hour
- [ ] Check error rates
- [ ] Verify email delivery
- [ ] Test critical paths
- [ ] User feedback channels open

### T+4 Hours
- [ ] Full system check
- [ ] Performance metrics review
- [ ] User onboarding working
- [ ] No critical issues

---

## Success Criteria

### Technical Metrics

- ✅ Uptime: >99.9%
- ✅ Error rate: <1%
- ✅ Email delivery: >98%
- ✅ Page load time: <2s (avg)
- ✅ API response time: <500ms (avg)
- ✅ Zero critical security issues

### Business Metrics

- ✅ User registration working
- ✅ Application flow complete
- ✅ Meetings being booked
- ✅ Contracts being signed
- ✅ Content being uploaded
- ✅ Zero data loss incidents

---

## Sign-Off

**Development Team:**
- [ ] Technical Lead: ______________ Date: __________
- [ ] Backend Engineer: ______________ Date: __________
- [ ] Frontend Engineer: ______________ Date: __________

**Business Team:**
- [ ] Product Owner: ______________ Date: __________
- [ ] Admin Lead: ______________ Date: __________

**Security:**
- [ ] Security Officer: ______________ Date: __________

**Final Approval:**
- [ ] CEO/Founder: ______________ Date: __________

---

## Post-Launch Checklist

### Week 1
- [ ] Daily error review
- [ ] User feedback collected
- [ ] Performance stable
- [ ] Backup restored once (test)
- [ ] No security incidents

### Week 2-4
- [ ] Security audit
- [ ] Performance optimization
- [ ] User satisfaction survey
- [ ] Feature requests prioritized
- [ ] Documentation updates

---

**🚀 Ready for Launch!**

Once all items checked, you're ready to deploy to production.

**Emergency Rollback:** Keep previous version accessible for 48 hours post-launch.

**Last Updated**: November 2025  
**Version**: 1.0