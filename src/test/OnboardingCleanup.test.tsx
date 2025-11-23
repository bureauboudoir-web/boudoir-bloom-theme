import { describe, it, expect, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useOnboarding } from '@/hooks/useOnboarding';
import { supabase } from '@/integrations/supabase/client';

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(),
  },
}));

describe('Onboarding Data Cleanup', () => {
  it('should not fetch onboarding data for admin users', async () => {
    const adminUserId = 'admin-123';

    // Mock the user_roles query to return admin role
    const mockFrom = vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({
          data: [{ role: 'admin' }],
          error: null,
        }),
      }),
    });

    (supabase.from as any) = mockFrom;

    const { result } = renderHook(() => useOnboarding(adminUserId));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Should not have onboarding data for admin
    expect(result.current.onboardingData).toBeNull();
  });

  it('should not fetch onboarding data for manager users', async () => {
    const managerUserId = 'manager-123';

    const mockFrom = vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({
          data: [{ role: 'manager' }],
          error: null,
        }),
      }),
    });

    (supabase.from as any) = mockFrom;

    const { result } = renderHook(() => useOnboarding(managerUserId));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.onboardingData).toBeNull();
  });

  it('should fetch onboarding data for creator users', async () => {
    const creatorUserId = 'creator-123';
    const mockOnboardingData = {
      id: '1',
      user_id: creatorUserId,
      current_step: 1,
      completed_steps: [],
      is_completed: false,
    };

    let callCount = 0;
    const mockFrom = vi.fn((table: string) => {
      callCount++;
      
      // First call is to user_roles
      if (callCount === 1) {
        return {
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockResolvedValue({
              data: [{ role: 'creator' }],
              error: null,
            }),
          }),
        };
      }
      
      // Second call is to onboarding_data
      return {
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            maybeSingle: vi.fn().mockResolvedValue({
              data: mockOnboardingData,
              error: null,
            }),
          }),
        }),
      };
    });

    (supabase.from as any) = mockFrom;

    const { result } = renderHook(() => useOnboarding(creatorUserId));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.onboardingData).toBeTruthy();
    expect(result.current.onboardingData?.user_id).toBe(creatorUserId);
  });

  it('should not create onboarding data for non-creator roles', async () => {
    const adminUserId = 'admin-456';

    const mockFrom = vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({
          data: [{ role: 'admin' }],
          error: null,
        }),
      }),
    });

    (supabase.from as any) = mockFrom;

    const { result } = renderHook(() => useOnboarding(adminUserId));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Should NOT have attempted to create onboarding data
    expect(result.current.onboardingData).toBeNull();
  });
});
