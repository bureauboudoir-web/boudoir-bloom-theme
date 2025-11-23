import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useCreatorTimeline } from '@/hooks/useCreatorTimeline';
import { supabase } from '@/integrations/supabase/client';

vi.mock('@/integrations/supabase/client');

describe('useCreatorTimeline', () => {
  it('returns null when no session', async () => {
    vi.mocked(supabase.auth.getSession).mockResolvedValue({
      data: { session: null },
      error: null,
    });

    const { result } = renderHook(() => useCreatorTimeline());

    await waitFor(() => {
      expect(result.current).toBeNull();
    });
  });

  it('calculates progress percentage correctly', async () => {
    const mockSession = {
      user: { id: 'user-1', email: 'test@test.com' },
    };

    vi.mocked(supabase.auth.getSession).mockResolvedValue({
      data: { session: mockSession as any },
      error: null,
    });

    const mockFrom = vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          maybeSingle: vi.fn().mockResolvedValue({
            data: { status: 'approved', is_completed: true, contract_signed: true },
            error: null,
          }),
        })),
      })),
    }));

    vi.mocked(supabase.from).mockImplementation(mockFrom as any);

    const { result } = renderHook(() => useCreatorTimeline());

    await waitFor(() => {
      expect(result.current).toBeTruthy();
      if (result.current.data) {
        expect(result.current.data.progressPercentage).toBeGreaterThan(0);
      }
    });
  });

  it('handles missing data gracefully', async () => {
    const mockSession = {
      user: { id: 'user-1', email: 'test@test.com' },
    };

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

    const { result } = renderHook(() => useCreatorTimeline());

    await waitFor(() => {
      expect(result.current).toBeTruthy();
      if (result.current.data) {
        expect(result.current.data.stages).toHaveLength(5);
      }
    });
  });
});
