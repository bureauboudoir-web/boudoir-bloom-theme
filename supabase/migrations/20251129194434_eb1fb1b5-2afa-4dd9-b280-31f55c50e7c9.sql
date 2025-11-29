-- Add RESTRICTIVE policy to block anonymous access on user_roles
CREATE POLICY "Block anonymous access to user_roles" 
ON public.user_roles AS RESTRICTIVE
FOR ALL
TO public
USING (auth.uid() IS NOT NULL);

-- Convert existing "Block anonymous access" policies from PERMISSIVE to RESTRICTIVE
-- This ensures they effectively block anonymous access

-- profiles table
DROP POLICY IF EXISTS "Block anonymous access to profiles" ON public.profiles;
CREATE POLICY "Block anonymous access to profiles"
ON public.profiles AS RESTRICTIVE
FOR SELECT
TO public
USING (false);

-- creator_applications table
DROP POLICY IF EXISTS "Block anonymous access to creator_applications" ON public.creator_applications;
CREATE POLICY "Block anonymous access to creator_applications"
ON public.creator_applications AS RESTRICTIVE
FOR SELECT
TO public
USING (false);

-- onboarding_data table
DROP POLICY IF EXISTS "Block anonymous access to onboarding_data" ON public.onboarding_data;
CREATE POLICY "Block anonymous access to onboarding_data"
ON public.onboarding_data AS RESTRICTIVE
FOR SELECT
TO public
USING (false);

-- creator_meetings table
DROP POLICY IF EXISTS "Block anonymous access to creator_meetings" ON public.creator_meetings;
CREATE POLICY "Block anonymous access to creator_meetings"
ON public.creator_meetings AS RESTRICTIVE
FOR SELECT
TO public
USING (false);

-- creator_access_levels table
DROP POLICY IF EXISTS "Block anonymous access to creator_access_levels" ON public.creator_access_levels;
CREATE POLICY "Block anonymous access to creator_access_levels"
ON public.creator_access_levels AS RESTRICTIVE
FOR SELECT
TO public
USING (false);

-- content_uploads table
DROP POLICY IF EXISTS "Block anonymous access to content_uploads" ON public.content_uploads;
CREATE POLICY "Block anonymous access to content_uploads"
ON public.content_uploads AS RESTRICTIVE
FOR SELECT
TO public
USING (false);

-- invoices table
DROP POLICY IF EXISTS "Block anonymous access to invoices" ON public.invoices;
CREATE POLICY "Block anonymous access to invoices"
ON public.invoices AS RESTRICTIVE
FOR SELECT
TO public
USING (false);

-- manager_availability table
DROP POLICY IF EXISTS "Block anonymous access to manager_availability" ON public.manager_availability;
CREATE POLICY "Block anonymous access to manager_availability"
ON public.manager_availability AS RESTRICTIVE
FOR SELECT
TO public
USING (false);