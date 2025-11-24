-- Create production_test_status table for persistent test tracking
CREATE TABLE IF NOT EXISTS public.production_test_status (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  test_category TEXT NOT NULL,
  test_item TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'pass', 'fail')),
  completed_by UUID REFERENCES auth.users(id),
  completed_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(test_category, test_item)
);

-- Enable RLS
ALTER TABLE public.production_test_status ENABLE ROW LEVEL SECURITY;

-- Admins can manage test status
CREATE POLICY "Admins can manage test status"
  ON public.production_test_status
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid()
      AND role IN ('admin', 'super_admin')
    )
  );

-- Trigger for updated_at
CREATE TRIGGER update_production_test_status_updated_at
  BEFORE UPDATE ON public.production_test_status
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();