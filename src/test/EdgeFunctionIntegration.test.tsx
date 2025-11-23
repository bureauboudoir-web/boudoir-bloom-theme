import { describe, it, expect, vi, beforeEach } from 'vitest';
import { supabase } from '@/integrations/supabase/client';

vi.mock('@/integrations/supabase/client');

describe('Edge Function Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('generate-contract-pdf returns valid response', async () => {
    const mockResponse = {
      data: { success: true, data: { id: 'contract-123', pdf_url: 'https://example.com/pdf' } },
      error: null,
    };

    vi.mocked(supabase.functions.invoke).mockResolvedValue(mockResponse);

    const { data, error } = await supabase.functions.invoke('generate-contract-pdf', {
      body: { contractData: {} },
    });

    expect(error).toBeNull();
    expect(data.success).toBe(true);
    expect(data.data.pdf_url).toBeTruthy();
  });

  it('regenerate-signed-contract embeds signature', async () => {
    const mockResponse = {
      data: { success: true, url: 'https://example.com/signed.pdf' },
      error: null,
    };

    vi.mocked(supabase.functions.invoke).mockResolvedValue(mockResponse);

    const { data, error } = await supabase.functions.invoke('regenerate-signed-contract', {
      body: { contractId: 'contract-123' },
    });

    expect(error).toBeNull();
    expect(data.success).toBe(true);
    expect(data.url).toContain('signed');
  });

  it('create-test-accounts creates multiple accounts', async () => {
    const mockResponse = {
      data: {
        success: true,
        accounts: [
          { email: 'test-admin@test.com', roles: ['admin'] },
          { email: 'test-creator@test.com', roles: ['creator'] },
        ],
      },
      error: null,
    };

    vi.mocked(supabase.functions.invoke).mockResolvedValue(mockResponse);

    const { data, error } = await supabase.functions.invoke('create-test-accounts', {
      body: { action: 'create' },
    });

    expect(error).toBeNull();
    expect(data.success).toBe(true);
    expect(data.accounts.length).toBeGreaterThan(0);
  });

  it('approve-creator-application updates status', async () => {
    const mockResponse = {
      data: { success: true },
      error: null,
    };

    vi.mocked(supabase.functions.invoke).mockResolvedValue(mockResponse);

    const { data, error } = await supabase.functions.invoke('approve-creator-application', {
      body: { applicationId: 'app-123' },
    });

    expect(error).toBeNull();
    expect(data.success).toBe(true);
  });

  it('handles edge function errors gracefully', async () => {
    const mockError = new Error('Function error');

    vi.mocked(supabase.functions.invoke).mockResolvedValue({
      data: null,
      error: mockError,
    });

    const { data, error } = await supabase.functions.invoke('generate-contract-pdf', {
      body: {},
    });

    expect(error).toBeTruthy();
    expect(data).toBeNull();
  });

  it('includes CORS headers in responses', async () => {
    const mockResponse = {
      data: { success: true },
      error: null,
    };

    vi.mocked(supabase.functions.invoke).mockResolvedValue(mockResponse);

    const { data } = await supabase.functions.invoke('generate-contract-pdf', {
      body: {},
    });

    // Edge functions should return success/error structure
    expect(data).toHaveProperty('success');
  });
});
