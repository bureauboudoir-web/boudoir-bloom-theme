// Onboarding step configuration - 16 Sections
export interface OnboardingStepConfig {
  id: number;
  label: string;
  stage: "pre-meeting" | "post-meeting";
  description: string;
  icon?: string;
  required?: boolean;
}

export const ONBOARDING_STEPS: OnboardingStepConfig[] = [
  {
    id: 1,
    label: "Personal Information",
    stage: "pre-meeting",
    description: "Basic contact and personal details",
    icon: "User",
    required: true,
  },
  {
    id: 2,
    label: "Physical Description",
    stage: "pre-meeting",
    description: "Body type, features, and appearance",
    icon: "Heart",
    required: true,
  },
  {
    id: 3,
    label: "Amsterdam Story",
    stage: "post-meeting",
    description: "Your Amsterdam journey and Red Light District story",
    icon: "MapPin",
    required: true,
  },
  {
    id: 4,
    label: "Boundaries & Comfort Levels",
    stage: "post-meeting",
    description: "Content boundaries and comfort preferences",
    icon: "Shield",
    required: true,
  },
  {
    id: 5,
    label: "Pricing Structure",
    stage: "post-meeting",
    description: "Set your pricing for various services",
    icon: "DollarSign",
    required: true,
  },
  {
    id: 6,
    label: "Persona & Character",
    stage: "post-meeting",
    description: "Your stage name and character development",
    icon: "Theater",
    required: true,
  },
  {
    id: 7,
    label: "Scripts & Messaging",
    stage: "post-meeting",
    description: "Message templates and communication scripts",
    icon: "MessageSquare",
    required: true,
  },
  {
    id: 8,
    label: "Content Preferences",
    stage: "post-meeting",
    description: "Content types and shooting preferences",
    icon: "Camera",
    required: true,
  },
  {
    id: 9,
    label: "Visual Identity",
    stage: "post-meeting",
    description: "Colors, aesthetic, fonts, and brand visuals",
    icon: "Palette",
    required: false,
  },
  {
    id: 10,
    label: "Creator Story",
    stage: "post-meeting",
    description: "Your journey, milestones, and future goals",
    icon: "BookOpen",
    required: false,
  },
  {
    id: 11,
    label: "Brand Alignment",
    stage: "post-meeting",
    description: "Brand voice, target audience, unique value",
    icon: "Target",
    required: false,
  },
  {
    id: 12,
    label: "Fetish / Special Interests",
    stage: "post-meeting",
    description: "Categories and specializations (staff filtering)",
    icon: "Tag",
    required: false,
  },
  {
    id: 13,
    label: "Engagement Style",
    stage: "post-meeting",
    description: "Communication style and fan interactions",
    icon: "MessageCircle",
    required: false,
  },
  {
    id: 14,
    label: "Market Positioning",
    stage: "post-meeting",
    description: "Niche, competitors, and differentiators",
    icon: "TrendingUp",
    required: false,
  },
  {
    id: 15,
    label: "Fan Expectations",
    stage: "post-meeting",
    description: "Content frequency and interaction commitments",
    icon: "Users",
    required: false,
  },
  {
    id: 16,
    label: "Creative Boundaries",
    stage: "post-meeting",
    description: "Content limits and collaboration rules",
    icon: "Lock",
    required: false,
  },
];

export const PRE_MEETING_STEPS = ONBOARDING_STEPS.filter(
  (step) => step.stage === "pre-meeting"
);

export const POST_MEETING_STEPS = ONBOARDING_STEPS.filter(
  (step) => step.stage === "post-meeting"
);

export const getStepConfig = (stepNumber: number): OnboardingStepConfig | undefined => {
  return ONBOARDING_STEPS.find((step) => step.id === stepNumber);
};

export const isPostMeetingStep = (stepNumber: number): boolean => {
  const config = getStepConfig(stepNumber);
  return config?.stage === "post-meeting";
};

export const getFirstPostMeetingStep = (): number => {
  return POST_MEETING_STEPS[0]?.id || 4;
};

export const getLastPreMeetingStep = (): number => {
  return PRE_MEETING_STEPS[PRE_MEETING_STEPS.length - 1]?.id || 3;
};
