// Onboarding step configuration
export interface OnboardingStepConfig {
  id: number;
  label: string;
  stage: "pre-meeting" | "post-meeting";
  description: string;
}

export const ONBOARDING_STEPS: OnboardingStepConfig[] = [
  {
    id: 1,
    label: "Personal Information",
    stage: "pre-meeting",
    description: "Basic contact and personal details",
  },
  {
    id: 2,
    label: "Creator Persona",
    stage: "pre-meeting",
    description: "Your stage name and basic description",
  },
  {
    id: 3,
    label: "Social Media",
    stage: "pre-meeting",
    description: "Your social media handles and platforms",
  },
  {
    id: 4,
    label: "Physical Details",
    stage: "post-meeting",
    description: "Body type, features, and appearance",
  },
  {
    id: 5,
    label: "Boundaries",
    stage: "post-meeting",
    description: "Content boundaries and comfort levels",
  },
  {
    id: 6,
    label: "Backstory",
    stage: "post-meeting",
    description: "Your character backstory and persona details",
  },
  {
    id: 7,
    label: "Content Preferences",
    stage: "post-meeting",
    description: "Content types and shooting preferences",
  },
  {
    id: 8,
    label: "Pricing",
    stage: "post-meeting",
    description: "Set your pricing for various services",
  },
  {
    id: 9,
    label: "Scripts",
    stage: "post-meeting",
    description: "Message templates and communication scripts",
  },
  {
    id: 10,
    label: "Commitments",
    stage: "post-meeting",
    description: "Weekly content commitments and agreements",
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
