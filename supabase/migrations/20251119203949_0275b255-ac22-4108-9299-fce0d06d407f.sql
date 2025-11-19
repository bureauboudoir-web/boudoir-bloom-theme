-- Fix orphaned approved applications by creating missing meeting records
-- This finds applications that have been approved but don't have a meeting record

INSERT INTO public.creator_meetings (application_id, user_id, status, created_at, updated_at)
SELECT 
  ca.id as application_id,
  p.id as user_id,
  'not_booked' as status,
  NOW() as created_at,
  NOW() as updated_at
FROM public.creator_applications ca
JOIN public.profiles p ON p.email = ca.email
LEFT JOIN public.creator_meetings cm ON cm.application_id = ca.id
WHERE ca.status = 'approved' 
  AND cm.id IS NULL;

-- Log the fix
DO $$
DECLARE
  fixed_count INTEGER;
BEGIN
  GET DIAGNOSTICS fixed_count = ROW_COUNT;
  RAISE NOTICE 'Fixed % orphaned approved applications', fixed_count;
END $$;