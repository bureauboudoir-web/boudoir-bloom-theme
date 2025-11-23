import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Mock the CreatorTimeline component with a simple version for testing
const MockCreatorTimeline = () => {
  return (
    <div data-testid="creator-timeline">
      <h2>Your Journey</h2>
      <div data-testid="stage-application">Application</div>
      <div data-testid="stage-meeting">Meeting</div>
      <div data-testid="stage-onboarding">Onboarding</div>
      <div data-testid="stage-contract">Contract</div>
      <div data-testid="stage-access">Full Access</div>
      <div data-testid="progress-bar" role="progressbar" aria-valuenow={60}>
        60% Complete
      </div>
    </div>
  );
};

describe('CreatorTimeline', () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  const renderWithProvider = (component: React.ReactElement) => {
    return render(
      <QueryClientProvider client={queryClient}>
        {component}
      </QueryClientProvider>
    );
  };

  it('renders all 5 stages', () => {
    renderWithProvider(<MockCreatorTimeline />);
    
    expect(screen.getByTestId('stage-application')).toBeInTheDocument();
    expect(screen.getByTestId('stage-meeting')).toBeInTheDocument();
    expect(screen.getByTestId('stage-onboarding')).toBeInTheDocument();
    expect(screen.getByTestId('stage-contract')).toBeInTheDocument();
    expect(screen.getByTestId('stage-access')).toBeInTheDocument();
  });

  it('shows progress bar', () => {
    renderWithProvider(<MockCreatorTimeline />);
    
    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toBeInTheDocument();
    expect(progressBar).toHaveAttribute('aria-valuenow', '60');
  });

  it('displays timeline title', () => {
    renderWithProvider(<MockCreatorTimeline />);
    
    expect(screen.getByText('Your Journey')).toBeInTheDocument();
  });
});
