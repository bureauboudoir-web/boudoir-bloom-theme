-- Add meeting reschedule tracking columns
ALTER TABLE creator_meetings
ADD COLUMN IF NOT EXISTS reschedule_requested BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS reschedule_reason TEXT,
ADD COLUMN IF NOT EXISTS reschedule_requested_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS reschedule_new_date TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS reschedule_new_time TIME,
ADD COLUMN IF NOT EXISTS previous_meeting_date TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS previous_meeting_time TIME;

-- Add index for reschedule queries
CREATE INDEX IF NOT EXISTS idx_creator_meetings_reschedule 
ON creator_meetings(user_id, reschedule_requested) 
WHERE reschedule_requested = TRUE;