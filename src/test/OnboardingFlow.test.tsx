import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useOnboarding } from '@/hooks/useOnboarding';
import { supabase } from '@/integrations/supabase/client';

vi.mock('@/integrations/supabase/client');

describe('Onboarding Flow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('initializes onboarding data correctly', async () => {
    const mockSession = { user: { id: 'user-1' } };
    
    vi.mocked(supabase.auth.getSession).mockResolvedValue({
      data: { session: mockSession as any },
      error: null,
    });

    const mockFrom = vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          maybeSingle: vi.fn().mockResolvedValue({
            data: {
              current_step: 1,
              completed_steps: [],
              is_completed: false,
            },
            error: null,
          }),
        })),
      })),
    }));

    vi.mocked(supabase.from).mockImplementation(mockFrom as any);

    const { result } = renderHook(() => useOnboarding('user-1'));

    await waitFor(() => {
      expect(result.current.onboardingData).toBeTruthy();
      expect(result.current.onboardingData?.current_step).toBe(1);
    });
  });

  it('tracks completed steps correctly', async () => {
    const mockSession = { user: { id: 'user-1' } };
    
    vi.mocked(supabase.auth.getSession).mockResolvedValue({
      data: { session: mockSession as any },
      error: null,
    });

    const mockFrom = vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          maybeSingle: vi.fn().mockResolvedValue({
            data: {
              current_step: 3,
              completed_steps: [1, 2],
              is_completed: false,
            },
            error: null,
          }),
        })),
      })),
    }));

    vi.mocked(supabase.from).mockImplementation(mockFrom as any);

    const { result } = renderHook(() => useOnboarding('user-1'));

    await waitFor(() => {
      expect(result.current.onboardingData?.completed_steps).toContain(1);
      expect(result.current.onboardingData?.completed_steps).toContain(2);
    });
  });

  it('marks onboarding as completed', async () => {
    const mockSession = { user: { id: 'user-1' } };
    
    vi.mocked(supabase.auth.getSession).mockResolvedValue({
      data: { session: mockSession as any },
      error: null,
    });

    const mockFrom = vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          maybeSingle: vi.fn().mockResolvedValue({
            data: {
              current_step: 10,
              completed_steps: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
              is_completed: true,
            },
            error: null,
          }),
        })),
      })),
    }));

    vi.mocked(supabase.from).mockImplementation(mockFrom as any);

    const { result } = renderHook(() => useOnboarding('user-1'));

    await waitFor(() => {
      expect(result.current.onboardingData?.is_completed).toBe(true);
    });
  });

  it('handles missing onboarding data gracefully', async () => {
    const mockSession = { user: { id: 'user-1' } };
    
    vi.mocked(supabase.auth.getSession).mockResolvedValue({
      data: { session: mockSession as any },
      error: null,
    });

    const mockFrom = vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          maybeSingle: vi.fn().mockResolvedValue({
            data: null,
            error: null,
          }),
        })),
      })),
    }));

    vi.mocked(supabase.from).mockImplementation(mockFrom as any);

    const { result } = renderHook(() => useOnboarding('user-1'));

    await waitFor(() => {
      expect(result.current.onboardingData).toBeNull();
    });
  });
});
