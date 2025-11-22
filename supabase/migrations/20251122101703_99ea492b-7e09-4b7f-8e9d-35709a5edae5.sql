-- Add assigned_manager_id to profiles table
ALTER TABLE profiles ADD COLUMN assigned_manager_id UUID REFERENCES auth.users(id);

-- Create index for faster lookups
CREATE INDEX idx_profiles_assigned_manager ON profiles(assigned_manager_id);

-- Add comment
COMMENT ON COLUMN profiles.assigned_manager_id IS 'The manager assigned to this creator profile';
