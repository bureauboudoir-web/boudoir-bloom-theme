-- Add Step 11 column for Requirements & Commitments
ALTER TABLE onboarding_data 
ADD COLUMN IF NOT EXISTS step11_commitments JSONB DEFAULT '{}';

-- Update column comments for clarity (11-step model)
COMMENT ON COLUMN onboarding_data.step1_private_info IS 'Step 1: Private Information (Admin-only)';
COMMENT ON COLUMN onboarding_data.step2_brand_identity IS 'Step 2: Brand & Character Identity';
COMMENT ON COLUMN onboarding_data.step3_amsterdam_story IS 'Step 3: Amsterdam Story';
COMMENT ON COLUMN onboarding_data.step4_persona IS 'Step 4: Persona & Character Personality';
COMMENT ON COLUMN onboarding_data.step5_boundaries IS 'Step 5: Boundaries & Comfort Levels';
COMMENT ON COLUMN onboarding_data.step6_pricing IS 'Step 6: Pricing Strategy';
COMMENT ON COLUMN onboarding_data.step7_messaging IS 'Step 7: Scripts & Messaging Style';
COMMENT ON COLUMN onboarding_data.step8_content_preferences IS 'Step 8: Socials & Platforms';
COMMENT ON COLUMN onboarding_data.step9_market_positioning IS 'Step 9: Content Preferences';
COMMENT ON COLUMN onboarding_data.step10_commitments IS 'Step 10: Market Positioning (OLD - keeping for backwards compatibility)';
COMMENT ON COLUMN onboarding_data.step11_commitments IS 'Step 11: Requirements & Commitments (Admin-only)';