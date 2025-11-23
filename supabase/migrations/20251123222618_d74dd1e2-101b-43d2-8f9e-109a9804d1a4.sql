-- CRITICAL SECURITY FIXES - Phase 6
-- Fix publicly accessible sensitive tables

-- 1. Fix invitation_tokens - Remove public read/write access
DROP POLICY IF EXISTS "System can select tokens" ON invitation_tokens;
DROP POLICY IF EXISTS "System can insert tokens" ON invitation_tokens;
DROP POLICY IF EXISTS "System can update tokens" ON invitation_tokens;

-- Only service role can manage tokens
CREATE POLICY "Service role can manage tokens" ON invitation_tokens
FOR ALL USING (auth.jwt()->>'role' = 'service_role');

-- 2. Fix email_logs - Only service role can write
DROP POLICY IF EXISTS "System can insert email logs" ON email_logs;
DROP POLICY IF EXISTS "System can update email logs" ON email_logs;

CREATE POLICY "Service role can manage email logs" ON email_logs
FOR ALL USING (auth.jwt()->>'role' = 'service_role');

-- Admins can read all logs
CREATE POLICY "Admins can view email logs" ON email_logs
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_roles.user_id = auth.uid() 
    AND user_roles.role IN ('admin', 'super_admin')
  )
);

-- 3. Fix timeline_events - Only service role can insert
DROP POLICY IF EXISTS "System can insert timeline events" ON timeline_events;

CREATE POLICY "Service role can insert timeline events" ON timeline_events
FOR INSERT WITH CHECK (auth.jwt()->>'role' = 'service_role');

-- Users can read their own timeline
CREATE POLICY "Users can read own timeline" ON timeline_events
FOR SELECT USING (user_id = auth.uid());

-- 4. Fix manager_availability - Only show assigned manager availability
DROP POLICY IF EXISTS "Creators can view manager availability" ON manager_availability;

CREATE POLICY "Users can view assigned manager availability" ON manager_availability
FOR SELECT USING (
  manager_id IN (
    SELECT assigned_manager_id FROM profiles WHERE id = auth.uid()
  )
  OR
  EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_roles.user_id = auth.uid() 
    AND user_roles.role IN ('admin', 'super_admin', 'manager')
  )
);

-- 5. Fix sync_logs - Only service role can insert
DROP POLICY IF EXISTS "System can insert sync logs" ON sync_logs;

CREATE POLICY "Service role can insert sync logs" ON sync_logs
FOR INSERT WITH CHECK (auth.jwt()->>'role' = 'service_role');

-- Users can read their own sync logs
CREATE POLICY "Users can read own sync logs" ON sync_logs
FOR SELECT USING (user_id = auth.uid());