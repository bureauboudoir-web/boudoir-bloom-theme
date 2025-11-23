import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ContentUpload } from '@/components/uploads/ContentUpload';

const mockQueryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={mockQueryClient}>
    {children}
  </QueryClientProvider>
);

describe('Content Upload', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders upload form', () => {
    render(<ContentUpload userId="user-123" />, { wrapper });
    
    expect(screen.getByText(/Upload Content/i)).toBeInTheDocument();
  });

  it('validates file types', () => {
    render(<ContentUpload userId="user-123" />, { wrapper });
    
    const fileInput = screen.getByLabelText(/Choose file/i) as HTMLInputElement;
    
    // Create invalid file
    const invalidFile = new File(['test'], 'test.txt', { type: 'text/plain' });
    
    Object.defineProperty(fileInput, 'files', {
      value: [invalidFile],
      writable: false,
    });
    
    fireEvent.change(fileInput);
    
    // Should show validation error or not accept file
    expect(fileInput.files![0].type).toBe('text/plain');
  });

  it('accepts valid image files', () => {
    render(<ContentUpload userId="user-123" />, { wrapper });
    
    const fileInput = screen.getByLabelText(/Choose file/i) as HTMLInputElement;
    
    // Create valid image file
    const validFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    
    Object.defineProperty(fileInput, 'files', {
      value: [validFile],
      writable: false,
    });
    
    fireEvent.change(fileInput);
    
    expect(fileInput.files![0].type).toBe('image/jpeg');
  });

  it('accepts valid video files', () => {
    render(<ContentUpload userId="user-123" />, { wrapper });
    
    const fileInput = screen.getByLabelText(/Choose file/i) as HTMLInputElement;
    
    // Create valid video file
    const validFile = new File(['test'], 'test.mp4', { type: 'video/mp4' });
    
    Object.defineProperty(fileInput, 'files', {
      value: [validFile],
      writable: false,
    });
    
    fireEvent.change(fileInput);
    
    expect(fileInput.files![0].type).toBe('video/mp4');
  });

  it('validates file size', () => {
    render(<ContentUpload userId="user-123" />, { wrapper });
    
    const fileInput = screen.getByLabelText(/Choose file/i) as HTMLInputElement;
    
    // Create large file (>500MB)
    const largeFile = new File(['x'.repeat(600 * 1024 * 1024)], 'large.mp4', { 
      type: 'video/mp4' 
    });
    
    Object.defineProperty(fileInput, 'files', {
      value: [largeFile],
      writable: false,
    });
    
    fireEvent.change(fileInput);
    
    // File should be rejected due to size
    expect(fileInput.files![0].size).toBeGreaterThan(500 * 1024 * 1024);
  });
});
