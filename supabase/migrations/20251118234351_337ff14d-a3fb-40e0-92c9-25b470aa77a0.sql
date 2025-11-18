-- Add social media and fan platform fields to onboarding_data table
ALTER TABLE public.onboarding_data
ADD COLUMN social_instagram text,
ADD COLUMN social_twitter text,
ADD COLUMN social_tiktok text,
ADD COLUMN social_youtube text,
ADD COLUMN fan_platform_onlyfans text,
ADD COLUMN fan_platform_fansly text,
ADD COLUMN fan_platform_other text;