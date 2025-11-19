-- Phase 1: Critical Security Fixes
-- Add explicit policies blocking anonymous access to sensitive tables containing PII

-- Block anonymous access to profiles (contains email, phone, PII)
CREATE POLICY "Block anonymous access to profiles"
ON public.profiles
FOR SELECT
TO anon
USING (false);

-- Block anonymous access to onboarding_data (contains sensitive personal and financial data)
CREATE POLICY "Block anonymous access to onboarding_data"
ON public.onboarding_data
FOR SELECT
TO anon
USING (false);

-- Block anonymous access to creator_applications (contains personal contact info)
CREATE POLICY "Block anonymous access to creator_applications"
ON public.creator_applications
FOR SELECT
TO anon
USING (false);

-- Block anonymous access to invoices (contains financial data)
CREATE POLICY "Block anonymous access to invoices"
ON public.invoices
FOR SELECT
TO anon
USING (false);

-- Block anonymous access to support_tickets (contains user messages and data)
CREATE POLICY "Block anonymous access to support_tickets"
ON public.support_tickets
FOR SELECT
TO anon
USING (false);

-- Block anonymous access to user_roles (contains role assignments)
CREATE POLICY "Block anonymous access to user_roles"
ON public.user_roles
FOR SELECT
TO anon
USING (false);

-- Block anonymous access to creator_access_levels (contains access level data)
CREATE POLICY "Block anonymous access to creator_access_levels"
ON public.creator_access_levels
FOR SELECT
TO anon
USING (false);

-- Block anonymous access to creator_meetings (contains meeting data)
CREATE POLICY "Block anonymous access to creator_meetings"
ON public.creator_meetings
FOR SELECT
TO anon
USING (false);

-- Block anonymous access to manager_availability (contains manager schedules)
CREATE POLICY "Block anonymous access to manager_availability"
ON public.manager_availability
FOR SELECT
TO anon
USING (false);

-- Block anonymous access to content_uploads (contains user content)
CREATE POLICY "Block anonymous access to content_uploads"
ON public.content_uploads
FOR SELECT
TO anon
USING (false);

-- Block anonymous access to studio_shoots (contains shoot data)
CREATE POLICY "Block anonymous access to studio_shoots"
ON public.studio_shoots
FOR SELECT
TO anon
USING (false);

-- Block anonymous access to weekly_commitments (contains commitment data)
CREATE POLICY "Block anonymous access to weekly_commitments"
ON public.weekly_commitments
FOR SELECT
TO anon
USING (false);