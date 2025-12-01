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
    label: "Personal Information",
    short: "Personal",
    stage: "pre-meeting",
    description: "Private identity and emergency contacts (Admin/Manager only)",
    icon: "User",
    required: true,
    adminOnly: true,
  },
  {
    id: 2,
    label: "Brand & Character Identity",
    short: "Brand",
    stage: "post-meeting",
    description: "Stage name, character contact, brand colors, personality",
    icon: "Palette",
    required: true,
  },
  {
    id: 3,
    label: "Physical Description",
    short: "Appearance",
    stage: "post-meeting",
    description: "Hair, eyes, body type, aesthetic style",
    icon: "Heart",
    required: true,
  },
  {
    id: 4,
    label: "Amsterdam Story",
    short: "Origin Story",
    stage: "post-meeting",
    description: "Your backstory, cultural background, persona inspiration",
    icon: "MapPin",
    required: true,
  },
  {
    id: 5,
    label: "Boundaries & Comfort",
    short: "Boundaries",
    stage: "post-meeting",
    description: "Hard limits, soft limits, comfort levels, safety notes",
    icon: "Shield",
    required: true,
  },
  {
    id: 6,
    label: "Services & Pricing",
    short: "Pricing",
    stage: "post-meeting",
    description: "Subscription price, PPV ranges, shoot availability",
    icon: "DollarSign",
    required: true,
  },
  {
    id: 7,
    label: "Messaging Preferences",
    short: "Messaging",
    stage: "post-meeting",
    description: "Tone, emoji usage, language, forbidden phrases",
    icon: "MessageSquare",
    required: true,
  },
  {
    id: 8,
    label: "Socials & Platforms",
    short: "Socials",
    stage: "post-meeting",
    description: "Social links, posting platforms, frequency",
    icon: "Globe",
    required: true,
  },
  {
    id: 9,
    label: "Content & Positioning",
    short: "Content",
    stage: "post-meeting",
    description: "Content style, market positioning, lifestyle interests",
    icon: "Camera",
    required: true,
  },
  {
    id: 10,
    label: "Commitments",
    short: "Sign-Off",
    stage: "post-meeting",
    description: "Final agreements and digital signature",
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
