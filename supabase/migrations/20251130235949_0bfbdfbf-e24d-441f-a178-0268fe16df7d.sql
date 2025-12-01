-- Fix the test creator account (34d1a7e4-a121-4b40-821d-89ff13e29264)

-- Add creator role
INSERT INTO user_roles (user_id, role) 
VALUES ('34d1a7e4-a121-4b40-821d-89ff13e29264', 'creator')
ON CONFLICT DO NOTHING;

-- Add full_access level
INSERT INTO creator_access_levels (user_id, access_level, grant_method, granted_at, granted_by)
VALUES (
  '34d1a7e4-a121-4b40-821d-89ff13e29264',
  'full_access',
  'test_account_creation',
  now(),
  '34d1a7e4-a121-4b40-821d-89ff13e29264'
)
ON CONFLICT (user_id) DO UPDATE SET access_level = 'full_access';

-- Update profile to onboarding_in_progress
UPDATE profiles 
SET creator_status = 'onboarding_in_progress'
WHERE id = '34d1a7e4-a121-4b40-821d-89ff13e29264';

-- Update onboarding_data to 15/16 completed
UPDATE onboarding_data 
SET 
  current_step = 16,
  completed_steps = ARRAY[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],
  is_completed = false
WHERE user_id = '34d1a7e4-a121-4b40-821d-89ff13e29264';