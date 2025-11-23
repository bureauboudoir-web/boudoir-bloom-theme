-- Phase 5: Performance Optimization - Add Database Indexes
-- Optimize meeting queries
CREATE INDEX IF NOT EXISTS idx_creator_meetings_user_id 
ON creator_meetings(user_id);

CREATE INDEX IF NOT EXISTS idx_creator_meetings_assigned_manager_id 
ON creator_meetings(assigned_manager_id);

CREATE INDEX IF NOT EXISTS idx_creator_meetings_status 
ON creator_meetings(status);

CREATE INDEX IF NOT EXISTS idx_creator_meetings_date 
ON creator_meetings(meeting_date);

-- Optimize access level queries
CREATE INDEX IF NOT EXISTS idx_creator_access_levels_user_id 
ON creator_access_levels(user_id);

CREATE INDEX IF NOT EXISTS idx_creator_access_levels_access_level 
ON creator_access_levels(access_level);

-- Optimize email logs queries
CREATE INDEX IF NOT EXISTS idx_email_logs_status 
ON email_logs(status);

CREATE INDEX IF NOT EXISTS idx_email_logs_created_at 
ON email_logs(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_email_logs_retry 
ON email_logs(status, retry_count, last_retry_at) 
WHERE status = 'failed' AND retry_count < max_retries;

-- Optimize application queries
CREATE INDEX IF NOT EXISTS idx_creator_applications_status 
ON creator_applications(status);

CREATE INDEX IF NOT EXISTS idx_creator_applications_email 
ON creator_applications(email);

-- Optimize contract queries
CREATE INDEX IF NOT EXISTS idx_creator_contracts_user_id 
ON creator_contracts(user_id);

CREATE INDEX IF NOT EXISTS idx_creator_contracts_signed 
ON creator_contracts(contract_signed);

-- Optimize timeline events
CREATE INDEX IF NOT EXISTS idx_timeline_events_user_id 
ON timeline_events(user_id);

CREATE INDEX IF NOT EXISTS idx_timeline_events_read 
ON timeline_events(user_id, read);

-- Optimize support tickets
CREATE INDEX IF NOT EXISTS idx_support_tickets_user_id 
ON support_tickets(user_id);

CREATE INDEX IF NOT EXISTS idx_support_tickets_status 
ON support_tickets(status);

-- Optimize invoices
CREATE INDEX IF NOT EXISTS idx_invoices_user_id 
ON invoices(user_id);

CREATE INDEX IF NOT EXISTS idx_invoices_status 
ON invoices(status);

CREATE INDEX IF NOT EXISTS idx_invoices_due_date 
ON invoices(due_date);

-- Optimize commitments
CREATE INDEX IF NOT EXISTS idx_weekly_commitments_user_id 
ON weekly_commitments(user_id);

CREATE INDEX IF NOT EXISTS idx_weekly_commitments_status 
ON weekly_commitments(status);

-- Optimize shoots
CREATE INDEX IF NOT EXISTS idx_studio_shoots_user_id 
ON studio_shoots(user_id);

CREATE INDEX IF NOT EXISTS idx_studio_shoots_date 
ON studio_shoots(shoot_date);

-- Optimize content uploads
CREATE INDEX IF NOT EXISTS idx_content_uploads_user_id 
ON content_uploads(user_id);

CREATE INDEX IF NOT EXISTS idx_content_uploads_status 
ON content_uploads(status);