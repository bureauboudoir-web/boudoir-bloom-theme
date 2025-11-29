-- Create fastcast_content_settings table
CREATE TABLE public.fastcast_content_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  external_api_key TEXT,
  bb_api_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add unique constraint on user_id (one row per user)
CREATE UNIQUE INDEX fastcast_content_settings_user_id_idx 
  ON public.fastcast_content_settings(user_id);

-- Add trigger for updated_at
CREATE TRIGGER update_fastcast_content_settings_updated_at
  BEFORE UPDATE ON public.fastcast_content_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE public.fastcast_content_settings ENABLE ROW LEVEL SECURITY;

-- RLS: Users can view their own settings
CREATE POLICY "Users can view own settings"
  ON public.fastcast_content_settings FOR SELECT
  USING (auth.uid() = user_id);

-- RLS: Users can insert their own settings
CREATE POLICY "Users can insert own settings"
  ON public.fastcast_content_settings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS: Users can update their own settings
CREATE POLICY "Users can update own settings"
  ON public.fastcast_content_settings FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS: Admins can view all settings
CREATE POLICY "Admins can view all settings"
  ON public.fastcast_content_settings FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role));