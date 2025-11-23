import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ContractSignature } from '@/components/dashboard/ContractSignature';

const mockToDataURL = vi.fn(() => 'data:image/png;base64,mockSignature');

beforeEach(() => {
  HTMLCanvasElement.prototype.toDataURL = mockToDataURL;
  vi.clearAllMocks();
});

describe('ContractSignature', () => {
  const mockOnSignatureSubmit = vi.fn();
  const mockOnOpenChange = vi.fn();

  const defaultProps = {
    open: true,
    onOpenChange: mockOnOpenChange,
    onSignatureSubmit: mockOnSignatureSubmit,
  };

  it('renders dialog when open', () => {
    render(<ContractSignature {...defaultProps} />);
    
    expect(screen.getByText('Sign Contract Digitally')).toBeInTheDocument();
  });

  it('displays contract summary when contractData provided', () => {
    const contractData = {
      creator_name: 'Test Creator',
      contract_term_months: '12',
      percentage_split_creator: '60',
      percentage_split_agency: '40',
      contract_start_date: '2025-01-01',
    };

    render(<ContractSignature {...defaultProps} contractData={contractData} />);
    
    expect(screen.getByText('Contract Summary')).toBeInTheDocument();
    expect(screen.getByText(/Test Creator/)).toBeInTheDocument();
    expect(screen.getByText(/12 months/)).toBeInTheDocument();
  });

  it('renders signature canvas', () => {
    render(<ContractSignature {...defaultProps} />);
    
    const canvas = document.querySelector('canvas');
    expect(canvas).toBeInTheDocument();
  });

  it('clear button is available', () => {
    render(<ContractSignature {...defaultProps} />);
    
    const clearButton = screen.getByText('Clear');
    expect(clearButton).toBeInTheDocument();
  });

  it('submit button disabled without signature', () => {
    render(<ContractSignature {...defaultProps} />);
    
    const submitButton = screen.getByText('Sign Contract');
    expect(submitButton).toBeDisabled();
  });

  it('submit button disabled without terms agreement', () => {
    render(<ContractSignature {...defaultProps} />);
    
    // Simulate drawing
    const canvas = screen.getByRole('img');
    fireEvent.mouseDown(canvas, { clientX: 100, clientY: 100 });
    fireEvent.mouseMove(canvas, { clientX: 150, clientY: 150 });
    fireEvent.mouseUp(canvas);
    
    const submitButton = screen.getByText('Sign Contract');
    expect(submitButton).toBeDisabled();
  });

  it('converts signature to base64 on submit', async () => {
    render(<ContractSignature {...defaultProps} />);
    
    // Simulate drawing
    const canvas = screen.getByRole('img');
    fireEvent.mouseDown(canvas, { clientX: 100, clientY: 100 });
    fireEvent.mouseMove(canvas, { clientX: 150, clientY: 150 });
    fireEvent.mouseUp(canvas);
    
    // Agree to terms
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);
    
    // Submit
    const submitButton = screen.getByText('Sign Contract');
    fireEvent.click(submitButton);
    
    expect(mockToDataURL).toHaveBeenCalled();
  });

  it('calls onSignatureSubmit with signature data', async () => {
    render(<ContractSignature {...defaultProps} />);
    
    // Simulate drawing
    const canvas = screen.getByRole('img');
    fireEvent.mouseDown(canvas, { clientX: 100, clientY: 100 });
    fireEvent.mouseMove(canvas, { clientX: 150, clientY: 150 });
    fireEvent.mouseUp(canvas);
    
    // Agree to terms
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);
    
    // Submit
    const submitButton = screen.getByText('Sign Contract');
    fireEvent.click(submitButton);
    
    expect(mockOnSignatureSubmit).toHaveBeenCalledWith('data:image/png;base64,mockSignature');
  });
});
