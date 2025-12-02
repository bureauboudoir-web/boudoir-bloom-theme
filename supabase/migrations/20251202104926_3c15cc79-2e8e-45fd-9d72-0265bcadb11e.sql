-- Drop the conflicting policy that blocks ALL anonymous access
DROP POLICY IF EXISTS "Block anonymous access to creator_applications" ON public.creator_applications;

-- Add new policy to allow anonymous users to submit applications
CREATE POLICY "allow_anon_insert_for_signup" 
ON public.creator_applications
FOR INSERT 
TO anon
WITH CHECK (true);