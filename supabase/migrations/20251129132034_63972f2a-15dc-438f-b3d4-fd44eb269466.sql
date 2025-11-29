-- Create creator_content_preferences table
CREATE TABLE public.creator_content_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID NOT NULL,
  primary_color TEXT,
  secondary_color TEXT,
  accent_color TEXT,
  vibe TEXT,
  sample_image_urls TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add comment for documentation
COMMENT ON TABLE public.creator_content_preferences IS 'Stores content style preferences for creators (colors, vibe, sample images)';

-- Create trigger to auto-update updated_at timestamp
CREATE TRIGGER update_creator_content_preferences_updated_at
  BEFORE UPDATE ON public.creator_content_preferences
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();