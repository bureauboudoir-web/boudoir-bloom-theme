-- Add missing step8_socials column for Socials/Platforms data
ALTER TABLE public.onboarding_data 
ADD COLUMN IF NOT EXISTS step8_socials jsonb DEFAULT '{}'::jsonb;