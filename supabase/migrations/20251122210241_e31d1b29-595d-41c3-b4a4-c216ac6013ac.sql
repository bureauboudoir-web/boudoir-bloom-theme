-- Add new columns to studio_shoots table
ALTER TABLE public.studio_shoots
ADD COLUMN IF NOT EXISTS shoot_type TEXT CHECK (shoot_type IN ('solo', 'duo', 'group', 'couples')),
ADD COLUMN IF NOT EXISTS crew_size INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS video_staff_name TEXT,
ADD COLUMN IF NOT EXISTS photo_staff_name TEXT,
ADD COLUMN IF NOT EXISTS equipment_needed TEXT,
ADD COLUMN IF NOT EXISTS duration_hours NUMERIC,
ADD COLUMN IF NOT EXISTS budget NUMERIC,
ADD COLUMN IF NOT EXISTS special_requirements TEXT;

-- Add new columns to weekly_commitments table
ALTER TABLE public.weekly_commitments
ADD COLUMN IF NOT EXISTS priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
ADD COLUMN IF NOT EXISTS due_date DATE,
ADD COLUMN IF NOT EXISTS estimated_time_hours NUMERIC,
ADD COLUMN IF NOT EXISTS assigned_by_name TEXT,
ADD COLUMN IF NOT EXISTS revision_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS completed_at TIMESTAMP WITH TIME ZONE;

-- Create indexes for better query performance (skip if exists)
CREATE INDEX IF NOT EXISTS idx_studio_shoots_shoot_type ON public.studio_shoots(shoot_type);
CREATE INDEX IF NOT EXISTS idx_weekly_commitments_priority ON public.weekly_commitments(priority);
CREATE INDEX IF NOT EXISTS idx_weekly_commitments_due_date ON public.weekly_commitments(due_date);
CREATE INDEX IF NOT EXISTS idx_content_uploads_status ON public.content_uploads(status);