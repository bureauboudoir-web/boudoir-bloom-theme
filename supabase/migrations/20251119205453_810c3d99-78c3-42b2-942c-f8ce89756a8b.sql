-- Create manager_availability table for scheduling
CREATE TABLE public.manager_availability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  manager_id UUID NOT NULL,
  day_of_week INTEGER CHECK (day_of_week >= 0 AND day_of_week <= 6),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  specific_date DATE,
  is_available BOOLEAN DEFAULT true,
  meeting_duration_minutes INTEGER DEFAULT 60,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  CONSTRAINT valid_time_range CHECK (end_time > start_time)
);

-- Enable RLS on manager_availability
ALTER TABLE public.manager_availability ENABLE ROW LEVEL SECURITY;

-- RLS Policies for manager_availability
CREATE POLICY "Managers can manage their own availability"
ON public.manager_availability
FOR ALL
USING (
  auth.uid() = manager_id AND 
  (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'manager'::app_role))
);

CREATE POLICY "Creators can view manager availability"
ON public.manager_availability
FOR SELECT
USING (is_available = true);

-- Update creator_meetings table with new fields
ALTER TABLE public.creator_meetings
ADD COLUMN assigned_manager_id UUID,
ADD COLUMN meeting_time TIME,
ADD COLUMN meeting_type TEXT CHECK (meeting_type IN ('in_person', 'online')),
ADD COLUMN meeting_location TEXT,
ADD COLUMN meeting_link TEXT,
ADD COLUMN duration_minutes INTEGER DEFAULT 60;

-- Update status enum values (drop and recreate with new values)
ALTER TABLE public.creator_meetings 
ALTER COLUMN status DROP DEFAULT;

UPDATE public.creator_meetings 
SET status = 'not_booked' 
WHERE status IS NULL OR status = '';

ALTER TABLE public.creator_meetings 
ALTER COLUMN status SET DEFAULT 'not_booked';

-- Add trigger for updated_at on manager_availability
CREATE TRIGGER update_manager_availability_updated_at
BEFORE UPDATE ON public.manager_availability
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();