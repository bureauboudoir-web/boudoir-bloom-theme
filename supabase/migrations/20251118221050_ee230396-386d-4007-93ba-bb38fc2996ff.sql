-- Update storage policies to allow admins to download files
-- Drop existing admin view policy if exists
DROP POLICY IF EXISTS "Admins can view all content in uploads" ON storage.objects;

-- Create new policy for admins to select (view) all content
CREATE POLICY "Admins can download all content"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'content-uploads' AND
  (
    auth.uid()::text = (storage.foldername(name))[1] OR
    public.has_role(auth.uid(), 'admin') OR 
    public.has_role(auth.uid(), 'manager')
  )
);

-- Allow users to update their own files (for deletion)
CREATE POLICY "Users can update their own content"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'content-uploads' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to delete their own files
CREATE POLICY "Users can delete their own content"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'content-uploads' AND
  auth.uid()::text = (storage.foldername(name))[1]
);