import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useContractGeneration } from '@/hooks/useContractGeneration';
import { supabase } from '@/integrations/supabase/client';

vi.mock('@/integrations/supabase/client');

describe('Contract Generation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('initializes with correct default state', () => {
    const { result } = renderHook(() => useContractGeneration());
    
    expect(result.current.isGenerating).toBe(false);
    expect(typeof result.current.generateContract).toBe('function');
  });

  it('calls edge function with correct contract data', async () => {
    const mockInvoke = vi.fn().mockResolvedValue({
      data: { success: true, data: { id: 'contract-123' } },
      error: null,
    });
    
    vi.mocked(supabase.functions.invoke).mockImplementation(mockInvoke);

    const { result } = renderHook(() => useContractGeneration());

    const contractData = {
      creator_id: 'user-123',
      creator_name: 'Test Creator',
      creator_dob: '1995-01-01',
      creator_address: '123 Test St',
      percentage_split_creator: '60',
      percentage_split_agency: '40',
      contract_term_months: '12',
      contract_start_date: '2025-01-01',
      contract_end_date: '2026-01-01',
      custom_clauses: 'Test clauses',
      agency_representative: 'Agency Rep',
      agency_address: 'Agency Address',
      agency_kvk: '12345678',
      auto_renew: true,
      termination_notice_days: 30,
      post_termination_rights_days: 90,
    };

    await result.current.generateContract(contractData);

    expect(mockInvoke).toHaveBeenCalledWith('generate-contract-pdf', {
      body: { contractData },
    });
  });

  it('toggles loading state during generation', async () => {
    vi.mocked(supabase.functions.invoke).mockImplementation(() => 
      new Promise(resolve => setTimeout(() => resolve({ data: { success: true }, error: null }), 100))
    );

    const { result } = renderHook(() => useContractGeneration());

    const generatePromise = result.current.generateContract({
      creator_id: 'user-123',
      creator_name: 'Test Creator',
      creator_dob: '1995-01-01',
      creator_address: '123 Test St',
      percentage_split_creator: '60',
      percentage_split_agency: '40',
      contract_term_months: '12',
      contract_start_date: '2025-01-01',
      contract_end_date: '2026-01-01',
      custom_clauses: '',
      agency_representative: 'Rep',
      agency_address: 'Address',
      agency_kvk: '12345678',
      auto_renew: false,
      termination_notice_days: 30,
      post_termination_rights_days: 90,
    });

    expect(result.current.isGenerating).toBe(true);

    await generatePromise;

    await waitFor(() => {
      expect(result.current.isGenerating).toBe(false);
    });
  });

  it('handles generation errors gracefully', async () => {
    const mockError = new Error('Generation failed');
    vi.mocked(supabase.functions.invoke).mockResolvedValue({
      data: null,
      error: mockError,
    });

    const { result } = renderHook(() => useContractGeneration());

    await expect(result.current.generateContract({
      creator_id: 'user-123',
      creator_name: 'Test Creator',
      creator_dob: '1995-01-01',
      creator_address: '123 Test St',
      percentage_split_creator: '60',
      percentage_split_agency: '40',
      contract_term_months: '12',
      contract_start_date: '2025-01-01',
      contract_end_date: '2026-01-01',
      custom_clauses: '',
      agency_representative: 'Rep',
      agency_address: 'Address',
      agency_kvk: '12345678',
      auto_renew: false,
      termination_notice_days: 30,
      post_termination_rights_days: 90,
    })).rejects.toThrow();
  });
});
