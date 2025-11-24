export type CreatorStage = 'no_invitation' | 'invitation_sent' | 'meeting_booked' | 'meeting_completed';

export interface EmailStatus {
  status: string;
  sent_at: string | null;
  link_clicked_at: string | null;
  link_used_at: string | null;
  created_at: string;
}

export function determineCreatorStage(
  meetingStatus: string | null,
  emailStatus: EmailStatus | null
): CreatorStage {
  if (meetingStatus === 'completed') return 'meeting_completed';
  if (meetingStatus === 'confirmed' || meetingStatus === 'pending') return 'meeting_booked';
  if (emailStatus && emailStatus.sent_at) return 'invitation_sent';
  return 'no_invitation';
}

export function getStageInfo(stage: CreatorStage) {
  switch (stage) {
    case 'no_invitation':
      return {
        label: 'Awaiting Invitation',
        color: 'bg-red-500/10 text-red-500 border-red-500/20',
        description: 'No meeting invitation sent yet',
      };
    case 'invitation_sent':
      return {
        label: 'Invitation Sent',
        color: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
        description: 'Waiting for creator to book meeting',
      };
    case 'meeting_booked':
      return {
        label: 'Meeting Scheduled',
        color: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
        description: 'Meeting confirmed and scheduled',
      };
    case 'meeting_completed':
      return {
        label: 'Ready to Activate',
        color: 'bg-green-500/10 text-green-500 border-green-500/20',
        description: 'Meeting completed - can grant full access',
      };
  }
}

export function getUrgencyScore(
  stage: CreatorStage,
  meetingDate: string | null,
  emailSentAt: string | null
): number {
  const now = new Date();
  
  // Highest priority: meeting completed
  if (stage === 'meeting_completed') return 1;
  
  // High priority: meeting tomorrow
  if (stage === 'meeting_booked' && meetingDate) {
    const meeting = new Date(meetingDate);
    const daysUntil = Math.floor((meeting.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    if (daysUntil <= 1) return 2;
    if (daysUntil <= 7) return 3;
    return 4;
  }
  
  // Medium priority: invitation sent over 7 days ago
  if (stage === 'invitation_sent' && emailSentAt) {
    const sent = new Date(emailSentAt);
    const daysSince = Math.floor((now.getTime() - sent.getTime()) / (1000 * 60 * 60 * 24));
    if (daysSince >= 7) return 5;
    return 7;
  }
  
  // Lower priority: no invitation sent
  if (stage === 'no_invitation') return 6;
  
  return 8;
}

export function formatTimeAgo(date: string | null): string {
  if (!date) return '';
  
  const now = new Date();
  const past = new Date(date);
  const diffMs = now.getTime() - past.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  
  if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  if (diffHours > 0) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffMinutes > 0) return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
  return 'just now';
}

export function formatTimeUntil(date: string | null): string {
  if (!date) return '';
  
  const now = new Date();
  const future = new Date(date);
  const diffMs = future.getTime() - now.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  
  if (diffDays > 0) return `in ${diffDays} day${diffDays > 1 ? 's' : ''}`;
  if (diffHours > 0) return `in ${diffHours} hour${diffHours > 1 ? 's' : ''}`;
  return 'today';
}
