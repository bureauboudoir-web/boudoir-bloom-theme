-- Create email_logs table for tracking all email deliveries
CREATE TABLE IF NOT EXISTS public.email_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email_type TEXT NOT NULL,
  recipient_email TEXT NOT NULL,
  recipient_name TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  retry_count INTEGER NOT NULL DEFAULT 0,
  max_retries INTEGER NOT NULL DEFAULT 3,
  sent_at TIMESTAMP WITH TIME ZONE,
  failed_at TIMESTAMP WITH TIME ZONE,
  last_retry_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  application_id UUID REFERENCES public.creator_applications(id) ON DELETE SET NULL,
  user_id UUID,
  email_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT valid_status CHECK (status IN ('pending', 'sent', 'failed', 'retrying'))
);

-- Enable RLS
ALTER TABLE public.email_logs ENABLE ROW LEVEL SECURITY;

-- Create policies for email_logs
CREATE POLICY "Admins can view all email logs"
  ON public.email_logs
  FOR SELECT
  USING (
    has_role(auth.uid(), 'admin'::app_role) OR 
    has_role(auth.uid(), 'manager'::app_role) OR
    has_role(auth.uid(), 'super_admin'::app_role)
  );

CREATE POLICY "System can insert email logs"
  ON public.email_logs
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "System can update email logs"
  ON public.email_logs
  FOR UPDATE
  USING (true);

-- Create index for faster lookups
CREATE INDEX idx_email_logs_status ON public.email_logs(status);
CREATE INDEX idx_email_logs_application_id ON public.email_logs(application_id);
CREATE INDEX idx_email_logs_created_at ON public.email_logs(created_at DESC);

-- Add trigger for updated_at
CREATE TRIGGER update_email_logs_updated_at
  BEFORE UPDATE ON public.email_logs
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Add admin_notes_history column to track notes changes
ALTER TABLE public.creator_applications 
ADD COLUMN IF NOT EXISTS admin_notes_history JSONB DEFAULT '[]'::jsonb;

-- Create function to log admin note changes
CREATE OR REPLACE FUNCTION public.log_admin_note_change()
RETURNS TRIGGER AS $$
BEGIN
  IF (OLD.admin_notes IS DISTINCT FROM NEW.admin_notes) AND NEW.admin_notes IS NOT NULL THEN
    NEW.admin_notes_history = COALESCE(OLD.admin_notes_history, '[]'::jsonb) || 
      jsonb_build_object(
        'note', NEW.admin_notes,
        'updated_by', auth.uid(),
        'updated_at', now()
      );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for admin notes history
DROP TRIGGER IF EXISTS track_admin_notes_history ON public.creator_applications;
CREATE TRIGGER track_admin_notes_history
  BEFORE UPDATE ON public.creator_applications
  FOR EACH ROW
  EXECUTE FUNCTION public.log_admin_note_change();