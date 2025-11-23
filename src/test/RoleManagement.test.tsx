import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useUserRole } from '@/hooks/useUserRole';
import { supabase } from '@/integrations/supabase/client';

vi.mock('@/integrations/supabase/client');

describe('Role Management', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('identifies creator role correctly', async () => {
    const mockSession = { user: { id: 'user-1' } };
    
    vi.mocked(supabase.auth.getSession).mockResolvedValue({
      data: { session: mockSession as any },
      error: null,
    });

    const mockFrom = vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          data: [{ role: 'creator' }],
          error: null,
        })),
      })),
    }));

    vi.mocked(supabase.from).mockImplementation(mockFrom as any);

    const { result } = renderHook(() => useUserRole());

    await waitFor(() => {
      expect(result.current.isCreator).toBe(true);
      expect(result.current.isAdmin).toBe(false);
    });
  });

  it('identifies admin role correctly', async () => {
    const mockSession = { user: { id: 'user-1' } };
    
    vi.mocked(supabase.auth.getSession).mockResolvedValue({
      data: { session: mockSession as any },
      error: null,
    });

    const mockFrom = vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          data: [{ role: 'admin' }],
          error: null,
        })),
      })),
    }));

    vi.mocked(supabase.from).mockImplementation(mockFrom as any);

    const { result } = renderHook(() => useUserRole());

    await waitFor(() => {
      expect(result.current.isAdmin).toBe(true);
      expect(result.current.isCreator).toBe(false);
    });
  });

  it('identifies super_admin role correctly', async () => {
    const mockSession = { user: { id: 'user-1' } };
    
    vi.mocked(supabase.auth.getSession).mockResolvedValue({
      data: { session: mockSession as any },
      error: null,
    });

    const mockFrom = vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          data: [{ role: 'super_admin' }],
          error: null,
        })),
      })),
    }));

    vi.mocked(supabase.from).mockImplementation(mockFrom as any);

    const { result } = renderHook(() => useUserRole());

    await waitFor(() => {
      expect(result.current.isSuperAdmin).toBe(true);
    });
  });

  it('handles multiple roles correctly', async () => {
    const mockSession = { user: { id: 'user-1' } };
    
    vi.mocked(supabase.auth.getSession).mockResolvedValue({
      data: { session: mockSession as any },
      error: null,
    });

    const mockFrom = vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          data: [{ role: 'admin' }, { role: 'manager' }],
          error: null,
        })),
      })),
    }));

    vi.mocked(supabase.from).mockImplementation(mockFrom as any);

    const { result } = renderHook(() => useUserRole());

    await waitFor(() => {
      expect(result.current.isAdmin).toBe(true);
      expect(result.current.isManager).toBe(true);
    });
  });

  it('handles no roles gracefully', async () => {
    const mockSession = { user: { id: 'user-1' } };
    
    vi.mocked(supabase.auth.getSession).mockResolvedValue({
      data: { session: mockSession as any },
      error: null,
    });

    const mockFrom = vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          data: [],
          error: null,
        })),
      })),
    }));

    vi.mocked(supabase.from).mockImplementation(mockFrom as any);

    const { result } = renderHook(() => useUserRole());

    await waitFor(() => {
      expect(result.current.isCreator).toBe(false);
      expect(result.current.isAdmin).toBe(false);
      expect(result.current.isManager).toBe(false);
    });
  });
});
