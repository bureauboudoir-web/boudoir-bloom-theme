// Comprehensive BB Creator Onboarding Types - 10 Steps

// Step 1 - Private Information (Admin/Manager only)
export interface OnboardingStep1 {
  real_name?: string;
  date_of_birth?: string;
  nationality?: string;
  full_address?: string;
  phone_number?: string;
  emergency_contact?: string;
  emergency_phone?: string;
}

// Step 2 - Brand & Character Identity
export interface OnboardingStep2 {
  stage_name?: string;
  character_phone?: string;
  character_email?: string;
  bio_short?: string;
  persona_keywords?: string[];
  brand_color_palette?: string[];
  banner_style_option?: string;
}

// Step 3 - Amsterdam Backstory
export interface OnboardingStep3 {
  amsterdam_story?: string;
  how_you_arrived?: string;
  personal_motivation?: string;
  connection_to_RLD?: string;
}

// Step 4 - Persona
export interface OnboardingStep4 {
  tone_of_voice?: string;
  keywords?: string;
  personality_traits?: string;
  character_rules?: string;
}

// Step 5 - Boundaries & Comfort Levels
export interface OnboardingStep5 {
  hard_limits?: string;
  soft_limits?: string;
  confidence_level?: string;
  do_not_discuss_topics?: string[];
}

// Step 6 - Pricing Structure
export interface OnboardingStep6 {
  menu_items?: string[];
  top_3_selling_items?: string[];
  PPV_price_range?: {
    min?: number;
    max?: number;
  };
  bundle_price_range?: {
    min?: number;
    max?: number;
  };
}

// Step 7 - Scripts & Messaging
export interface OnboardingStep7 {
  intro_message?: string;
  welcome_message?: string;
  fan_reactivation_styles?: string[];
  overall_message_style?: string;
}

// Step 8 - Content Preferences
export interface OnboardingStep8 {
  preferred_platforms?: string[];
  content_style_keywords?: string;
  posting_frequency?: string;
  best_posting_times?: string[];
  enjoy_style?: string;
  preferred_video_styles?: string[];
  preferred_photo_styles?: string[];
}

// Step 9 - Market Positioning & Fan Expectations
export interface OnboardingStep9 {
  niche?: string;
  target_audience?: string;
  fan_expectation_keywords?: string;
  competitive_edge?: string;
}

// Step 10 - Requirements & Commitments
export interface OnboardingStep10 {
  understand_split?: boolean;
  posting_commitment?: boolean;
  response_commitment?: boolean;
  guidelines_commitment?: boolean;
  boundaries_acknowledged?: boolean;
  content_rules_acknowledged?: boolean;
  shoot_attendance_commitment?: boolean;
  persona_commitment?: boolean;
  final_agreement_confirmed?: boolean;
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
