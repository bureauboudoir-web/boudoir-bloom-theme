// Comprehensive BB Creator Onboarding Types - 11 Steps (FINAL MODEL)

// Step 1 - Private Information (ADMIN-ONLY, NEVER EXPOSED TO EXTERNAL APIs)
export interface Step1PrivateInfo {
  full_legal_name?: string;
  dob?: string;
  nationality?: string;
  home_city_country?: string;
  personal_email?: string;
  personal_phone?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
}

// Step 2 - Brand & Character Identity
export interface Step2BrandIdentity {
  stage_name?: string;
  character_email?: string;
  character_phone?: string;
  short_bio?: string;
  persona_keywords?: string[];
  brand_color_palette?: string[];
  banner_style?: string;
}

// Step 3 - Amsterdam Story
export interface Step3AmsterdamStory {
  amsterdam_origin_story?: string;
  what_amsterdam_means_to_them?: string;
  how_they_see_themselves_in_RLD?: string;
  story_hooks_optional?: string;
}

// Step 4 - Persona & Character Personality (NO physical description)
export interface Step4PersonaPersonality {
  persona_archetype?: string;
  tone_of_voice?: string;
  fan_interaction_style?: string;
  emoji_style?: string;
  liked_words?: string[];
  disliked_words?: string[];
}

// Step 5 - Boundaries & Comfort Levels
export interface Step5Boundaries {
  hard_limits?: string[];
  soft_limits?: string[];
  do_not_discuss_topics?: string[];
  comfort_level?: string;
  safety_notes_internal?: string;
}

// Step 6 - Pricing Strategy
export interface Step6PricingStrategy {
  expected_sub_price_optional?: number;
  min_ppv_price?: number;
  custom_content_min_price?: number;
  bundle_or_upsell_notes?: string;
  never_go_below_rules?: string;
}

// Step 7 - Scripts & Messaging Style (preferences only, NO full templates)
export interface Step7MessagingStyle {
  messaging_tone?: string;
  greeting_style?: string;
  reactivation_style?: string;
  forbidden_phrases?: string[];
}

// Step 8 - Socials & Platforms
export interface Step8SocialsPlatforms {
  instagram?: string;
  tiktok?: string;
  twitter_x?: string;
  onlyfans?: string;
  snapchat?: string;
  fansly?: string;
  website_or_linktree?: string;
  other_links?: string[];
  posting_platforms?: string[];
  live_platforms?: string[];
}

// Step 9 - Content Preferences (SEPARATE from Market Positioning)
export interface Step9ContentPreferences {
  posting_frequency?: string;
  best_posting_times?: string;
  preferred_video_styles?: string[];
  preferred_photo_styles?: string[];
  themes_they_enjoy_creating?: string[];
  things_they_never_want_in_content?: string[];
  lifestyle_tags?: string[];
}

// Step 10 - Market Positioning (SEPARATE from Content)
export interface Step10MarketPositioning {
  niche_description?: string;
  target_audience?: string;
  fan_expectations?: string;
  unique_angle?: string;
}

// Step 11 - Requirements & Commitments (ADMIN-ONLY visibility, NEVER exposed to external APIs)
export interface Step11Commitments {
  understands_revenue_split?: boolean;
  understands_boundaries_recorded?: boolean;
  understands_payments_and_invoices?: boolean;
  agrees_to_posting_expectations?: boolean;
  agrees_to_communication_with_staff?: boolean;
  agrees_to_attend_shoots?: boolean;
  agrees_to_complete_onboarding?: boolean;
  final_confirmation?: boolean;
  optional_questions_or_concerns?: string;
}

export interface ProfileMetadata {
  id: string;
  user_id: string;
  full_name?: string;
  email?: string;
  profile_picture_url?: string;
  creator_status?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CompletionTracking {
  current_step: number;
  completed_steps: number[];
  is_completed: boolean;
  total_sections: number;
  completion_percentage: number;
  last_updated?: string;
}

// Combined onboarding data structure (11 steps)
export interface BBCreatorOnboarding {
  step1_private_info: Step1PrivateInfo;
  step2_brand_identity: Step2BrandIdentity;
  step3_amsterdam_story: Step3AmsterdamStory;
  step4_persona_personality: Step4PersonaPersonality;
  step5_boundaries: Step5Boundaries;
  step6_pricing_strategy: Step6PricingStrategy;
  step7_messaging_style: Step7MessagingStyle;
  step8_socials_platforms: Step8SocialsPlatforms;
  step9_content_preferences: Step9ContentPreferences;
  step10_market_positioning: Step10MarketPositioning;
  step11_commitments: Step11Commitments;
  current_step: number;
  completed_steps: number[];
  is_completed: boolean;
}

export interface OnboardingData extends BBCreatorOnboarding {
  id?: string;
  user_id?: string;
  created_at?: string;
  updated_at?: string;
  // Keep old property names for backwards compatibility
  [key: string]: any;
}

export interface BBCreatorFull {
  id: string;
  user_id: string;
  profile: ProfileMetadata;
  sections: BBCreatorOnboarding;
  completion: CompletionTracking;
}

// Helper function to calculate section completion
export const calculateSectionCompletion = (section: any): boolean => {
  if (!section) return false;
  const values = Object.values(section);
  return values.some(v => v !== null && v !== undefined && v !== '' && (!Array.isArray(v) || v.length > 0));
};

// Helper function to get completion percentage (11 steps)
export const getCompletionPercentage = (completedSteps: number[]): number => {
  return Math.round((completedSteps.length / 11) * 100);
};
