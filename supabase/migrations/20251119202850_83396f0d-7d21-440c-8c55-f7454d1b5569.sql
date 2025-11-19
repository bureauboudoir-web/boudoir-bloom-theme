-- Fix overpermissive RLS policy on profiles table
-- Drop the policy that allows any authenticated user to access all profiles
DROP POLICY IF EXISTS "Anonymous users cannot access profiles" ON public.profiles;

-- Add explicit DELETE policy for admins only
CREATE POLICY "Only admins can delete profiles" 
ON public.profiles
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));