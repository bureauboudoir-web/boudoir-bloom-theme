-- Add invitation tracking fields to email_logs table
ALTER TABLE public.email_logs
ADD COLUMN password_reset_expires_at timestamp with time zone,
ADD COLUMN link_clicked_at timestamp with time zone,
ADD COLUMN link_used_at timestamp with time zone;

-- Create admin_settings table for configurable settings
CREATE TABLE public.admin_settings (
  setting_key text PRIMARY KEY,
  setting_value jsonb NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_by uuid REFERENCES public.profiles(id),
  created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Enable RLS on admin_settings
ALTER TABLE public.admin_settings ENABLE ROW LEVEL SECURITY;

-- Only admins and managers can view settings
CREATE POLICY "Admins can view settings"
ON public.admin_settings
FOR SELECT
USING (
  has_role(auth.uid(), 'admin'::app_role) OR 
  has_role(auth.uid(), 'manager'::app_role) OR 
  has_role(auth.uid(), 'super_admin'::app_role)
);

-- Only admins and managers can update settings
CREATE POLICY "Admins can update settings"
ON public.admin_settings
FOR ALL
USING (
  has_role(auth.uid(), 'admin'::app_role) OR 
  has_role(auth.uid(), 'manager'::app_role) OR 
  has_role(auth.uid(), 'super_admin'::app_role)
);

-- Insert default password reset expiration setting (3600 seconds = 1 hour)
INSERT INTO public.admin_settings (setting_key, setting_value)
VALUES ('password_reset_expiration_seconds', '3600'::jsonb)
ON CONFLICT (setting_key) DO NOTHING;

-- Add trigger to update updated_at timestamp
CREATE TRIGGER update_admin_settings_updated_at
  BEFORE UPDATE ON public.admin_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();