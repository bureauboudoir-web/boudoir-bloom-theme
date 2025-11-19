-- Phase 1: Update creator_applications table
ALTER TABLE creator_applications
ADD COLUMN IF NOT EXISTS application_status TEXT DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS admin_notes TEXT,
ADD COLUMN IF NOT EXISTS reviewed_by UUID REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS approval_email_sent_at TIMESTAMP WITH TIME ZONE;

-- Phase 2: Create creator_meetings table
CREATE TABLE IF NOT EXISTS creator_meetings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID REFERENCES creator_applications(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  meeting_date TIMESTAMP WITH TIME ZONE,
  meeting_notes TEXT,
  status TEXT DEFAULT 'not_booked',
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS for creator_meetings
ALTER TABLE creator_meetings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for creator_meetings
CREATE POLICY "Users can view their own meetings"
ON creator_meetings FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own meetings"
ON creator_meetings FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all meetings"
ON creator_meetings FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role IN ('admin', 'manager')
  )
);

-- Phase 3: Create creator_access_levels table
CREATE TABLE IF NOT EXISTS creator_access_levels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  access_level TEXT DEFAULT 'no_access',
  granted_by UUID REFERENCES auth.users(id),
  granted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS for creator_access_levels
ALTER TABLE creator_access_levels ENABLE ROW LEVEL SECURITY;

-- RLS Policies for creator_access_levels
CREATE POLICY "Users can view their own access level"
ON creator_access_levels FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all access levels"
ON creator_access_levels FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role IN ('admin', 'manager')
  )
);

-- Add updated_at triggers
CREATE TRIGGER update_creator_meetings_updated_at
BEFORE UPDATE ON creator_meetings
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_creator_access_levels_updated_at
BEFORE UPDATE ON creator_access_levels
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();