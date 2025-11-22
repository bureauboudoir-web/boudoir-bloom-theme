-- Fix existing self-assigned meeting data
UPDATE creator_meetings
SET assigned_manager_id = NULL
WHERE user_id = assigned_manager_id;

-- Add check constraint to prevent self-assignment in creator_meetings
ALTER TABLE creator_meetings
ADD CONSTRAINT prevent_self_assignment 
CHECK (user_id != assigned_manager_id OR assigned_manager_id IS NULL);

-- Add comment for documentation
COMMENT ON CONSTRAINT prevent_self_assignment ON creator_meetings IS 
'Prevents users from being assigned as their own meeting manager';