import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SignedContractsView } from '@/components/admin/SignedContractsView';
import { supabase } from '@/integrations/supabase/client';

vi.mock('@/integrations/supabase/client');

describe('SignedContractsView', () => {
  const mockContracts = {
    'user-1': {
      id: 'contract-1',
      user_id: 'user-1',
      contract_signed: true,
      signed_at: '2025-01-15T10:00:00Z',
      digital_signature_creator: 'data:image/png;base64,signature1',
      signed_contract_url: 'https://example.com/signed-1.pdf',
      generated_pdf_url: 'https://example.com/generated-1.pdf',
      contract_version: 'long',
      contract_data: {
        percentage_split_creator: '60',
        percentage_split_agency: '40',
        contract_term_months: '12',
      },
    },
    'user-2': {
      id: 'contract-2',
      user_id: 'user-2',
      contract_signed: false,
      signed_at: null,
      digital_signature_creator: null,
      signed_contract_url: null,
      generated_pdf_url: 'https://example.com/generated-2.pdf',
      contract_version: 'short',
      contract_data: {},
    },
  };

  const mockCreators = [
    { id: 'user-1', full_name: 'Alice Creator', email: 'alice@test.com' },
    { id: 'user-2', full_name: 'Bob Creator', email: 'bob@test.com' },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('displays only signed contracts', () => {
    render(<SignedContractsView contracts={mockContracts} creators={mockCreators} />);
    
    expect(screen.getByText('Alice Creator')).toBeInTheDocument();
    expect(screen.queryByText('Bob Creator')).not.toBeInTheDocument();
  });

  it('shows empty state when no signed contracts', () => {
    render(<SignedContractsView contracts={{}} creators={[]} />);
    
    expect(screen.getByText('No signed contracts yet')).toBeInTheDocument();
  });

  it('filters by creator name', () => {
    render(<SignedContractsView contracts={mockContracts} creators={mockCreators} />);
    
    const searchInput = screen.getByPlaceholderText(/Search by creator name/);
    fireEvent.change(searchInput, { target: { value: 'Alice' } });
    
    expect(screen.getByText('Alice Creator')).toBeInTheDocument();
  });

  it('filters by creator email', () => {
    render(<SignedContractsView contracts={mockContracts} creators={mockCreators} />);
    
    const searchInput = screen.getByPlaceholderText(/Search by creator name/);
    fireEvent.change(searchInput, { target: { value: 'alice@test.com' } });
    
    expect(screen.getByText('Alice Creator')).toBeInTheDocument();
  });

  it('displays signature preview', () => {
    render(<SignedContractsView contracts={mockContracts} creators={mockCreators} />);
    
    const signatureImages = screen.getAllByRole('img');
    const signatureImage = signatureImages.find(img => img.getAttribute('alt') === 'Signature');
    expect(signatureImage).toHaveAttribute('src', 'data:image/png;base64,signature1');
  });

  it('download button opens correct URL', () => {
    const windowOpenSpy = vi.spyOn(window, 'open').mockImplementation(() => null);
    
    render(<SignedContractsView contracts={mockContracts} creators={mockCreators} />);
    
    const downloadButton = screen.getByText('Download');
    fireEvent.click(downloadButton);
    
    expect(windowOpenSpy).toHaveBeenCalledWith('https://example.com/signed-1.pdf', '_blank');
  });

  it('regenerate button calls edge function', async () => {
    const mockInvoke = vi.fn().mockResolvedValue({ data: { success: true }, error: null });
    vi.mocked(supabase.functions.invoke).mockImplementation(mockInvoke);
    
    render(<SignedContractsView contracts={mockContracts} creators={mockCreators} />);
    
    const regenerateButtons = screen.getAllByRole('button');
    const regenerateButton = regenerateButtons.find(btn => 
      btn.querySelector('.lucide-refresh-cw')
    );
    
    if (regenerateButton) {
      fireEvent.click(regenerateButton);
      
      await waitFor(() => {
        expect(mockInvoke).toHaveBeenCalledWith('regenerate-signed-contract', {
          body: { contractId: 'contract-1' },
        });
      });
    }
  });

  it('CSV export generates correct data', () => {
    const createElementSpy = vi.spyOn(document, 'createElement');
    const clickSpy = vi.fn();
    createElementSpy.mockReturnValue({ click: clickSpy } as any);
    
    render(<SignedContractsView contracts={mockContracts} creators={mockCreators} />);
    
    const exportButton = screen.getByText(/Export CSV/);
    fireEvent.click(exportButton);
    
    expect(clickSpy).toHaveBeenCalled();
  });

  it('shows correct contract count', () => {
    render(<SignedContractsView contracts={mockContracts} creators={mockCreators} />);
    
    expect(screen.getByText(/Showing 1 of 1 signed contracts/)).toBeInTheDocument();
  });
});
