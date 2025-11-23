import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useMeetingStatus } from '@/hooks/useMeetingStatus';
import { supabase } from '@/integrations/supabase/client';

vi.mock('@/integrations/supabase/client');

describe('useMeetingStatus', () => {
  it('returns null when no session', async () => {
    vi.mocked(supabase.auth.getSession).mockResolvedValue({
      data: { session: null },
      error: null,
    });

    const { result } = renderHook(() => useMeetingStatus());

    await waitFor(() => {
      expect(result.current.data).toBeNull();
    });
  });

  it('identifies completed meeting', async () => {
    const mockSession = {
      user: { id: 'user-1' },
    };

    vi.mocked(supabase.auth.getSession).mockResolvedValue({
      data: { session: mockSession as any },
      error: null,
    });

    const mockFrom = vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          maybeSingle: vi.fn().mockResolvedValue({
            data: {
              status: 'completed',
              completed_at: new Date().toISOString(),
            },
            error: null,
          }),
        })),
      })),
    }));

    vi.mocked(supabase.from).mockImplementation(mockFrom as any);

    const { result } = renderHook(() => useMeetingStatus());

    await waitFor(() => {
      expect(result.current.data?.meetingCompleted).toBe(true);
    });
  });

  it('handles no meeting data', async () => {
    const mockSession = {
      user: { id: 'user-1' },
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

    const { result } = renderHook(() => useMeetingStatus());

    await waitFor(() => {
      expect(result.current.data?.hasMeeting).toBe(false);
    });
  });
});
