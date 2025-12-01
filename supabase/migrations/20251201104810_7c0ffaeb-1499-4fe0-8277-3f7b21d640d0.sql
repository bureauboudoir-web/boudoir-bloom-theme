-- Phase 1: Add new JSONB columns for 10-step onboarding structure
ALTER TABLE onboarding_data
ADD COLUMN IF NOT EXISTS step1_private_info JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS step2_brand_identity JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS step3_amsterdam_story JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS step4_persona JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS step5_boundaries JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS step6_pricing JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS step7_messaging JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS step8_content_preferences JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS step9_market_positioning JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS step10_commitments JSONB DEFAULT '{}'::jsonb;

-- Migrate existing 16-step data to new 10-step structure
UPDATE onboarding_data SET
  -- Step 1: Private Information (Admin/Manager only)
  step1_private_info = jsonb_build_object(
    'real_name', personal_full_name,
    'date_of_birth', personal_date_of_birth::text,
    'nationality', personal_nationality,
    'full_address', personal_location,
    'phone_number', personal_phone_number,
    'emergency_contact', personal_emergency_contact,
    'emergency_phone', personal_emergency_phone
  ),
  
  -- Step 2: Brand & Character Identity (NEW)
  step2_brand_identity = jsonb_build_object(
    'stage_name', persona_stage_name,
    'character_phone', business_phone,
    'character_email', personal_email,
    'bio_short', persona_description,
    'persona_keywords', '[]'::jsonb,
    'brand_color_palette', '[]'::jsonb,
    'banner_style_option', COALESCE(section_visual_identity->>'aesthetic', '')
  ),
  
  -- Step 3: Amsterdam Backstory
  step3_amsterdam_story = jsonb_build_object(
    'amsterdam_story', backstory_what_you_love,
    'how_you_arrived', backstory_what_brought_you,
    'personal_motivation', backstory_amsterdam_goals,
    'connection_to_RLD', backstory_rld_feeling
  ),
  
  -- Step 4: Persona
  step4_persona = jsonb_build_object(
    'tone_of_voice', persona_personality,
    'keywords', persona_interests,
    'personality_traits', persona_description,
    'character_rules', persona_backstory
  ),
  
  -- Step 5: Boundaries
  step5_boundaries = jsonb_build_object(
    'hard_limits', boundaries_hard_limits,
    'soft_limits', boundaries_soft_limits,
    'confidence_level', 'medium',
    'do_not_discuss_topics', COALESCE(to_jsonb(boundaries_comfortable_with), '[]'::jsonb)
  ),
  
  -- Step 6: Pricing
  step6_pricing = jsonb_build_object(
    'menu_items', '[]'::jsonb,
    'top_3_selling_items', '[]'::jsonb,
    'PPV_price_range', jsonb_build_object(
      'min', pricing_ppv_photo,
      'max', pricing_ppv_video
    ),
    'bundle_price_range', jsonb_build_object(
      'min', pricing_custom_content,
      'max', pricing_subscription
    )
  ),
  
  -- Step 7: Scripts & Messaging
  step7_messaging = jsonb_build_object(
    'intro_message', scripts_greeting,
    'welcome_message', scripts_ppv,
    'fan_reactivation_styles', jsonb_build_array(COALESCE(scripts_renewal, '')),
    'overall_message_style', scripts_sexting
  ),
  
  -- Step 8: Content Preferences
  step8_content_preferences = jsonb_build_object(
    'preferred_platforms', '["OnlyFans", "Fansly"]'::jsonb,
    'content_style_keywords', content_themes,
    'posting_frequency', 'daily',
    'best_posting_times', '[]'::jsonb,
    'enjoy_style', content_shooting_preferences,
    'preferred_video_styles', '[]'::jsonb,
    'preferred_photo_styles', '[]'::jsonb
  ),
  
  -- Step 9: Market Positioning
  step9_market_positioning = jsonb_build_object(
    'niche', COALESCE(section_market_positioning->>'niche', ''),
    'target_audience', COALESCE(section_brand_alignment->>'target_audience', ''),
    'fan_expectation_keywords', COALESCE(section_fan_expectations->>'value_proposition', ''),
    'competitive_edge', COALESCE(section_market_positioning->>'positioning_strategy', '')
  ),
  
  -- Step 10: Commitments
  step10_commitments = jsonb_build_object(
    'understand_split', false,
    'posting_commitment', false,
    'response_commitment', false,
    'guidelines_commitment', false,
    'boundaries_acknowledged', false,
    'content_rules_acknowledged', false,
    'shoot_attendance_commitment', false,
    'persona_commitment', false,
    'final_agreement_confirmed', false
  );

-- Update completed_steps array: map old 16-step to new 10-step
UPDATE onboarding_data SET
  completed_steps = ARRAY(
    SELECT DISTINCT new_step
    FROM unnest(completed_steps) AS old_step
    CROSS JOIN LATERAL (
      SELECT CASE
        WHEN old_step IN (1, 2) THEN 1
        WHEN old_step IN (6, 9) THEN 2
        WHEN old_step = 3 THEN 3
        WHEN old_step IN (6, 10) THEN 4
        WHEN old_step = 4 THEN 5
        WHEN old_step = 5 THEN 6
        WHEN old_step = 7 THEN 7
        WHEN old_step = 8 THEN 8
        WHEN old_step IN (11, 14, 15) THEN 9
        WHEN old_step = 16 THEN 10
        ELSE NULL
      END AS new_step
    ) mapping
    WHERE new_step IS NOT NULL
    ORDER BY new_step
  ),
  current_step = LEAST(
    CASE
      WHEN current_step <= 2 THEN 1
      WHEN current_step = 3 THEN 3
      WHEN current_step <= 6 THEN 4
      WHEN current_step = 7 THEN 7
      WHEN current_step = 8 THEN 8
      WHEN current_step <= 15 THEN 9
      ELSE 10
    END,
    10
  ),
  is_completed = (array_length(completed_steps, 1) >= 10);