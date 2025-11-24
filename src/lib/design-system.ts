/**
 * Design System Constants
 * Centralized design tokens for consistent UI across the application
 */

export const SPACING = {
  container: 'px-3 sm:px-6',
  containerY: 'py-4 sm:py-8',
  header: 'px-3 sm:px-6 py-3 sm:py-4',
  card: 'p-4 sm:p-6',
  cardCompact: 'p-3 sm:p-4',
  section: 'space-y-4 sm:space-y-6',
  grid: 'gap-4 sm:gap-6',
} as const;

export const ICONS = {
  xs: 'w-3 h-3',
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
  xl: 'w-8 h-8',
} as const;

export const TYPOGRAPHY = {
  dashboardTitle: 'text-xl sm:text-2xl lg:text-3xl',
  sectionTitle: 'text-lg sm:text-xl',
  cardTitle: 'text-base sm:text-lg',
  body: 'text-sm sm:text-base',
  caption: 'text-xs sm:text-sm',
} as const;

export const CARDS = {
  default: 'rounded-lg border bg-card shadow-sm',
  interactive: 'cursor-pointer transition-all hover:shadow-md hover:border-primary/40',
  urgent: 'border-2 border-primary/50',
} as const;

export const BADGES = {
  notification: 'h-5 min-w-[20px] px-1.5 text-xs',
  status: 'text-xs px-2 py-0.5',
} as const;
