// Comprehensive BB Creator Onboarding Types - 10 Steps

// Step 1 - Personal Information (PRIVATE - Admin/Manager only)
export interface OnboardingStep1 {
  full_name?: string;
  personal_email?: string;
  personal_phone?: string;
  home_address?: string;
  dob?: string;
  nationality?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  legal_id_verified?: boolean;
}

// Step 2 - Brand & Character Identity
export interface OnboardingStep2 {
  stage_name?: string;
  character_email?: string;
  character_phone?: string;
  brand_color_palette?: string[]; // 3-color preset
  banner_style?: string;
  personality_keywords?: string[];
  character_vibe_summary?: string;
}

// Step 3 - Physical Description
export interface OnboardingStep3 {
  hair?: string;
  eyes?: string;
  body_type?: string;
  skin_tone?: string;
  tattoos?: string;
  distinctive_features?: string;
  aesthetic_style?: string;
}

// Step 4 - Amsterdam Story / Origin Story
export interface OnboardingStep4 {
  origin_story_long?: string;
  cultural_background?: string;
  persona_inspiration?: string;
  amsterdam_story_summary?: string;
}

// Step 5 - Boundaries & Comfort Levels
export interface OnboardingStep5 {
  hard_limits?: string[];
  soft_limits?: string[];
  do_not_discuss?: string[];
  confidence_level?: string;
  safety_notes?: string;
}

// Step 6 - Services & Pricing Structure
export interface OnboardingStep6 {
  expected_subscription_price?: number;
  min_ppv_price?: number;
  max_ppv_price?: number;
  preferred_ppv_themes?: string[];
  shoot_availability?: string;
  live_platform_preference?: string;
  livestream_comfort_level?: string;
}

// Step 7 - Messaging Preferences (Simplified)
export interface OnboardingStep7 {
  messaging_tone?: string;
  emoji_preference?: 'low' | 'medium' | 'high';
  language_preference?: string;
  forbidden_phrases?: string[];
}

// Step 8 - Socials & Platforms
export interface OnboardingStep8 {
  // Social links
  instagram?: string;
  tiktok?: string;
  twitter?: string;
  snapchat?: string;
  reddit?: string;
  onlyfans?: string;
  fansly?: string;
  website_linktree?: string;
  other_links?: string[];
  // Platform preferences
  posting_platforms?: string[];
  live_platforms?: string[];
  posting_frequency?: string;
  best_posting_times?: string[];
}

// Step 9 - Content Preferences & Positioning (Merged)
export interface OnboardingStep9 {
  // Content Style
  photo_style?: string;
  video_style?: string;
  lighting_preferences?: string;
  aesthetic_themes?: string[];
  // Market Positioning
  niche_description?: string;
  target_audience?: string;
  fan_expectation_keywords?: string[];
  competitive_edge?: string;
  // Lifestyle & Authentic Interests
  daily_routine_highlights?: string;
  lifestyle_interests?: string[];
  natural_environments?: string[];
  content_they_love_creating?: string;
  content_they_never_want_to_create?: string;
  // Keywords
  style_keywords?: string[];
  personality_keywords?: string[];
  environment_keywords?: string[];
}

// Step 10 - Commitments & Final Sign-Off
export interface OnboardingStep10 {
  commitments?: Record<string, boolean>;
  final_confirmation?: boolean;
  digital_signature?: string;
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

export interface OnboardingData {
  step1_private_info: OnboardingStep1;
  step2_brand_identity: OnboardingStep2;
  step3_amsterdam_story: OnboardingStep3;
  step4_persona: OnboardingStep4;
  step5_boundaries: OnboardingStep5;
  step6_pricing: OnboardingStep6;
  step7_messaging: OnboardingStep7;
  step8_content_preferences: OnboardingStep8;
  step9_market_positioning: OnboardingStep9;
  step10_commitments: OnboardingStep10;
  current_step: number;
  completed_steps: number[];
  is_completed: boolean;
}

export interface BBCreatorFull {
  id: string;
  user_id: string;
  profile: ProfileMetadata;
  sections: OnboardingData;
  completion: CompletionTracking;
}

// Helper function to calculate section completion
export const calculateSectionCompletion = (section: any): boolean => {
  if (!section) return false;
  const values = Object.values(section);
  return values.some(v => v !== null && v !== undefined && v !== '' && (!Array.isArray(v) || v.length > 0));
};

// Helper function to get completion percentage
export const getCompletionPercentage = (completedSteps: number[]): number => {
  return Math.round((completedSteps.length / 10) * 100);
};
