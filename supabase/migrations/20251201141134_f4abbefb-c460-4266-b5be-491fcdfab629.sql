-- Create storage bucket for onboarding exports
INSERT INTO storage.buckets (id, name, public)
VALUES ('onboarding-exports', 'onboarding-exports', false)
ON CONFLICT (id) DO NOTHING;

-- Create RLS policies for onboarding exports bucket
-- Admin can access all exports
CREATE POLICY "Admins can view all onboarding exports"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'onboarding-exports' 
  AND EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_roles.user_id = auth.uid() 
    AND user_roles.role IN ('admin', 'super_admin')
  )
);

-- Creators can only view their own exports
CREATE POLICY "Creators can view their own onboarding exports"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'onboarding-exports'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Only service role can insert (via edge function)
CREATE POLICY "Service role can insert onboarding exports"
ON storage.objects FOR INSERT
TO service_role
WITH CHECK (bucket_id = 'onboarding-exports');