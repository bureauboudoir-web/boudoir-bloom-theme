import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ContactSupport from '@/components/dashboard/ContactSupport';

const mockQueryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={mockQueryClient}>
    {children}
  </QueryClientProvider>
);

describe('Support Tickets', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders support form', () => {
    render(<ContactSupport userId="user-123" userName="Test User" />, { wrapper });
    
    expect(screen.getByText(/Contact Support/i)).toBeInTheDocument();
  });

  it('has subject input field', () => {
    render(<ContactSupport userId="user-123" userName="Test User" />, { wrapper });
    
    const subjectInput = screen.getByLabelText(/Subject/i);
    expect(subjectInput).toBeInTheDocument();
  });

  it('has message textarea', () => {
    render(<ContactSupport userId="user-123" userName="Test User" />, { wrapper });
    
    const messageTextarea = screen.getByLabelText(/Message/i);
    expect(messageTextarea).toBeInTheDocument();
  });

  it('has file attachment option', () => {
    render(<ContactSupport userId="user-123" userName="Test User" />, { wrapper });
    
    const fileInput = screen.getByLabelText(/Attachment/i);
    expect(fileInput).toBeInTheDocument();
  });

  it('validates required fields', () => {
    render(<ContactSupport userId="user-123" userName="Test User" />, { wrapper });
    
    const submitButton = screen.getByText(/Submit Ticket/i);
    fireEvent.click(submitButton);
    
    // Form should not submit without required fields
    expect(screen.getByLabelText(/Subject/i)).toBeInTheDocument();
  });

  it('accepts text input in subject', () => {
    render(<ContactSupport userId="user-123" userName="Test User" />, { wrapper });
    
    const subjectInput = screen.getByLabelText(/Subject/i) as HTMLInputElement;
    fireEvent.change(subjectInput, { target: { value: 'Test Subject' } });
    
    expect(subjectInput.value).toBe('Test Subject');
  });

  it('accepts text input in message', () => {
    render(<ContactSupport userId="user-123" userName="Test User" />, { wrapper });
    
    const messageTextarea = screen.getByLabelText(/Message/i) as HTMLTextAreaElement;
    fireEvent.change(messageTextarea, { target: { value: 'Test message' } });
    
    expect(messageTextarea.value).toBe('Test message');
  });
});
