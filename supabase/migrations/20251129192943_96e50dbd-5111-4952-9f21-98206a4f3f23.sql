-- Add creator_status field to profiles
ALTER TABLE public.profiles ADD COLUMN creator_status text DEFAULT 'applied';

-- Add check constraint for valid values
ALTER TABLE public.profiles ADD CONSTRAINT valid_creator_status 
CHECK (creator_status IN ('applied', 'approved', 'onboarding_in_progress', 'onboarding_complete', 'full_access'));

-- Create function to update creator_status when onboarding completes
CREATE OR REPLACE FUNCTION public.update_creator_status_on_onboarding_complete()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.is_completed = true AND (OLD.is_completed IS NULL OR OLD.is_completed = false) THEN
    UPDATE public.profiles 
    SET creator_status = 'onboarding_complete' 
    WHERE id = NEW.user_id;
  END IF;
  RETURN NEW;
END;
$$;

-- Create trigger for onboarding completion
DROP TRIGGER IF EXISTS trigger_update_status_on_onboarding_complete ON public.onboarding_data;
CREATE TRIGGER trigger_update_status_on_onboarding_complete
  AFTER UPDATE ON public.onboarding_data
  FOR EACH ROW
  EXECUTE FUNCTION public.update_creator_status_on_onboarding_complete();

-- Create function to update creator_status when full_access granted
CREATE OR REPLACE FUNCTION public.update_creator_status_on_access_granted()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.access_level = 'full_access' AND (OLD.access_level IS NULL OR OLD.access_level != 'full_access') THEN
    UPDATE public.profiles 
    SET creator_status = 'full_access' 
    WHERE id = NEW.user_id;
  END IF;
  RETURN NEW;
END;
$$;

-- Create trigger for access level changes
DROP TRIGGER IF EXISTS trigger_update_status_on_access_granted ON public.creator_access_levels;
CREATE TRIGGER trigger_update_status_on_access_granted
  AFTER INSERT OR UPDATE ON public.creator_access_levels
  FOR EACH ROW
  EXECUTE FUNCTION public.update_creator_status_on_access_granted();