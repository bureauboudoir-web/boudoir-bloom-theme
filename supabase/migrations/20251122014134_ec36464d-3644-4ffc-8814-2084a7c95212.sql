-- First, remove duplicate availability records keeping the most recent one
DELETE FROM public.manager_availability a
USING public.manager_availability b
WHERE a.id < b.id 
  AND a.manager_id = b.manager_id 
  AND a.day_of_week = b.day_of_week
  AND a.specific_date IS NULL 
  AND b.specific_date IS NULL;

-- Add unique constraint to prevent future duplicates for weekly availability
-- Constraint: manager can only have one availability slot per day_of_week (when specific_date is null)
CREATE UNIQUE INDEX unique_manager_weekly_availability 
ON public.manager_availability (manager_id, day_of_week) 
WHERE specific_date IS NULL;

-- Add unique constraint for specific date blocks
CREATE UNIQUE INDEX unique_manager_date_block 
ON public.manager_availability (manager_id, specific_date) 
WHERE specific_date IS NOT NULL AND is_available = false;

-- Add a comment explaining the constraints
COMMENT ON INDEX unique_manager_weekly_availability IS 'Ensures each manager has only one weekly availability slot per day';
COMMENT ON INDEX unique_manager_date_block IS 'Ensures each manager has only one block per specific date';