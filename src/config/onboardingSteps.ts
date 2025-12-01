// Onboarding step configuration - 11 Steps (FINAL MODEL)
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
    short: "Personal",
    stage: "pre-meeting",
    description: "Private identity and emergency contacts (Admin/Manager only)",
    icon: "User",
    required: true,
    adminOnly: true,
  },
  {
    id: 2,
    label: "Body Information",
    short: "Body",
    stage: "pre-meeting",
    description: "Physical characteristics and distinctive features",
    icon: "User",
    required: true,
    adminOnly: true,
  },
  {
    id: 3,
    label: "Brand & Character Identity",
    short: "Brand",
    stage: "post-meeting",
    description: "Stage name, character contact, brand colors, personality",
    icon: "Palette",
    required: true,
  },
  {
    id: 4,
    label: "Amsterdam Story",
    short: "Amsterdam",
    stage: "post-meeting",
    description: "Your Amsterdam connection, origin story, cultural background",
    icon: "MapPin",
    required: true,
  },
  {
    id: 5,
    label: "Persona & Character Personality",
    short: "Persona",
    stage: "post-meeting",
    description: "Character archetype, tone of voice, interaction style",
    icon: "Heart",
    required: true,
  },
  {
    id: 6,
    label: "Boundaries & Comfort Levels",
    short: "Boundaries",
    stage: "post-meeting",
    description: "Hard limits, soft limits, comfort levels, safety notes",
    icon: "Shield",
    required: true,
  },
  {
    id: 7,
    label: "Pricing Strategy",
    short: "Pricing",
    stage: "post-meeting",
    description: "Subscription pricing, PPV rates, custom content pricing",
    icon: "DollarSign",
    required: true,
  },
  {
    id: 8,
    label: "Scripts & Messaging Style",
    short: "Messaging",
    stage: "post-meeting",
    description: "Messaging preferences, tone, greeting and reactivation styles",
    icon: "MessageSquare",
    required: true,
  },
  {
    id: 9,
    label: "Socials & Platforms",
    short: "Socials",
    stage: "post-meeting",
    description: "Social links, posting platforms, live platforms",
    icon: "Globe",
    required: true,
  },
  {
    id: 10,
    label: "Content Preferences",
    short: "Content",
    stage: "post-meeting",
    description: "Posting frequency, content styles, themes, lifestyle tags",
    icon: "Camera",
    required: true,
  },
  {
    id: 11,
    label: "Market Positioning",
    short: "Market",
    stage: "post-meeting",
    description: "Niche, target audience, fan expectations, competitive edge",
    icon: "Target",
    required: true,
  },
  {
    id: 12,
    label: "Requirements & Commitments",
    short: "Sign-Off",
    stage: "post-meeting",
    description: "Final agreements and confirmation (Admin-only visibility)",
    icon: "CheckSquare",
    required: true,
    adminOnly: true,
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
