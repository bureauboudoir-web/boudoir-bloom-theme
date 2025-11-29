-- ============================================================================
-- COMPREHENSIVE SECURITY HARDENING - RESTRICTIVE RLS POLICIES
-- Applies the user_roles pattern to ALL sensitive tables
-- ============================================================================

-- Step 1: Drop ALL existing "Block anonymous" policies (both working and broken)
DROP POLICY IF EXISTS "Block anonymous access to profiles" ON public.profiles;
DROP POLICY IF EXISTS "Block anonymous access to onboarding_data" ON public.onboarding_data;
DROP POLICY IF EXISTS "Block anonymous access to creator_applications" ON public.creator_applications;
DROP POLICY IF EXISTS "Block anonymous access to creator_accounts" ON public.creator_accounts;
DROP POLICY IF EXISTS "Block anonymous access to content_uploads" ON public.content_uploads;
DROP POLICY IF EXISTS "Block anonymous access to invoices" ON public.invoices;
DROP POLICY IF EXISTS "Block anonymous access to creator_meetings" ON public.creator_meetings;
DROP POLICY IF EXISTS "Block anonymous access to manager_availability" ON public.manager_availability;
DROP POLICY IF EXISTS "Block anonymous access to google_drive_connections" ON public.google_drive_connections;
DROP POLICY IF EXISTS "Block anonymous access to fastcast_content_settings" ON public.fastcast_content_settings;
DROP POLICY IF EXISTS "Block anonymous access to support_tickets" ON public.support_tickets;
DROP POLICY IF EXISTS "Block anonymous access to weekly_commitments" ON public.weekly_commitments;
DROP POLICY IF EXISTS "Block anonymous access to studio_shoots" ON public.studio_shoots;
DROP POLICY IF EXISTS "Block anonymous access to email_logs" ON public.email_logs;
DROP POLICY IF EXISTS "Block anonymous access to shoot_participants" ON public.shoot_participants;
DROP POLICY IF EXISTS "Block anonymous access to role_audit_logs" ON public.role_audit_logs;
DROP POLICY IF EXISTS "Block anonymous access to permissions" ON public.permissions;
DROP POLICY IF EXISTS "Block anonymous access to role_permissions" ON public.role_permissions;
DROP POLICY IF EXISTS "Block anonymous access to creator_access_levels" ON public.creator_access_levels;
DROP POLICY IF EXISTS "Block anonymous access to creator_gdrive_folders" ON public.creator_gdrive_folders;
DROP POLICY IF EXISTS "Block anonymous access to gdrive_file_syncs" ON public.gdrive_file_syncs;

-- Step 2: Create RESTRICTIVE policies for ALL sensitive tables
-- Pattern: auth.uid() IS NOT NULL ensures ONLY authenticated users can access

CREATE POLICY "Block anonymous access to profiles"
ON public.profiles AS RESTRICTIVE
FOR ALL TO public
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Block anonymous access to onboarding_data"
ON public.onboarding_data AS RESTRICTIVE
FOR ALL TO public
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Block anonymous access to creator_applications"
ON public.creator_applications AS RESTRICTIVE
FOR ALL TO public
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Block anonymous access to creator_accounts"
ON public.creator_accounts AS RESTRICTIVE
FOR ALL TO public
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Block anonymous access to content_uploads"
ON public.content_uploads AS RESTRICTIVE
FOR ALL TO public
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Block anonymous access to invoices"
ON public.invoices AS RESTRICTIVE
FOR ALL TO public
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Block anonymous access to creator_meetings"
ON public.creator_meetings AS RESTRICTIVE
FOR ALL TO public
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Block anonymous access to manager_availability"
ON public.manager_availability AS RESTRICTIVE
FOR ALL TO public
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Block anonymous access to google_drive_connections"
ON public.google_drive_connections AS RESTRICTIVE
FOR ALL TO public
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Block anonymous access to fastcast_content_settings"
ON public.fastcast_content_settings AS RESTRICTIVE
FOR ALL TO public
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Block anonymous access to support_tickets"
ON public.support_tickets AS RESTRICTIVE
FOR ALL TO public
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Block anonymous access to weekly_commitments"
ON public.weekly_commitments AS RESTRICTIVE
FOR ALL TO public
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Block anonymous access to studio_shoots"
ON public.studio_shoots AS RESTRICTIVE
FOR ALL TO public
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Block anonymous access to email_logs"
ON public.email_logs AS RESTRICTIVE
FOR ALL TO public
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Block anonymous access to shoot_participants"
ON public.shoot_participants AS RESTRICTIVE
FOR ALL TO public
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Block anonymous access to role_audit_logs"
ON public.role_audit_logs AS RESTRICTIVE
FOR ALL TO public
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Block anonymous access to permissions"
ON public.permissions AS RESTRICTIVE
FOR ALL TO public
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Block anonymous access to role_permissions"
ON public.role_permissions AS RESTRICTIVE
FOR ALL TO public
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Block anonymous access to creator_access_levels"
ON public.creator_access_levels AS RESTRICTIVE
FOR ALL TO public
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Block anonymous access to creator_gdrive_folders"
ON public.creator_gdrive_folders AS RESTRICTIVE
FOR ALL TO public
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Block anonymous access to gdrive_file_syncs"
ON public.gdrive_file_syncs AS RESTRICTIVE
FOR ALL TO public
USING (auth.uid() IS NOT NULL);