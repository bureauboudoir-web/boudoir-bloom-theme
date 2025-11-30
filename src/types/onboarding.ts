// Comprehensive BB Creator Onboarding Types - 16 Sections

export interface PersonalInfoSection {
  full_name?: string;
  date_of_birth?: string;
  nationality?: string;
  location?: string;
  phone_number?: string;
  business_phone?: string;
  email?: string;
  emergency_contact?: string;
  emergency_phone?: string;
}

export interface PhysicalDescriptionSection {
  height?: number;
  weight?: number;
  body_type?: string;
  hair_color?: string;
  eye_color?: string;
  tattoos?: string;
  piercings?: string;
  distinctive_features?: string;
}

export interface AmsterdamStorySection {
  years_in_amsterdam?: string;
  years_working_centrum?: string;
  neighborhood?: string;
  what_you_love?: string;
  what_brought_you?: string;
  amsterdam_goals?: string;
  rld_feeling?: string;
  rld_fascination?: string;
  rld_atmosphere?: string[];
  time_of_night?: string;
  colors?: string[];
  lighting?: string;
  confident_spot?: string;
  vulnerable_spot?: string;
  alter_ego?: string;
  persona_sentence?: string;
  character_secret?: string;
  becoming?: string;
  how_changed?: string;
  moment_changed_you?: string;
  past_shaped_you?: string;
  career_story?: string;
  content_expression?: string;
}

export interface BoundariesSection {
  comfortable_with?: string[];
  hard_limits?: string;
  soft_limits?: string;
  additional_notes?: string;
}

export interface PricingSection {
  subscription?: number;
  ppv_photo?: number;
  ppv_video?: number;
  custom_content?: number;
  sexting?: number;
  chat?: number;
}

export interface PersonaSection {
  stage_name?: string;
  description?: string;
  backstory?: string;
  personality?: string;
  interests?: string;
  fantasy?: string;
}

export interface ScriptsSection {
  greeting?: string;
  ppv?: string;
  sexting?: string;
  renewal?: string;
}

export interface ContentPreferencesSection {
  themes?: string;
  shooting_preferences?: string;
  equipment_needs?: string;
  photo_count?: number;
  video_count?: number;
}

export interface VisualIdentitySection {
  colors?: string[];
  aesthetic?: string;
  fonts?: string;
  logo_style?: string;
  mood_board?: string;
  brand_colors?: {
    primary?: string;
    secondary?: string;
    accent?: string;
  };
}

export interface CreatorStorySection {
  origin?: string;
  journey?: string;
  milestones?: string[];
  future_goals?: string;
  turning_points?: string;
  inspiration?: string;
}

export interface BrandAlignmentSection {
  brand_voice?: string;
  target_audience?: string;
  unique_value?: string;
  positioning_statement?: string;
  core_values?: string[];
  differentiation?: string;
}

export interface FetishInterestsSection {
  categories?: string[];
  comfort_level?: string;
  notes?: string;
  specializations?: string[];
}

export interface EngagementStyleSection {
  communication_style?: string;
  response_time?: string;
  availability?: string;
  boundaries?: string;
  interaction_preferences?: string[];
  fan_relationship_style?: string;
}

export interface MarketPositioningSection {
  niche?: string;
  competitors?: string[];
  differentiators?: string[];
  price_tier?: string;
  market_segment?: string;
  positioning_strategy?: string;
}

export interface FanExpectationsSection {
  content_frequency?: string;
  interaction_style?: string;
  exclusive_offerings?: string;
  community_building?: string;
  response_expectations?: string;
  value_proposition?: string;
}

export interface CreativeBoundariesSection {
  content_limits?: string[];
  collaboration_rules?: string;
  creative_control?: string;
  veto_rights?: string;
  collaboration_preferences?: string[];
  production_standards?: string;
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

export interface BBCreatorFull {
  id: string;
  user_id: string;
  profile: ProfileMetadata;
  sections: {
    personal_info: PersonalInfoSection;
    physical_description: PhysicalDescriptionSection;
    amsterdam_story: AmsterdamStorySection;
    boundaries: BoundariesSection;
    pricing: PricingSection;
    persona: PersonaSection;
    scripts: ScriptsSection;
    content_preferences: ContentPreferencesSection;
    visual_identity: VisualIdentitySection;
    creator_story: CreatorStorySection;
    brand_alignment: BrandAlignmentSection;
    fetish_interests: FetishInterestsSection;
    engagement_style: EngagementStyleSection;
    market_positioning: MarketPositioningSection;
    fan_expectations: FanExpectationsSection;
    creative_boundaries: CreativeBoundariesSection;
  };
  completion: CompletionTracking;
}

// Helper function to calculate section completion
export const calculateSectionCompletion = (section: any): boolean => {
  if (!section) return false;
  const values = Object.values(section);
  return values.some(v => v !== null && v !== undefined && v !== '' && (!Array.isArray(v) || v.length > 0));
};

// Helper function to get completion percentage
export const getCompletionPercentage = (sections: any): number => {
  const sectionKeys = Object.keys(sections);
  const completedSections = sectionKeys.filter(key => calculateSectionCompletion(sections[key]));
  return Math.round((completedSections.length / sectionKeys.length) * 100);
};