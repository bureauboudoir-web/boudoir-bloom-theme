// Onboarding step configuration - 10 Steps
export interface OnboardingStepConfig {
  id: number;
  label: string;
  short: string;
  stage: "pre-meeting" | "post-meeting";
  description: string;
  icon: string;
  required: boolean;
  adminOnly?: boolean;
}

export const ONBOARDING_STEPS: OnboardingStepConfig[] = [
  {
    id: 1,
    label: "Private Information",
    short: "Private Info",
    stage: "pre-meeting",
    description: "Real identity and emergency contacts (Admin/Manager only)",
    icon: "User",
    required: true,
    adminOnly: true,
  },
  {
    id: 2,
    label: "Brand & Character Identity",
    short: "Brand",
    stage: "post-meeting",
    description: "Stage name, character contact info, bio, brand colors",
    icon: "Palette",
    required: true,
  },
  {
    id: 3,
    label: "Amsterdam Story",
    short: "Backstory",
    stage: "post-meeting",
    description: "Your Amsterdam journey and Red Light District connection",
    icon: "MapPin",
    required: true,
  },
  {
    id: 4,
    label: "Persona",
    short: "Persona",
    stage: "post-meeting",
    description: "Tone of voice, keywords, personality traits, character rules",
    icon: "Theater",
    required: true,
  },
  {
    id: 5,
    label: "Boundaries",
    short: "Boundaries",
    stage: "post-meeting",
    description: "Content boundaries, comfort levels, do-not-discuss topics",
    icon: "Shield",
    required: true,
  },
  {
    id: 6,
    label: "Pricing Structure",
    short: "Pricing",
    stage: "post-meeting",
    description: "Menu items, PPV ranges, bundle pricing",
    icon: "DollarSign",
    required: true,
  },
  {
    id: 7,
    label: "Scripts & Messaging",
    short: "Messaging",
    stage: "post-meeting",
    description: "Intro messages, welcome scripts, reactivation styles",
    icon: "MessageSquare",
    required: true,
  },
  {
    id: 8,
    label: "Content Preferences",
    short: "Content Prefs",
    stage: "post-meeting",
    description: "Platforms, content style, posting frequency, video/photo preferences",
    icon: "Camera",
    required: true,
  },
  {
    id: 9,
    label: "Market Positioning",
    short: "Positioning",
    stage: "post-meeting",
    description: "Niche, target audience, fan expectations, competitive edge",
    icon: "TrendingUp",
    required: true,
  },
  {
    id: 10,
    label: "Requirements & Commitments",
    short: "Commitments",
    stage: "post-meeting",
    description: "Final agreements and commitment confirmations",
    icon: "CheckSquare",
    required: true,
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
  return POST_MEETING_STEPS[0]?.id || 2;
};

export const getLastPreMeetingStep = (): number => {
  return PRE_MEETING_STEPS[PRE_MEETING_STEPS.length - 1]?.id || 1;
};
