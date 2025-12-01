/**
 * Onboarding Step Validation and Mapping - 10 Steps
 * 
 * This file provides the single source of truth for onboarding step numbers
 * to prevent mismatches between components and the database.
 */

export const ONBOARDING_STEP_MAPPING = {
  private_info: 1,
  brand_identity: 2,
  amsterdam_story: 3,
  persona: 4,
  boundaries: 5,
  pricing: 6,
  messaging: 7,
  content_preferences: 8,
  market_positioning: 9,
  commitments: 10,
} as const;

export const ONBOARDING_STEP_NAMES = {
  1: "Private Information",
  2: "Brand & Character Identity",
  3: "Amsterdam Story",
  4: "Persona",
  5: "Boundaries",
  6: "Pricing Structure",
  7: "Scripts & Messaging",
  8: "Content Preferences",
  9: "Market Positioning",
  10: "Requirements & Commitments",
} as const;

export const TOTAL_STEPS = 10;

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
