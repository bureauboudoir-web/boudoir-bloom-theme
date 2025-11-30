/**
 * Onboarding Step Validation and Mapping
 * 
 * This file provides the single source of truth for onboarding step numbers
 * to prevent mismatches between components and the database.
 */

export const ONBOARDING_STEP_MAPPING = {
  personal: 1,
  physical: 2,
  amsterdam: 3,
  boundaries: 4,
  pricing: 5,
  persona: 6,
  scripts: 7,
  content: 8,
  visual_identity: 9,
  creator_story: 10,
  brand_alignment: 11,
  fetish_interests: 12,
  engagement_style: 13,
  market_positioning: 14,
  fan_expectations: 15,
  creative_boundaries: 16,
} as const;

export const ONBOARDING_STEP_NAMES = {
  1: "Personal Information",
  2: "Physical Description",
  3: "Amsterdam Story",
  4: "Boundaries & Comfort",
  5: "Pricing Structure",
  6: "Persona & Character",
  7: "Scripts & Messaging",
  8: "Content Preferences",
  9: "Visual Identity",
  10: "Creator Story",
  11: "Brand Alignment",
  12: "Fetish/Special Interests",
  13: "Engagement Style",
  14: "Market Positioning",
  15: "Fan Expectations",
  16: "Commitments",
} as const;

export const TOTAL_STEPS = 16;

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
