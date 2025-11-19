-- Phase 1: Fix Critical Bugs and Security Issues

-- Step 1: Fix Foreign Key Relationships
-- Drop existing foreign keys that might reference auth.users
ALTER TABLE public.content_uploads DROP CONSTRAINT IF EXISTS content_uploads_user_id_fkey;
ALTER TABLE public.invoices DROP CONSTRAINT IF EXISTS invoices_user_id_fkey;
ALTER TABLE public.studio_shoots DROP CONSTRAINT IF EXISTS studio_shoots_user_id_fkey;
ALTER TABLE public.weekly_commitments DROP CONSTRAINT IF EXISTS weekly_commitments_user_id_fkey;
ALTER TABLE public.support_tickets DROP CONSTRAINT IF EXISTS support_tickets_user_id_fkey;
ALTER TABLE public.onboarding_data DROP CONSTRAINT IF EXISTS onboarding_data_user_id_fkey;

-- Add foreign keys to profiles table instead
ALTER TABLE public.content_uploads
  ADD CONSTRAINT content_uploads_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.invoices
  ADD CONSTRAINT invoices_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.studio_shoots
  ADD CONSTRAINT studio_shoots_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.weekly_commitments
  ADD CONSTRAINT weekly_commitments_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.support_tickets
  ADD CONSTRAINT support_tickets_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.onboarding_data
  ADD CONSTRAINT onboarding_data_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- Step 2: Add Missing RLS Policies for Sensitive Tables

-- Profiles: Add admin access and deny anonymous
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Anonymous users cannot access profiles" ON public.profiles;

CREATE POLICY "Admins can view all profiles" 
ON public.profiles 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'manager'::app_role));

CREATE POLICY "Anonymous users cannot access profiles" 
ON public.profiles 
FOR ALL 
USING (auth.uid() IS NOT NULL);

-- Onboarding Data: Add admin access
DROP POLICY IF EXISTS "Admins can view all onboarding data" ON public.onboarding_data;

CREATE POLICY "Admins can view all onboarding data" 
ON public.onboarding_data 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'manager'::app_role));

-- Creator Applications: Add admin access and deny anonymous
DROP POLICY IF EXISTS "Admins can view all applications" ON public.creator_applications;
DROP POLICY IF EXISTS "Admins can update applications" ON public.creator_applications;
DROP POLICY IF EXISTS "Anonymous users cannot view applications" ON public.creator_applications;

CREATE POLICY "Admins can view all applications" 
ON public.creator_applications 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'manager'::app_role));

CREATE POLICY "Admins can update applications" 
ON public.creator_applications 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'manager'::app_role));

CREATE POLICY "Admins can delete applications" 
ON public.creator_applications 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Content Uploads: Add DELETE policy
DROP POLICY IF EXISTS "Admins can delete uploads" ON public.content_uploads;
DROP POLICY IF EXISTS "Users can delete their own uploads" ON public.content_uploads;

CREATE POLICY "Admins can delete uploads" 
ON public.content_uploads 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'manager'::app_role));

CREATE POLICY "Users can delete their own uploads" 
ON public.content_uploads 
FOR DELETE 
USING (auth.uid() = user_id);

-- Support Tickets: Add creator update policy for marking response as viewed
DROP POLICY IF EXISTS "Users can update their viewed status" ON public.support_tickets;

CREATE POLICY "Users can update their viewed status" 
ON public.support_tickets 
FOR UPDATE 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Step 3: Add Indexes for Performance
CREATE INDEX IF NOT EXISTS idx_content_uploads_user_id ON public.content_uploads(user_id);
CREATE INDEX IF NOT EXISTS idx_content_uploads_status ON public.content_uploads(status);
CREATE INDEX IF NOT EXISTS idx_invoices_user_id ON public.invoices(user_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON public.invoices(status);
CREATE INDEX IF NOT EXISTS idx_invoices_due_date ON public.invoices(due_date);
CREATE INDEX IF NOT EXISTS idx_studio_shoots_user_id ON public.studio_shoots(user_id);
CREATE INDEX IF NOT EXISTS idx_studio_shoots_shoot_date ON public.studio_shoots(shoot_date);
CREATE INDEX IF NOT EXISTS idx_weekly_commitments_user_id ON public.weekly_commitments(user_id);
CREATE INDEX IF NOT EXISTS idx_support_tickets_user_id ON public.support_tickets(user_id);
CREATE INDEX IF NOT EXISTS idx_support_tickets_status ON public.support_tickets(status);
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles(user_id);

-- Step 4: Add Check Constraints for Data Integrity
ALTER TABLE public.invoices 
  DROP CONSTRAINT IF EXISTS invoices_amount_positive,
  ADD CONSTRAINT invoices_amount_positive CHECK (amount > 0);

ALTER TABLE public.content_uploads 
  DROP CONSTRAINT IF EXISTS content_uploads_file_size_positive,
  ADD CONSTRAINT content_uploads_file_size_positive CHECK (file_size > 0 OR file_size IS NULL);