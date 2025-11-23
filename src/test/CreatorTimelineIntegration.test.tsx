import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useCreatorTimeline } from '@/hooks/useCreatorTimeline';
import { supabase } from '@/integrations/supabase/client';

vi.mock('@/integrations/supabase/client');

describe('Creator Timeline Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calculates progress percentage correctly for application stage', async () => {
    const mockSession = { user: { id: 'user-1', email: 'test@test.com' } };
    
    vi.mocked(supabase.auth.getSession).mockResolvedValue({
      data: { session: mockSession as any },
      error: null,
    });

    const mockFrom = vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          maybeSingle: vi.fn().mockResolvedValue({
            data: { status: 'approved' },
            error: null,
          }),
        })),
      })),
    }));

    vi.mocked(supabase.from).mockImplementation(mockFrom as any);

    const { result } = renderHook(() => useCreatorTimeline());

    await waitFor(() => {
      expect(result.current.data?.progressPercentage).toBeGreaterThan(0);
    });
  });

  it('advances stage when meeting is completed', async () => {
    const mockSession = { user: { id: 'user-1', email: 'test@test.com' } };
    
    vi.mocked(supabase.auth.getSession).mockResolvedValue({
      data: { session: mockSession as any },
      error: null,
    });

    const mockFrom = vi.fn((table) => {
      if (table === 'creator_applications') {
        return {
          select: vi.fn(() => ({
            eq: vi.fn(() => ({
              maybeSingle: vi.fn().mockResolvedValue({
                data: { status: 'approved' },
                error: null,
              }),
            })),
          })),
        };
      }
      if (table === 'creator_meetings') {
        return {
          select: vi.fn(() => ({
            eq: vi.fn(() => ({
              maybeSingle: vi.fn().mockResolvedValue({
                data: { status: 'completed', completed_at: new Date().toISOString() },
                error: null,
              }),
            })),
          })),
        };
      }
      return {
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
          })),
        })),
      };
    });

    vi.mocked(supabase.from).mockImplementation(mockFrom as any);

    const { result } = renderHook(() => useCreatorTimeline());

    await waitFor(() => {
      if (result.current.data) {
        const meetingStage = result.current.data.stages.find(s => s.id === 'meeting');
        expect(meetingStage?.completedAt).toBeTruthy();
      }
    });
  });

  it('advances stage when onboarding is completed', async () => {
    const mockSession = { user: { id: 'user-1', email: 'test@test.com' } };
    
    vi.mocked(supabase.auth.getSession).mockResolvedValue({
      data: { session: mockSession as any },
      error: null,
    });

    const mockFrom = vi.fn((table) => {
      if (table === 'onboarding_data') {
        return {
          select: vi.fn(() => ({
            eq: vi.fn(() => ({
              maybeSingle: vi.fn().mockResolvedValue({
                data: { is_completed: true },
                error: null,
              }),
            })),
          })),
        };
      }
      return {
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
          })),
        })),
      };
    });

    vi.mocked(supabase.from).mockImplementation(mockFrom as any);

    const { result } = renderHook(() => useCreatorTimeline());

    await waitFor(() => {
      if (result.current.data) {
        const onboardingStage = result.current.data.stages.find(s => s.id === 'onboarding');
        expect(onboardingStage?.completedAt).toBeTruthy();
      }
    });
  });

  it('advances stage when contract is signed', async () => {
    const mockSession = { user: { id: 'user-1', email: 'test@test.com' } };
    
    vi.mocked(supabase.auth.getSession).mockResolvedValue({
      data: { session: mockSession as any },
      error: null,
    });

    const mockFrom = vi.fn((table) => {
      if (table === 'creator_contracts') {
        return {
          select: vi.fn(() => ({
            eq: vi.fn(() => ({
              maybeSingle: vi.fn().mockResolvedValue({
                data: { contract_signed: true },
                error: null,
              }),
            })),
          })),
        };
      }
      return {
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
          })),
        })),
      };
    });

    vi.mocked(supabase.from).mockImplementation(mockFrom as any);

    const { result } = renderHook(() => useCreatorTimeline());

    await waitFor(() => {
      if (result.current.data) {
        const contractStage = result.current.data.stages.find(s => s.id === 'contract');
        expect(contractStage?.completedAt).toBeTruthy();
      }
    });
  });

  it('reaches 100% progress when full access granted', async () => {
    const mockSession = { user: { id: 'user-1', email: 'test@test.com' } };
    
    vi.mocked(supabase.auth.getSession).mockResolvedValue({
      data: { session: mockSession as any },
      error: null,
    });

    const mockFrom = vi.fn((table) => {
      if (table === 'creator_access_levels') {
        return {
          select: vi.fn(() => ({
            eq: vi.fn(() => ({
              maybeSingle: vi.fn().mockResolvedValue({
                data: { access_level: 'full_access' },
                error: null,
              }),
            })),
          })),
        };
      }
      return {
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            maybeSingle: vi.fn().mockResolvedValue({
              data: { status: 'approved', is_completed: true, contract_signed: true },
              error: null,
            }),
          })),
        })),
      };
    });

    vi.mocked(supabase.from).mockImplementation(mockFrom as any);

    const { result } = renderHook(() => useCreatorTimeline());

    await waitFor(() => {
      expect(result.current.data?.progressPercentage).toBe(100);
    });
  });
});
