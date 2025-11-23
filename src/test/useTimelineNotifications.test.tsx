import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useTimelineNotifications } from '@/hooks/useTimelineNotifications';
import { supabase } from '@/integrations/supabase/client';

vi.mock('@/integrations/supabase/client');

describe('useTimelineNotifications', () => {
  it('returns empty notifications when no user', () => {
    const { result } = renderHook(() => useTimelineNotifications(undefined));

    expect(result.current.timelineNotifications).toEqual([]);
    expect(result.current.timelineCount).toBe(0);
  });

  it('creates application approved notification', async () => {
    const mockSession = {
      user: { id: 'user-1', email: 'test@test.com' },
    };

    vi.mocked(supabase.auth.getSession).mockResolvedValue({
      data: { session: mockSession as any },
      error: null,
    });

    const mockFrom = vi.fn((table: string) => {
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
      return {
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            maybeSingle: vi.fn().mockResolvedValue({
              data: null,
              error: null,
            }),
          })),
        })),
      };
    });

    vi.mocked(supabase.from).mockImplementation(mockFrom as any);
    vi.mocked(supabase.channel).mockReturnValue({
      on: vi.fn().mockReturnThis(),
      subscribe: vi.fn(),
    } as any);

    const { result } = renderHook(() => useTimelineNotifications('user-1'));

    await waitFor(() => {
      expect(result.current.timelineNotifications.length).toBeGreaterThan(0);
      expect(result.current.timelineNotifications[0].type).toBe('timeline');
    });
  });

  it('handles full access notification', async () => {
    const mockSession = {
      user: { id: 'user-1', email: 'test@test.com' },
    };

    vi.mocked(supabase.auth.getSession).mockResolvedValue({
      data: { session: mockSession as any },
      error: null,
    });

    const mockFrom = vi.fn((table: string) => {
      if (table === 'creator_access_levels') {
        return {
          select: vi.fn(() => ({
            eq: vi.fn(() => ({
              maybeSingle: vi.fn().mockResolvedValue({
                data: {
                  access_level: 'full_access',
                  granted_at: new Date().toISOString(),
                },
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
              data: null,
              error: null,
            }),
          })),
        })),
      };
    });

    vi.mocked(supabase.from).mockImplementation(mockFrom as any);
    vi.mocked(supabase.channel).mockReturnValue({
      on: vi.fn().mockReturnThis(),
      subscribe: vi.fn(),
    } as any);

    const { result } = renderHook(() => useTimelineNotifications('user-1'));

    await waitFor(() => {
      expect(result.current.timelineNotifications.some(
        n => n.title.includes('Welcome')
      )).toBe(true);
    });
  });
});
