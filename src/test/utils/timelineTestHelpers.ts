export const mockTimelineStages = [
  { stage: 'application', label: 'Application Submitted', completed: true, date: '2025-01-01' },
  { stage: 'meeting', label: 'Meeting Scheduled', completed: true, date: '2025-01-10' },
  { stage: 'onboarding', label: 'Onboarding Started', completed: true, date: '2025-01-15' },
  { stage: 'contract', label: 'Contract Signed', completed: true, date: '2025-01-20' },
  { stage: 'access', label: 'Full Access Granted', completed: true, date: '2025-01-25' },
];

export const createMockTimelineEvent = (stage: string, eventType: string) => ({
  id: `event-${stage}-${eventType}`,
  user_id: 'user-123',
  stage,
  event_type: eventType,
  read: false,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
});

export const calculateExpectedProgress = (stages: typeof mockTimelineStages) => {
  const completedStages = stages.filter(s => s.completed).length;
  const totalStages = stages.length;
  return Math.round((completedStages / totalStages) * 100);
};

export const mockTimelineData = {
  application: { status: 'approved', created_at: '2025-01-01' },
  meeting: { status: 'completed', completed_at: '2025-01-10' },
  onboarding: { is_completed: true, updated_at: '2025-01-15' },
  contract: { contract_signed: true, signed_at: '2025-01-20' },
  access: { access_level: 'full_access', granted_at: '2025-01-25' },
};

export const getStageProgress = (stageName: string): number => {
  const stageIndex = mockTimelineStages.findIndex(s => s.stage === stageName);
  if (stageIndex === -1) return 0;
  
  const completedUpToStage = mockTimelineStages
    .slice(0, stageIndex + 1)
    .filter(s => s.completed).length;
  
  return Math.round((completedUpToStage / mockTimelineStages.length) * 100);
};

export const mockNotifications = [
  createMockTimelineEvent('application', 'approved'),
  createMockTimelineEvent('meeting', 'scheduled'),
  createMockTimelineEvent('meeting', 'completed'),
  createMockTimelineEvent('onboarding', 'completed'),
  createMockTimelineEvent('contract', 'signed'),
  createMockTimelineEvent('access', 'granted'),
];
