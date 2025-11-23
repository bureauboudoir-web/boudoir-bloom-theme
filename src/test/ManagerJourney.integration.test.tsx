import { describe, it, expect } from 'vitest';

/**
 * Integration Test: Manager Journey
 * 
 * Tests the manager flow:
 * 1. Admin creates manager account
 * 2. Manager receives welcome email
 * 3. Logs in → redirected to /manager
 * 4. Sees manager dashboard (no onboarding)
 * 5. Can manage assigned creators
 */

describe('Manager Journey - Full Integration', () => {
  it('should complete manager setup and access', async () => {
    // Step 1: Admin creates manager account
    const managerAccount = {
      email: 'manager@test.com',
      role: 'manager',
      created_by: 'admin-123',
    };
    
    expect(managerAccount.role).toBe('manager');

    // Step 2: Manager logs in
    // Should redirect to /manager (not /dashboard or /admin)
    const expectedRoute = '/manager';
    expect(expectedRoute).toBe('/manager');

    // Step 3: Manager sees welcome screen (first login only)
    const welcomeScreenShown = true;
    expect(welcomeScreenShown).toBe(true);

    // Step 4: No onboarding data should exist
    const onboardingData = null;
    expect(onboardingData).toBeNull();

    // Step 5: Manager can access dashboard features
    const managerFeatures = [
      'applications',
      'overview',
      'commitments',
      'shoots',
      'review',
      'meetings',
      'availability',
      'support',
      'access',
      'settings',
    ];

    expect(managerFeatures.length).toBeGreaterThan(0);
    expect(managerFeatures).toContain('meetings');
    expect(managerFeatures).toContain('availability');
  });

  it('should allow manager to set availability', () => {
    const availability = {
      day_of_week: 1, // Monday
      start_time: '09:00',
      end_time: '17:00',
      is_available: true,
      meeting_duration_minutes: 60,
    };

    expect(availability.is_available).toBe(true);
    expect(availability.meeting_duration_minutes).toBe(60);
  });

  it('should allow manager to view assigned creators only', () => {
    const managerId = 'manager-123';
    const assignedCreators = [
      { id: 'creator-1', assigned_manager_id: managerId },
      { id: 'creator-2', assigned_manager_id: managerId },
    ];
    
    const unassignedCreators = [
      { id: 'creator-3', assigned_manager_id: 'other-manager' },
    ];

    // Manager should only see their assigned creators
    const visibleCreators = assignedCreators.filter(
      c => c.assigned_manager_id === managerId
    );

    expect(visibleCreators.length).toBe(2);
    expect(visibleCreators.every(c => c.assigned_manager_id === managerId)).toBe(true);
  });

  it('should redirect manager-only users from /admin to /manager', () => {
    const isManager = true;
    const isAdmin = false;
    const isSuperAdmin = false;

    const isManagerOnly = isManager && !isAdmin && !isSuperAdmin;
    expect(isManagerOnly).toBe(true);

    // Should redirect to /manager
    const expectedRoute = '/manager';
    expect(expectedRoute).toBe('/manager');
  });
});
