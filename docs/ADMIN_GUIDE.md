# Bureau Boudoir Admin Guide

Welcome to the Bureau Boudoir Admin Dashboard! This guide will help you navigate and effectively use all administrative features.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Managing Creator Applications](#managing-creator-applications)
3. [Creator Management](#creator-management)
4. [Contract Management](#contract-management)
5. [Invoice Management](#invoice-management)
6. [Access Level Management](#access-level-management)
7. [Role Management](#role-management)
8. [Content Review](#content-review)
9. [Meeting Management](#meeting-management)
10. [Email Logs](#email-logs)

---

## Getting Started

### Accessing the Admin Dashboard

1. Log in with your admin credentials at `/login`
2. Navigate to the Admin Dashboard via the sidebar or `/admin` URL
3. The dashboard will load with an overview of pending actions

### Dashboard Overview

The admin overview displays:
- **Pending Applications**: New creator applications awaiting review
- **Pending Meetings**: Upcoming creator meetings
- **Active Creators**: Total number of creators with full access
- **Recent Activity**: Latest system actions and updates

---

## Managing Creator Applications

### Reviewing Applications

1. Navigate to **Applications** tab
2. View applications in:
   - **Kanban View**: Visual board with drag-and-drop (Status: Pending → Reviewing → Approved/Declined)
   - **Table View**: Detailed list with filters

### Approving an Application

1. Click on an application to view details
2. Review applicant information (name, email, experience level)
3. Click **Approve** button
4. System automatically:
   - Creates user account
   - Sends welcome email with magic link
   - Grants `meeting_only` access
   - Logs action in audit trail

### Declining an Application

1. Click on an application
2. Click **Decline** button
3. Optionally provide a reason
4. System sends decline notification email

### Admin Notes

- Add private notes visible only to admins
- Notes are versioned and timestamped
- Use notes for application review context

---

## Creator Management

### Creator Overview

Access via **Creators** tab to see:
- All registered creators
- Access levels (no_access, meeting_only, full_access)
- Onboarding progress
- Contract status
- Assigned manager

### Granting Access

**Meeting-Only Access:**
- Automatically granted on application approval
- Allows booking introductory meeting
- Limits onboarding to first 2 steps

**Full Access:**
- Manually granted by admin after meeting completion
- Unlocks all 10 onboarding steps
- Enables full platform features

**To Grant Access:**
1. Go to **Access Management** tab
2. Select creator from dropdown
3. Choose access level
4. Add reason (required for audit trail)
5. Click **Grant Access**

### Creating Manager Accounts

1. Navigate to **Role Management** > **Create Manager**
2. Fill in:
   - Email address
   - Full name
   - Role (Manager or Admin)
3. Click **Create Account**
4. System sends welcome email with password setup link
5. Link expires in 24 hours

---

## Contract Management

### Generating Contracts

1. Go to **Contracts** tab
2. Click **Generate Contract** for a creator
3. Fill in contract details:
   - **Creator Information**: Name, DOB, Address
   - **Revenue Split**: Creator % / Agency %
   - **Contract Term**: Duration in months
   - **Start/End Dates**
   - **Custom Clauses**: Optional additional terms
   - **Agency Details**: Representative, Address, KVK number
   - **Auto-Renewal**: Enable/disable automatic renewal
   - **Termination Notice**: Days required for contract termination
4. Click **Generate PDF**
5. System:
   - Generates PDF contract
   - Stores in Supabase Storage
   - Sends notification email to creator
   - Logs generation in database

### Contract Versions

Three contract templates available:
- **Short**: Basic agreement (5 pages)
- **Medium**: Standard terms (12 pages)
- **Long**: Comprehensive agreement (20 pages)

### Viewing Signed Contracts

1. Navigate to **Signed Contracts** view
2. Filter by:
   - Date range
   - Signature status
   - Creator name
3. Download signed PDFs
4. View signature timestamps

### Contract Amendments

1. Select existing contract
2. Click **Amend Contract**
3. Update terms as needed
4. Requires re-signature from creator

---

## Invoice Management

### Creating Invoices

1. Go to **Invoices** tab
2. Click **Create Invoice**
3. Fill in:
   - Creator (dropdown)
   - Amount (EUR)
   - Due date
   - Description
   - Notes (optional)
4. Click **Create**
5. System auto-generates invoice number (INV-YYYY-XXXX)

### Invoice Statuses

- **Pending**: Awaiting creator confirmation
- **Confirmed**: Creator has confirmed payment
- **Paid**: Admin marked as received
- **Overdue**: Past due date, automatically updated daily

### Confirming Payments

1. Select invoice
2. Verify payment received
3. Click **Mark as Paid**
4. Add confirmation date
5. Invoice status updates to **Paid**

---

## Access Level Management

### Access Level Types

1. **No Access**
   - Default for declined applications
   - Cannot access dashboard
   - Sees "Access Denied" page

2. **Meeting Only**
   - First 2 onboarding steps accessible
   - Can book introductory meeting
   - Limited dashboard access

3. **Full Access**
   - All 10 onboarding steps available
   - Complete dashboard functionality
   - Can upload content, view commitments, etc.

### Access Level Audit Log

View complete history of access changes:
- User affected
- From/To access levels
- Granted by (admin name)
- Grant method (Admin grant, Meeting completion, etc.)
- Reason provided
- Timestamp

---

## Role Management

### Available Roles

- **Creator**: Platform users creating content
- **Manager**: Oversees assigned creators, limited admin access
- **Admin**: Full platform access, can create managers
- **Super Admin**: Cannot be removed if last super admin

### Granting Roles

1. Navigate to **Role Management** tab
2. Enter user email
3. Select role to grant
4. Add reason (required)
5. Click **Grant Role**
6. System logs action with IP address

### Revoking Roles

1. Find user in role management
2. Click **Revoke** next to role
3. Confirm action
4. System creates audit log entry

### Role Permissions

View detailed permissions for each role:
- Resource access (creators, invoices, content, etc.)
- Action permissions (read, create, update, delete)
- Permission inheritance

---

## Content Review

### Reviewing Uploaded Content

1. Go to **Content Review** tab
2. View all creator uploads:
   - Photos
   - Videos
   - Associated commitments/shoots
3. Filter by:
   - Status (pending, approved, rejected)
   - Content type
   - Upload date
   - Creator

### Approving Content

1. Click on content item
2. Review file preview
3. Check description and metadata
4. Click **Approve**
5. Optional: Add marketing notes

### Rejecting Content

1. Select content
2. Click **Reject**
3. Provide rejection reason
4. Creator receives notification

---

## Meeting Management

### Viewing Meetings

Access via **Meetings** tab to see:
- All scheduled meetings
- Meeting status (confirmed, completed, rescheduled)
- Assigned manager
- Meeting type (online/in-person)

### Completing Meetings

1. Select meeting
2. Click **Mark as Complete**
3. Add meeting notes (optional)
4. System automatically:
   - Updates meeting status
   - Grants **full_access** to creator
   - Sends completion notification
   - Updates timeline

### Rescheduling Meetings

1. Select meeting to reschedule
2. Click **Reschedule**
3. Enter new date/time
4. Add reschedule reason
5. System sends updated invitation

---

## Email Logs

### Monitoring Email Delivery

1. Navigate to **Email Logs** tab
2. View all sent emails:
   - Email type (application_received, meeting_invitation, etc.)
   - Recipient
   - Status (sent, failed, pending retry)
   - Sent/Failed timestamp
   - Error messages

### Email Retry System

Failed emails automatically retry with exponential backoff:
- **Attempt 1**: Immediate
- **Attempt 2**: After 5 minutes
- **Attempt 3**: After 10 minutes
- **Attempt 4**: After 20 minutes

### Troubleshooting Email Issues

If emails are failing:
1. Check **Email Logs** for error messages
2. Verify Resend API key is configured
3. Check domain verification at resend.com/domains
4. Review recipient email validity
5. Check rate limiting (different limits per email type)

---

## Best Practices

### Security
- Never share admin credentials
- Log out when finished
- Review audit logs regularly
- Grant roles with clear reasons

### Creator Management
- Respond to applications within 2-3 business days
- Add detailed admin notes for context
- Grant access promptly after meeting completion
- Monitor contract expiry dates

### Communication
- Use professional language in decline reasons
- Provide clear feedback when rejecting content
- Keep meeting notes detailed for future reference

### System Maintenance
- Review email logs weekly
- Check for overdue invoices monthly
- Monitor contract expiry dates
- Keep creator profiles updated

---

## Troubleshooting

### Common Issues

**"Cannot grant access"**
- Verify creator has completed required steps
- Check audit log for recent access changes
- Ensure you have sufficient permissions

**"Email not sending"**
- Check email logs for specific error
- Verify Resend API configuration
- Check domain verification status

**"Contract generation failed"**
- Verify all required fields filled
- Check creator profile completeness
- Review browser console for errors

**"Cannot create manager account"**
- Ensure email not already in use
- Verify email format validity
- Check role assignment permissions

---

## Support

For technical issues or questions:
1. Check troubleshooting section above
2. Review error logs in browser console
3. Contact development team with:
   - Screenshot of error
   - Steps to reproduce
   - User ID or email affected
   - Browser and OS details

---

**Last Updated**: November 2025  
**Version**: 1.0