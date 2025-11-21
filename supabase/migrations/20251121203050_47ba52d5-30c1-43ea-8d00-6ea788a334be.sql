-- Security Improvement: Make user_id columns NOT NULL to strengthen RLS policies
-- This prevents orphaned records and ensures proper authorization checks

-- First, verify no NULL values exist (this will fail if there are any NULL values, which is good)
DO $$
BEGIN
  -- Check creator_access_levels for NULL user_id values
  IF EXISTS (SELECT 1 FROM creator_access_levels WHERE user_id IS NULL) THEN
    RAISE EXCEPTION 'Cannot proceed: Found NULL user_id values in creator_access_levels. Please fix data first.';
  END IF;
  
  -- Check creator_meetings for NULL user_id values
  IF EXISTS (SELECT 1 FROM creator_meetings WHERE user_id IS NULL) THEN
    RAISE EXCEPTION 'Cannot proceed: Found NULL user_id values in creator_meetings. Please fix data first.';
  END IF;
END $$;

-- Make user_id NOT NULL in creator_access_levels
ALTER TABLE creator_access_levels 
ALTER COLUMN user_id SET NOT NULL;

-- Make user_id NOT NULL in creator_meetings
ALTER TABLE creator_meetings 
ALTER COLUMN user_id SET NOT NULL;

-- Add helpful comments for documentation
COMMENT ON COLUMN creator_access_levels.user_id IS 'Required: User ID for access level assignment. Cannot be NULL to ensure proper RLS enforcement.';
COMMENT ON COLUMN creator_meetings.user_id IS 'Required: User ID for meeting assignment. Cannot be NULL to ensure proper RLS enforcement.';