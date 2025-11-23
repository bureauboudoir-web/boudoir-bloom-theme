-- Add role tracking to access level audit log
ALTER TABLE access_level_audit_log 
ADD COLUMN IF NOT EXISTS granted_by_role app_role;

-- Update existing records with role information from user_roles
UPDATE access_level_audit_log al
SET granted_by_role = (
  SELECT role 
  FROM user_roles ur 
  WHERE ur.user_id = al.granted_by 
  LIMIT 1
)
WHERE granted_by IS NOT NULL AND granted_by_role IS NULL;