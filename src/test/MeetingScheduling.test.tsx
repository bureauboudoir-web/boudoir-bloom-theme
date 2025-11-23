import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useMeetingStatus } from '@/hooks/useMeetingStatus';
import { supabase } from '@/integrations/supabase/client';

vi.mock('@/integrations/supabase/client');

describe('Meeting Scheduling', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('detects when no meeting exists', async () => {
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

    const { result } = renderHook(() => useMeetingStatus());

    await waitFor(() => {
      expect(result.current.data?.hasMeeting).toBe(false);
    });
  });

  it('identifies scheduled meeting', async () => {
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
              status: 'confirmed',
              meeting_date: '2025-02-01',
              completed_at: null,
            },
            error: null,
          }),
        })),
      })),
    }));

    vi.mocked(supabase.from).mockImplementation(mockFrom as any);

    const { result } = renderHook(() => useMeetingStatus());

    await waitFor(() => {
      expect(result.current.data?.meetingStatus).toBe('confirmed');
      expect(result.current.data?.meetingCompleted).toBe(false);
    });
  });

  it('identifies completed meeting', async () => {
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
              status: 'completed',
              meeting_date: '2025-01-15',
              completed_at: '2025-01-15T10:00:00Z',
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
      expect(result.current.data?.meetingStatus).toBe('completed');
    });
  });

  it('returns null for unauthenticated users', async () => {
    vi.mocked(supabase.auth.getSession).mockResolvedValue({
      data: { session: null },
      error: null,
    });

    const { result } = renderHook(() => useMeetingStatus());

    await waitFor(() => {
      expect(result.current.data).toBeNull();
    });
  });
});
