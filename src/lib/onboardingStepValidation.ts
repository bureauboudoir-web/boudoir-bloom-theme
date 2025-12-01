/**
 * Onboarding Step Validation and Mapping - 12 Steps
 * 
 * This file provides the single source of truth for onboarding step numbers
 * to prevent mismatches between components and the database.
 */

export const ONBOARDING_STEP_MAPPING = {
  private_info: 1,
  body_info: 2,
  brand_identity: 3,
  amsterdam_story: 4,
  persona_personality: 5,
  boundaries: 6,
  pricing_strategy: 7,
  messaging_style: 8,
  socials_platforms: 9,
  content_preferences: 10,
  market_positioning: 11,
  commitments: 12,
} as const;

export const ONBOARDING_STEP_NAMES = {
  1: "Private Information",
  2: "Body Information",
  3: "Brand & Character Identity",
  4: "Amsterdam Story",
  5: "Persona & Character Personality",
  6: "Boundaries & Comfort Levels",
  7: "Pricing Strategy",
  8: "Scripts & Messaging Style",
  9: "Socials & Platforms",
  10: "Content Preferences",
  11: "Market Positioning",
  12: "Requirements & Commitments",
} as const;

export const TOTAL_STEPS = 12;

/**
 * Validates that a step number is within the valid range
 */
export const validateStepNumber = (step: number): boolean => {
  if (step < 1 || step > TOTAL_STEPS) {
    console.error(`Invalid step number: ${step}. Must be between 1 and ${TOTAL_STEPS}`);
    return false;
  }
  return true;
};

/**
 * Gets the name of a step by its number
 */
export const getStepName = (step: number): string => {
  if (!validateStepNumber(step)) {
    return "Unknown Step";
  }
  return ONBOARDING_STEP_NAMES[step as keyof typeof ONBOARDING_STEP_NAMES] || "Unknown Step";
};

/**
 * Calculates the progress percentage based on completed steps
 */
export const calculateProgress = (completedSteps: number[]): number => {
  return Math.round((completedSteps.length / TOTAL_STEPS) * 100);
};

/**
 * Determines if all steps are completed
 */
export const isOnboardingComplete = (completedSteps: number[]): boolean => {
  return completedSteps.length === TOTAL_STEPS;
};

/**
 * Gets the next step number based on current step
 */
export const getNextStep = (currentStep: number): number | null => {
  if (currentStep >= TOTAL_STEPS) {
    return null;
  }
  return currentStep + 1;
};

/**
 * Gets the previous step number based on current step
 */
export const getPreviousStep = (currentStep: number): number | null => {
  if (currentStep <= 1) {
    return null;
  }
  return currentStep - 1;
};
