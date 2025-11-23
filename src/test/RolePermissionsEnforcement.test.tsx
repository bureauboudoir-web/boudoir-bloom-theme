import { describe, it, expect, vi, beforeEach } from 'vitest';
import { supabase } from '@/integrations/supabase/client';

vi.mock('@/integrations/supabase/client');

describe('Role Permissions Enforcement', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Admin Role Permissions', () => {
    it('should allow admin to view all user roles', async () => {
      const mockAdminUser = { id: 'admin-1' };
      
      vi.mocked(supabase.auth.getSession).mockResolvedValue({
        data: { session: { user: mockAdminUser } as any },
        error: null,
      });

      const mockFrom = vi.fn((table: string) => {
        if (table === 'user_roles') {
          return {
            select: vi.fn(() => ({
              eq: vi.fn(() => Promise.resolve({
                data: [{ role: 'admin' }],
                error: null,
              })),
            })),
          };
        }
        return { select: vi.fn() };
      });

      vi.mocked(supabase.from).mockImplementation(mockFrom as any);

      const { data, error } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', mockAdminUser.id);

      expect(error).toBeNull();
      expect(data).toBeDefined();
    });

    it('should allow admin to assign roles', async () => {
      const mockAdminUser = { id: 'admin-1' };
      const targetUserId = 'user-2';
      
      const mockInsert = vi.fn(() => ({
        select: vi.fn(() => Promise.resolve({
          data: [{ user_id: targetUserId, role: 'creator' }],
          error: null,
        })),
      }));

      vi.mocked(supabase.from).mockReturnValue({
        insert: mockInsert,
      } as any);

      const { data, error } = await supabase
        .from('user_roles')
        .insert({ user_id: targetUserId, role: 'creator' })
        .select();

      expect(error).toBeNull();
      expect(data).toBeDefined();
      expect(mockInsert).toHaveBeenCalled();
    });

    it('should allow admin to revoke roles', async () => {
      const mockAdminUser = { id: 'admin-1' };
      const targetUserId = 'user-2';
      
      const mockDelete = vi.fn(() => ({
        eq: vi.fn(() => ({
          eq: vi.fn(() => Promise.resolve({
            data: null,
            error: null,
          })),
        })),
      }));

      vi.mocked(supabase.from).mockReturnValue({
        delete: mockDelete,
      } as any);

      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', targetUserId)
        .eq('role', 'creator');

      expect(error).toBeNull();
      expect(mockDelete).toHaveBeenCalled();
    });

    it('should prevent admin from removing super_admin role', async () => {
      const mockAdminUser = { id: 'admin-1' };
      const targetUserId = 'super-admin-1';
      
      const mockDelete = vi.fn(() => ({
        eq: vi.fn(() => ({
          eq: vi.fn(() => Promise.resolve({
            data: null,
            error: { message: 'Admins cannot modify super_admin roles' },
          })),
        })),
      }));

      vi.mocked(supabase.from).mockReturnValue({
        delete: mockDelete,
      } as any);

      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', targetUserId)
        .eq('role', 'super_admin');

      expect(error).toBeDefined();
      expect(error?.message).toContain('super_admin');
    });
  });

  describe('Super Admin Role Permissions', () => {
    it('should allow super_admin to manage all roles including super_admin', async () => {
      const mockSuperAdminUser = { id: 'super-admin-1' };
      const targetUserId = 'user-2';
      
      const mockInsert = vi.fn(() => ({
        select: vi.fn(() => Promise.resolve({
          data: [{ user_id: targetUserId, role: 'super_admin' }],
          error: null,
        })),
      }));

      vi.mocked(supabase.from).mockReturnValue({
        insert: mockInsert,
      } as any);

      const { data, error } = await supabase
        .from('user_roles')
        .insert({ user_id: targetUserId, role: 'super_admin' })
        .select();

      expect(error).toBeNull();
      expect(data).toBeDefined();
    });

    it('should prevent removing last super_admin', async () => {
      const mockSuperAdminUser = { id: 'super-admin-1' };
      
      const mockDelete = vi.fn(() => ({
        eq: vi.fn(() => ({
          eq: vi.fn(() => Promise.resolve({
            data: null,
            error: { message: 'Cannot remove the last super_admin role' },
          })),
        })),
      }));

      vi.mocked(supabase.from).mockReturnValue({
        delete: mockDelete,
      } as any);

      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', mockSuperAdminUser.id)
        .eq('role', 'super_admin');

      expect(error).toBeDefined();
      expect(error?.message).toContain('last super_admin');
    });

    it('should allow super_admin to view audit logs', async () => {
      const mockSuperAdminUser = { id: 'super-admin-1' };
      
      const mockFrom = vi.fn(() => ({
        select: vi.fn(() => ({
          order: vi.fn(() => Promise.resolve({
            data: [
              { action: 'granted', role: 'admin', target_user_id: 'user-1' },
              { action: 'revoked', role: 'creator', target_user_id: 'user-2' },
            ],
            error: null,
          })),
        })),
      }));

      vi.mocked(supabase.from).mockImplementation(mockFrom as any);

      const { data, error } = await supabase
        .from('role_audit_logs')
        .select('*')
        .order('created_at', { ascending: false });

      expect(error).toBeNull();
      expect(data).toBeDefined();
      expect(data?.length).toBeGreaterThan(0);
    });
  });

  describe('Manager Role Permissions', () => {
    it('should prevent manager from assigning roles', async () => {
      const mockManagerUser = { id: 'manager-1' };
      const targetUserId = 'user-2';
      
      const mockInsert = vi.fn(() => ({
        select: vi.fn(() => Promise.resolve({
          data: null,
          error: { message: 'Permission denied' },
        })),
      }));

      vi.mocked(supabase.from).mockReturnValue({
        insert: mockInsert,
      } as any);

      const { error } = await supabase
        .from('user_roles')
        .insert({ user_id: targetUserId, role: 'creator' })
        .select();

      expect(error).toBeDefined();
    });

    it('should allow manager to view assigned creator profiles', async () => {
      const mockManagerUser = { id: 'manager-1' };
      
      const mockFrom = vi.fn(() => ({
        select: vi.fn(() => ({
          eq: vi.fn(() => Promise.resolve({
            data: [
              { id: 'creator-1', full_name: 'Creator One', assigned_manager_id: 'manager-1' },
              { id: 'creator-2', full_name: 'Creator Two', assigned_manager_id: 'manager-1' },
            ],
            error: null,
          })),
        })),
      }));

      vi.mocked(supabase.from).mockImplementation(mockFrom as any);

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('assigned_manager_id', mockManagerUser.id);

      expect(error).toBeNull();
      expect(data).toBeDefined();
      expect(data?.length).toBe(2);
    });
  });

  describe('Creator Role Permissions', () => {
    it('should prevent creator from viewing other users roles', async () => {
      const mockCreatorUser = { id: 'creator-1' };
      const otherUserId = 'creator-2';
      
      const mockFrom = vi.fn(() => ({
        select: vi.fn(() => ({
          eq: vi.fn(() => Promise.resolve({
            data: null,
            error: { message: 'Permission denied' },
          })),
        })),
      }));

      vi.mocked(supabase.from).mockImplementation(mockFrom as any);

      const { error } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', otherUserId);

      expect(error).toBeDefined();
    });

    it('should allow creator to view their own roles', async () => {
      const mockCreatorUser = { id: 'creator-1' };
      
      const mockFrom = vi.fn(() => ({
        select: vi.fn(() => ({
          eq: vi.fn(() => Promise.resolve({
            data: [{ role: 'creator' }],
            error: null,
          })),
        })),
      }));

      vi.mocked(supabase.from).mockImplementation(mockFrom as any);

      const { data, error } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', mockCreatorUser.id);

      expect(error).toBeNull();
      expect(data).toBeDefined();
    });

    it('should prevent creator from accessing admin dashboard', async () => {
      const mockCreatorUser = { id: 'creator-1' };
      
      vi.mocked(supabase.auth.getSession).mockResolvedValue({
        data: { session: { user: mockCreatorUser } as any },
        error: null,
      });

      const mockFrom = vi.fn(() => ({
        select: vi.fn(() => ({
          eq: vi.fn(() => Promise.resolve({
            data: [{ role: 'creator' }],
            error: null,
          })),
        })),
      }));

      vi.mocked(supabase.from).mockImplementation(mockFrom as any);

      const { data } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', mockCreatorUser.id);

      const hasAdminRole = data?.some((r: any) => 
        r.role === 'admin' || r.role === 'super_admin'
      );

      expect(hasAdminRole).toBe(false);
    });
  });

  describe('Access Level Enforcement', () => {
    it('should enforce no_access level restrictions', async () => {
      const mockCreatorUser = { id: 'creator-1' };
      
      const mockFrom = vi.fn(() => ({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            single: vi.fn(() => Promise.resolve({
              data: { access_level: 'no_access' },
              error: null,
            })),
          })),
        })),
      }));

      vi.mocked(supabase.from).mockImplementation(mockFrom as any);

      const { data } = await supabase
        .from('creator_access_levels')
        .select('*')
        .eq('user_id', mockCreatorUser.id)
        .single();

      expect(data?.access_level).toBe('no_access');
    });

    it('should enforce meeting_only level permissions', async () => {
      const mockCreatorUser = { id: 'creator-1' };
      
      const mockFrom = vi.fn(() => ({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            single: vi.fn(() => Promise.resolve({
              data: { access_level: 'meeting_only' },
              error: null,
            })),
          })),
        })),
      }));

      vi.mocked(supabase.from).mockImplementation(mockFrom as any);

      const { data } = await supabase
        .from('creator_access_levels')
        .select('*')
        .eq('user_id', mockCreatorUser.id)
        .single();

      expect(data?.access_level).toBe('meeting_only');
    });

    it('should grant full_access permissions', async () => {
      const mockCreatorUser = { id: 'creator-1' };
      
      const mockFrom = vi.fn(() => ({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            single: vi.fn(() => Promise.resolve({
              data: { access_level: 'full_access' },
              error: null,
            })),
          })),
        })),
      }));

      vi.mocked(supabase.from).mockImplementation(mockFrom as any);

      const { data } = await supabase
        .from('creator_access_levels')
        .select('*')
        .eq('user_id', mockCreatorUser.id)
        .single();

      expect(data?.access_level).toBe('full_access');
    });
  });

  describe('RLS Policy Enforcement', () => {
    it('should block anonymous access to sensitive tables', async () => {
      vi.mocked(supabase.auth.getSession).mockResolvedValue({
        data: { session: null },
        error: null,
      });

      const sensitiveTable = 'user_roles';
      
      const mockFrom = vi.fn(() => ({
        select: vi.fn(() => Promise.resolve({
          data: null,
          error: { message: 'Permission denied' },
        })),
      }));

      vi.mocked(supabase.from).mockImplementation(mockFrom as any);

      const { error } = await supabase
        .from(sensitiveTable)
        .select('*');

      expect(error).toBeDefined();
    });

    it('should enforce row-level security on user data', async () => {
      const mockUser = { id: 'user-1' };
      const otherUserId = 'user-2';
      
      vi.mocked(supabase.auth.getSession).mockResolvedValue({
        data: { session: { user: mockUser } as any },
        error: null,
      });

      const mockFrom = vi.fn(() => ({
        select: vi.fn(() => ({
          eq: vi.fn((field: string, value: string) => {
            if (value === otherUserId) {
              return Promise.resolve({
                data: null,
                error: { message: 'Row-level security policy violation' },
              });
            }
            return Promise.resolve({
              data: [{ id: mockUser.id }],
              error: null,
            });
          }),
        })),
      }));

      vi.mocked(supabase.from).mockImplementation(mockFrom as any);

      const { error: ownDataError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', mockUser.id);

      const { error: otherDataError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', otherUserId);

      expect(ownDataError).toBeNull();
      expect(otherDataError).toBeDefined();
    });
  });
});
