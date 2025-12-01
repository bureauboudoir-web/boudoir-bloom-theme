-- Add step2_body_info JSONB column to onboarding_data table
ALTER TABLE public.onboarding_data
ADD COLUMN IF NOT EXISTS step2_body_info JSONB DEFAULT '{}'::jsonb;

COMMENT ON COLUMN public.onboarding_data.step2_body_info IS 'Step 2: Body Information (pre-meeting) - height, weight, body type, hair color, eye color, tattoos, piercings, distinctive features';