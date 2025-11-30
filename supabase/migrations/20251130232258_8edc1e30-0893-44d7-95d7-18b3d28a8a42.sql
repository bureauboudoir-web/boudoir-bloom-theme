-- Add 8 new JSONB columns to onboarding_data for sections 9-16
ALTER TABLE public.onboarding_data 
ADD COLUMN IF NOT EXISTS section_visual_identity JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS section_creator_story JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS section_brand_alignment JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS section_fetish_interests JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS section_engagement_style JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS section_market_positioning JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS section_fan_expectations JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS section_creative_boundaries JSONB DEFAULT '{}';

-- Update the current_step default to support 16 steps
ALTER TABLE public.onboarding_data 
ALTER COLUMN current_step SET DEFAULT 1;

-- Add comment for documentation
COMMENT ON COLUMN public.onboarding_data.section_visual_identity IS 'Visual identity preferences: colors, aesthetic, fonts, logo style, mood board';
COMMENT ON COLUMN public.onboarding_data.section_creator_story IS 'Creator journey: origin, milestones, future goals';
COMMENT ON COLUMN public.onboarding_data.section_brand_alignment IS 'Brand positioning: voice, target audience, unique value';
COMMENT ON COLUMN public.onboarding_data.section_fetish_interests IS 'Fetish/special interests categories (staff-use filtering only)';
COMMENT ON COLUMN public.onboarding_data.section_engagement_style IS 'Communication style, response time, availability';
COMMENT ON COLUMN public.onboarding_data.section_market_positioning IS 'Niche, competitors, differentiators, price tier';
COMMENT ON COLUMN public.onboarding_data.section_fan_expectations IS 'Content frequency, interaction style, exclusive offerings';
COMMENT ON COLUMN public.onboarding_data.section_creative_boundaries IS 'Content limits, collaboration rules, creative control';