/**
 * Access Level Management Utilities
 * Centralized logic for creator access level transitions
 */

export type AccessLevel = 'no_access' | 'meeting_only' | 'full_access';

export interface AccessLevelTransition {
  from: AccessLevel;
  to: AccessLevel;
  reason: string;
  method: string;
}

/**
 * Valid access level transitions
 */
const VALID_TRANSITIONS: Record<AccessLevel, AccessLevel[]> = {
  no_access: ['meeting_only', 'full_access'], // Can skip to full_access via early grant
  meeting_only: ['full_access'],
  full_access: [], // Cannot downgrade (must use revoke)
};

/**
 * Validate if an access level transition is allowed
 */
export const isValidTransition = (from: AccessLevel, to: AccessLevel): boolean => {
  return VALID_TRANSITIONS[from]?.includes(to) || false;
};

/**
 * Get the next access level in the standard flow
 */
export const getNextAccessLevel = (current: AccessLevel): AccessLevel | null => {
  const transitions = {
    no_access: 'meeting_only' as AccessLevel,
    meeting_only: 'full_access' as AccessLevel,
    full_access: null,
  };
  
  return transitions[current];
};

/**
 * Determine access level based on meeting status and grants
 */
export const determineAccessLevel = (params: {
  hasEarlyGrant: boolean;
  meetingCompleted: boolean;
  meetingBooked: boolean;
}): AccessLevel => {
  const { hasEarlyGrant, meetingCompleted, meetingBooked } = params;
  
  // Early grant bypasses everything
  if (hasEarlyGrant) {
    return 'full_access';
  }
  
  // Meeting completed = full access
  if (meetingCompleted) {
    return 'full_access';
  }
  
  // Meeting booked = can access meeting booking
  if (meetingBooked) {
    return 'meeting_only';
  }
  
  // Default: no access
  return 'no_access';
};

/**
 * Get user-friendly access level description
 */
export const getAccessLevelDescription = (level: AccessLevel): string => {
  const descriptions = {
    no_access: 'Awaiting meeting invitation from your manager',
    meeting_only: 'Can book your introductory meeting',
    full_access: 'Full dashboard access - complete onboarding',
  };
  
  return descriptions[level];
};

/**
 * Get access level color for UI
 */
export const getAccessLevelColor = (level: AccessLevel): string => {
  const colors = {
    no_access: 'text-amber-500',
    meeting_only: 'text-blue-500',
    full_access: 'text-green-500',
  };
  
  return colors[level];
};

/**
 * Get accessible features for an access level
 */
export const getAccessibleFeatures = (level: AccessLevel): string[] => {
  const features: Record<AccessLevel, string[]> = {
    no_access: ['profile', 'support'],
    meeting_only: ['profile', 'support', 'meeting-booking', 'onboarding-steps-1-2'],
    full_access: ['profile', 'support', 'meeting-booking', 'onboarding', 'uploads', 'commitments', 'shoots', 'invoices', 'contract'],
  };
  
  return features[level];
};

/**
 * Check if a feature is accessible at the given access level
 */
export const canAccessFeature = (level: AccessLevel, feature: string): boolean => {
  return getAccessibleFeatures(level).includes(feature);
};
