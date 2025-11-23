import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useAccessLevel } from '@/hooks/useAccessLevel';
import { supabase } from '@/integrations/supabase/client';

vi.mock('@/integrations/supabase/client');

describe('Access Level Management', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns no_access for new creators', async () => {
    const mockSession = { user: { id: 'user-1' } };
    
    vi.mocked(supabase.auth.getSession).mockResolvedValue({
      data: { session: mockSession as any },
      error: null,
    });

    const mockFrom = vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          maybeSingle: vi.fn().mockResolvedValue({
            data: { access_level: 'no_access' },
            error: null,
          }),
        })),
      })),
    }));

    vi.mocked(supabase.from).mockImplementation(mockFrom as any);

    const { result } = renderHook(() => useAccessLevel());

    await waitFor(() => {
      expect(result.current).toBe('no_access');
    });
  });

  it('returns limited_access after meeting completed', async () => {
    const mockSession = { user: { id: 'user-1' } };
    
    vi.mocked(supabase.auth.getSession).mockResolvedValue({
      data: { session: mockSession as any },
      error: null,
    });

    const mockFrom = vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          maybeSingle: vi.fn().mockResolvedValue({
            data: { access_level: 'limited_access' },
            error: null,
          }),
        })),
      })),
    }));

    vi.mocked(supabase.from).mockImplementation(mockFrom as any);

    const { result } = renderHook(() => useAccessLevel());

    await waitFor(() => {
      expect(result.current).toBe('limited_access');
    });
  });

  it('returns full_access when all stages completed', async () => {
    const mockSession = { user: { id: 'user-1' } };
    
    vi.mocked(supabase.auth.getSession).mockResolvedValue({
      data: { session: mockSession as any },
      error: null,
    });

    const mockFrom = vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          maybeSingle: vi.fn().mockResolvedValue({
            data: { access_level: 'full_access' },
            error: null,
          }),
        })),
      })),
    }));

    vi.mocked(supabase.from).mockImplementation(mockFrom as any);

    const { result } = renderHook(() => useAccessLevel());

    await waitFor(() => {
      expect(result.current).toBe('full_access');
    });
  });

  it('handles null access level gracefully', async () => {
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

    const { result } = renderHook(() => useAccessLevel());

    await waitFor(() => {
      expect(result.current).toBe('no_access');
    });
  });
});
