import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { OnboardingStageGate } from '@/components/onboarding/OnboardingStageGate';

vi.mock('@/hooks/useMeetingStatus', () => ({
  useMeetingStatus: () => ({
    data: {
      meetingCompleted: true,
      meetingStatus: 'completed',
    },
  }),
}));

describe('OnboardingStageGate', () => {
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

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows children when meeting is completed and stage is post-meeting', () => {
    renderWithProvider(
      <OnboardingStageGate stage="post-meeting">
        <div>Protected Content</div>
      </OnboardingStageGate>
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('shows children when stage is pre-meeting', () => {
    renderWithProvider(
      <OnboardingStageGate stage="pre-meeting">
        <div>Public Content</div>
      </OnboardingStageGate>
    );

    expect(screen.getByText('Public Content')).toBeInTheDocument();
  });
});
