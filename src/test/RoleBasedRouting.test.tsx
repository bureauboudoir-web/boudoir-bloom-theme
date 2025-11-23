import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

// Mock the supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      signInWithPassword: vi.fn(),
      onAuthStateChange: vi.fn(() => ({
        data: { subscription: { unsubscribe: vi.fn() } }
      })),
      getSession: vi.fn(),
    },
    from: vi.fn(),
  },
}));

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('Role-Based Routing', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('redirects super_admin to /admin after login', async () => {
    const mockUser = { id: '123', email: 'super@admin.com' };
    const mockSession = { user: mockUser };

    (supabase.auth.signInWithPassword as any).mockResolvedValue({
      data: { user: mockUser, session: mockSession },
      error: null,
    });

    (supabase.from as any).mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({
          data: [{ role: 'super_admin' }],
          error: null,
        }),
      }),
    });

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <BrowserRouter>{children}</BrowserRouter>
    );

    const { result } = renderHook(() => useAuth(), { wrapper });

    await result.current.signIn('super@admin.com', 'password');

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/admin');
    });
  });

  it('redirects admin to /admin after login', async () => {
    const mockUser = { id: '456', email: 'admin@test.com' };
    const mockSession = { user: mockUser };

    (supabase.auth.signInWithPassword as any).mockResolvedValue({
      data: { user: mockUser, session: mockSession },
      error: null,
    });

    (supabase.from as any).mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({
          data: [{ role: 'admin' }],
          error: null,
        }),
      }),
    });

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <BrowserRouter>{children}</BrowserRouter>
    );

    const { result } = renderHook(() => useAuth(), { wrapper });

    await result.current.signIn('admin@test.com', 'password');

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/admin');
    });
  });

  it('redirects manager-only to /manager after login', async () => {
    const mockUser = { id: '789', email: 'manager@test.com' };
    const mockSession = { user: mockUser };

    (supabase.auth.signInWithPassword as any).mockResolvedValue({
      data: { user: mockUser, session: mockSession },
      error: null,
    });

    (supabase.from as any).mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({
          data: [{ role: 'manager' }],
          error: null,
        }),
      }),
    });

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <BrowserRouter>{children}</BrowserRouter>
    );

    const { result } = renderHook(() => useAuth(), { wrapper });

    await result.current.signIn('manager@test.com', 'password');

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/manager');
    });
  });

  it('redirects creator to /dashboard after login', async () => {
    const mockUser = { id: 'abc', email: 'creator@test.com' };
    const mockSession = { user: mockUser };

    (supabase.auth.signInWithPassword as any).mockResolvedValue({
      data: { user: mockUser, session: mockSession },
      error: null,
    });

    (supabase.from as any).mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({
          data: [{ role: 'creator' }],
          error: null,
        }),
      }),
    });

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <BrowserRouter>{children}</BrowserRouter>
    );

    const { result } = renderHook(() => useAuth(), { wrapper });

    await result.current.signIn('creator@test.com', 'password');

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('blocks login for users with no roles', async () => {
    const mockUser = { id: 'xyz', email: 'norole@test.com' };
    const mockSession = { user: mockUser };

    (supabase.auth.signInWithPassword as any).mockResolvedValue({
      data: { user: mockUser, session: mockSession },
      error: null,
    });

    (supabase.from as any).mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({
          data: [],
          error: null,
        }),
      }),
    });

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <BrowserRouter>{children}</BrowserRouter>
    );

    const { result } = renderHook(() => useAuth(), { wrapper });

    const response = await result.current.signIn('norole@test.com', 'password');

    expect(response.data).toBeNull();
    expect(response.error?.message).toBe('Account not properly configured. Please contact support.');
  });

  it('prioritizes admin role when user has both admin and creator roles', async () => {
    const mockUser = { id: 'multi', email: 'admin-creator@test.com' };
    const mockSession = { user: mockUser };

    (supabase.auth.signInWithPassword as any).mockResolvedValue({
      data: { user: mockUser, session: mockSession },
      error: null,
    });

    (supabase.from as any).mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({
          data: [{ role: 'admin' }, { role: 'creator' }],
          error: null,
        }),
      }),
    });

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <BrowserRouter>{children}</BrowserRouter>
    );

    const { result } = renderHook(() => useAuth(), { wrapper });

    await result.current.signIn('admin-creator@test.com', 'password');

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/admin');
    });
  });
});
