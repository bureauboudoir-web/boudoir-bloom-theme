-- Add Telegram and business phone fields to onboarding_data
ALTER TABLE public.onboarding_data
ADD COLUMN social_telegram text,
ADD COLUMN business_phone text;