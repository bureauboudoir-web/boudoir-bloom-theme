-- Create production_fix_history table for tracking automatic fixes
CREATE TABLE IF NOT EXISTS public.production_fix_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  issue_type TEXT NOT NULL,
  issue_description TEXT NOT NULL,
  fix_applied TEXT NOT NULL,
  applied_by UUID REFERENCES auth.users(id),
  applied_at TIMESTAMPTZ DEFAULT NOW(),
  success BOOLEAN DEFAULT TRUE,
  error_message TEXT,
  rollback_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.production_fix_history ENABLE ROW LEVEL SECURITY;

-- Admins can view all fix history
CREATE POLICY "Admins can view fix history"
  ON public.production_fix_history
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role IN ('admin', 'super_admin')
    )
  );

-- System can insert fix history
CREATE POLICY "System can insert fix history"
  ON public.production_fix_history
  FOR INSERT
  WITH CHECK (auth.uid() = applied_by);

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_production_fix_history_applied_at 
  ON public.production_fix_history(applied_at DESC);

CREATE INDEX IF NOT EXISTS idx_production_fix_history_success 
  ON public.production_fix_history(success);