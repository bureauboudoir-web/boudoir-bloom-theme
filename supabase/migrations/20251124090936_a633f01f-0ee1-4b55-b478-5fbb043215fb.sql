-- Add unique constraint to production_test_status for upsert operations
ALTER TABLE public.production_test_status
ADD CONSTRAINT unique_test_category_item UNIQUE (test_category, test_item);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_production_test_status_category 
ON public.production_test_status(test_category, status);

-- Insert initial manual verification items
INSERT INTO public.production_test_status (test_category, test_item, status, notes) VALUES
  ('manual', 'User Role Assignment Test', 'pending', 'Manually verify admin, manager, and creator role assignments'),
  ('manual', 'Contract Workflow Test', 'pending', 'Test complete contract generation and signing flow'),
  ('manual', 'Meeting Scheduling Test', 'pending', 'Verify meeting booking and reschedule functionality'),
  ('manual', 'Content Upload Test', 'pending', 'Test content upload and review process'),
  ('manual', 'Invoice Management Test', 'pending', 'Verify invoice creation and payment confirmation'),
  ('manual', 'Email Delivery Test', 'pending', 'Check email sending for all notification types'),
  ('manual', 'Mobile Responsiveness Test', 'pending', 'Test all pages on mobile devices')
ON CONFLICT (test_category, test_item) DO NOTHING;