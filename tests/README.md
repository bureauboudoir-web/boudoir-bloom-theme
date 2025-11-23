# Test Suite Documentation

## Overview

This project uses Vitest and React Testing Library for comprehensive testing of components, hooks, and integration functionality.

## Running Tests

### Run all tests
```bash
npm test
```

### Run tests in watch mode
```bash
npm test -- --watch
```

### Run tests with UI
```bash
npm run test:ui
```

### Generate coverage report
```bash
npm run test:coverage
```

## Test Structure

### Component Tests
Located in `src/test/` with `.test.tsx` extension.

Tests include:
- **LanguageSelector.test.tsx** - Language switching functionality
- **CreatorTimeline.test.tsx** - Timeline display and progress
- **OnboardingStageGate.test.tsx** - Stage gating based on meeting completion

### Hook Tests
Custom hooks are tested with React Testing Library's `renderHook`.

Tests include:
- **useCreatorTimeline.test.tsx** - Timeline data fetching and calculations
- **useMeetingStatus.test.tsx** - Meeting status tracking
- **useTimelineNotifications.test.tsx** - Timeline notification generation

### Integration Tests
- **i18n.test.tsx** - Translation system integration

## Writing New Tests

### Example Component Test
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import MyComponent from './MyComponent';

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('handles click events', () => {
    render(<MyComponent />);
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByText('Clicked')).toBeInTheDocument();
  });
});
```

### Example Hook Test
```typescript
import { renderHook } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useMyHook } from './useMyHook';

describe('useMyHook', () => {
  it('returns initial state', () => {
    const { result } = renderHook(() => useMyHook());
    expect(result.current.value).toBe(0);
  });
});
```

## Mock Data

Shared mock data is available in `src/test/utils/mockData.ts`.

## Test Helpers

Common test utilities are in `src/test/utils/testHelpers.tsx`.

## Coverage Requirements

- Aim for 80%+ coverage on critical paths
- All new features should include tests
- Bug fixes should include regression tests

## CI/CD Integration

Tests run automatically on:
- Pull requests
- Main branch commits
- Pre-deployment checks

## Debugging Tests

### Run single test file
```bash
npm test -- src/test/MyComponent.test.tsx
```

### Run tests matching pattern
```bash
npm test -- --grep "language selector"
```

### Enable verbose output
```bash
npm test -- --reporter=verbose
```
