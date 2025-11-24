-- Add new columns to creator_meetings table for enhanced meeting management

-- Add meeting purpose/category
ALTER TABLE creator_meetings 
ADD COLUMN IF NOT EXISTS meeting_purpose text CHECK (meeting_purpose IN (
  'onboarding',
  'follow_up',
  'feedback',
  'studio_shoot',
  'manager_internal',
  'other'
)) DEFAULT 'onboarding';

-- Add meeting priority
ALTER TABLE creator_meetings
ADD COLUMN IF NOT EXISTS priority text CHECK (priority IN ('low', 'medium', 'high', 'urgent')) DEFAULT 'medium';

-- Add participant info for internal meetings
ALTER TABLE creator_meetings
ADD COLUMN IF NOT EXISTS participant_user_id uuid REFERENCES auth.users(id);

-- Add meeting agenda and action items
ALTER TABLE creator_meetings
ADD COLUMN IF NOT EXISTS meeting_agenda text;

ALTER TABLE creator_meetings
ADD COLUMN IF NOT EXISTS action_items jsonb;

-- Add meeting series info
ALTER TABLE creator_meetings
ADD COLUMN IF NOT EXISTS is_recurring boolean DEFAULT false;

ALTER TABLE creator_meetings
ADD COLUMN IF NOT EXISTS recurrence_pattern text;

ALTER TABLE creator_meetings
ADD COLUMN IF NOT EXISTS parent_meeting_id uuid REFERENCES creator_meetings(id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_meetings_purpose ON creator_meetings(meeting_purpose);
CREATE INDEX IF NOT EXISTS idx_meetings_status ON creator_meetings(status);
CREATE INDEX IF NOT EXISTS idx_meetings_date ON creator_meetings(meeting_date);
CREATE INDEX IF NOT EXISTS idx_meetings_assigned_manager ON creator_meetings(assigned_manager_id);
CREATE INDEX IF NOT EXISTS idx_meetings_participant ON creator_meetings(participant_user_id);

-- Add comments for clarity
COMMENT ON COLUMN creator_meetings.meeting_type IS 'Meeting format: online or in_person';
COMMENT ON COLUMN creator_meetings.meeting_purpose IS 'Meeting purpose/category: onboarding, follow_up, feedback, studio_shoot, manager_internal, other';