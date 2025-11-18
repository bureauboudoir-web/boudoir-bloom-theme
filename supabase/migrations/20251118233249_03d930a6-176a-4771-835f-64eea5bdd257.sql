-- Add profile picture URL to profiles table
ALTER TABLE public.profiles 
ADD COLUMN profile_picture_url TEXT;

-- Add RLS policy for profile picture uploads in content-uploads bucket
CREATE POLICY "Users can upload their profile pictures"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'content-uploads' 
  AND auth.uid()::text = (storage.foldername(name))[1]
  AND (storage.foldername(name))[2] = 'profile'
);

CREATE POLICY "Users can update their profile pictures"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'content-uploads' 
  AND auth.uid()::text = (storage.foldername(name))[1]
  AND (storage.foldername(name))[2] = 'profile'
);

CREATE POLICY "Users can delete their profile pictures"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'content-uploads' 
  AND auth.uid()::text = (storage.foldername(name))[1]
  AND (storage.foldername(name))[2] = 'profile'
);

CREATE POLICY "Profile pictures are publicly viewable"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'content-uploads'
  AND (storage.foldername(name))[2] = 'profile'
);