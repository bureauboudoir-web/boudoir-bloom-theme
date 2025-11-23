-- Fix John's manager assignment
UPDATE profiles
SET assigned_manager_id = 'd9353e7a-00f3-459b-bfc6-f8d203c36c93'
WHERE email = 'metabelfast@gmail.com';

-- Verify John has creator role
INSERT INTO user_roles (user_id, role)
SELECT id, 'creator'::app_role
FROM profiles
WHERE email = 'metabelfast@gmail.com'
ON CONFLICT DO NOTHING;