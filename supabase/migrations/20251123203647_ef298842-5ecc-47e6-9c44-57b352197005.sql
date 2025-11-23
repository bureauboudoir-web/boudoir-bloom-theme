-- Fix RLS policy for contract downloads
DROP POLICY IF EXISTS "Creators can view their own contracts" ON storage.objects;

-- Create corrected policy with proper index [2] for user ID in path
CREATE POLICY "Creators can view their own contracts"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'contracts' 
  AND (auth.uid())::text = (storage.foldername(name))[2]
);