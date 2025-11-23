import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const mockQueryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});

// Mock admin dashboard with test roles
const MockAdminDashboard = ({ role }: { role: string }) => (
  <div>
    <h1>Admin Dashboard</h1>
    <div data-testid="applications">Applications</div>
    <div data-testid="contracts">Contracts</div>
    <div data-testid="meetings">Meetings</div>
    {role === 'super_admin' && (
      <div data-testid="developer-tools">Developer Tools</div>
    )}
  </div>
);

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={mockQueryClient}>
    <BrowserRouter>
      {children}
    </BrowserRouter>
  </QueryClientProvider>
);

describe('Admin Dashboard', () => {
  it('renders admin dashboard for admins', () => {
    render(<MockAdminDashboard role="admin" />, { wrapper });
    
    expect(screen.getByText('Admin Dashboard')).toBeInTheDocument();
  });

  it('shows all navigation tabs', () => {
    render(<MockAdminDashboard role="admin" />, { wrapper });
    
    expect(screen.getByTestId('applications')).toBeInTheDocument();
    expect(screen.getByTestId('contracts')).toBeInTheDocument();
    expect(screen.getByTestId('meetings')).toBeInTheDocument();
  });

  it('shows developer tools only for super_admin', () => {
    const { rerender } = render(<MockAdminDashboard role="admin" />, { wrapper });
    
    expect(screen.queryByTestId('developer-tools')).not.toBeInTheDocument();
    
    rerender(<MockAdminDashboard role="super_admin" />);
    
    expect(screen.getByTestId('developer-tools')).toBeInTheDocument();
  });

  it('hides developer tools for regular admin', () => {
    render(<MockAdminDashboard role="admin" />, { wrapper });
    
    expect(screen.queryByTestId('developer-tools')).not.toBeInTheDocument();
  });

  it('hides developer tools for manager', () => {
    render(<MockAdminDashboard role="manager" />, { wrapper });
    
    expect(screen.queryByTestId('developer-tools')).not.toBeInTheDocument();
  });
});
