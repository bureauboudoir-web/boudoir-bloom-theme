-- Add preferred_language column to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS preferred_language TEXT DEFAULT 'en';

-- Add constraint to ensure valid language codes
ALTER TABLE profiles 
ADD CONSTRAINT valid_language_code 
CHECK (preferred_language IN ('en', 'es', 'it', 'ru', 'fr'));

-- Add index for performance
CREATE INDEX IF NOT EXISTS idx_profiles_language ON profiles(preferred_language);