-- Create access level audit log table
CREATE TABLE IF NOT EXISTS access_level_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  from_level TEXT NOT NULL,
  to_level TEXT NOT NULL,
  granted_by UUID,
  reason TEXT,
  method TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE access_level_audit_log ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Admins and managers can view audit logs
CREATE POLICY "Admins and managers can view audit logs"
  ON access_level_audit_log FOR SELECT
  USING (
    has_role(auth.uid(), 'admin'::app_role) OR 
    has_role(auth.uid(), 'manager'::app_role) OR 
    has_role(auth.uid(), 'super_admin'::app_role)
  );

-- Add tracking columns to creator_access_levels if not exists
ALTER TABLE creator_access_levels
ADD COLUMN IF NOT EXISTS grant_method TEXT;

-- Update creator_meetings status to support 'not_required'
-- Note: The status column is TEXT, so we can add this value without enum changes
COMMENT ON COLUMN creator_meetings.status IS 'Status values: not_booked, pending, confirmed, completed, cancelled, not_required';