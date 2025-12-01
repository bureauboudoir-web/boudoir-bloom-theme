-- Add emotional_category column to uploads table for voice training
ALTER TABLE public.uploads 
ADD COLUMN IF NOT EXISTS emotional_category TEXT;

-- Add voice_tool_sync_status column to track sync status with external Voice Tool
ALTER TABLE public.uploads 
ADD COLUMN IF NOT EXISTS voice_tool_sync_status TEXT DEFAULT 'pending';

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_uploads_emotional_category 
ON public.uploads(emotional_category) 
WHERE emotional_category IS NOT NULL;

-- Add comment
COMMENT ON COLUMN public.uploads.emotional_category IS 'Emotional category for voice training samples: happy, sad, excited, calm, angry, neutral';
COMMENT ON COLUMN public.uploads.voice_tool_sync_status IS 'Status of sync with external Voice Tool API: pending, synced, failed';
