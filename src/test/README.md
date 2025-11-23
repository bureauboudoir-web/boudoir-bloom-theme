# Test Suite Documentation

This directory contains automated tests for the Bureau Boudoir application, focusing on role-based access control, permissions enforcement, and critical business workflows.

## Running Tests

```bash
# Run all tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run specific test file
npm test src/test/RolePermissionsEnforcement.test.tsx

# Run tests in watch mode
npm test -- --watch
```

## Test Files

### Role & Permission Tests

#### `RoleManagement.test.tsx`
Tests the `useUserRole` hook functionality:
- Creator role identification
- Admin role identification  
- Super admin role identification
- Multiple role handling
- No roles scenario

#### `RolePermissionsEnforcement.test.tsx` ⭐ NEW
Comprehensive tests for role permission enforcement:
- **Admin Permissions**: Role assignment, revocation, super_admin restrictions
- **Super Admin Permissions**: Full role management, last super_admin protection, audit log access
- **Manager Permissions**: Assigned creator access, role assignment restrictions
- **Creator Permissions**: Self-role viewing, admin dashboard restrictions
- **Access Levels**: no_access, meeting_only, full_access enforcement
- **RLS Policies**: Anonymous access blocking, row-level security validation

### Access Control Tests

#### `AccessLevelManagement.test.tsx`
Tests creator access level management:
- Access level granting
- Access level transitions
- Timeline event creation
- Permission validation

### Feature Tests

#### `AdminDashboard.test.tsx`
Tests admin dashboard functionality:
- Tab navigation
- User count display
- Admin-only access
- Component rendering

#### `ContractGeneration.test.tsx`
Tests contract generation workflow:
- PDF generation
- Template data handling
- Status updates
- Error handling

#### `ContractSignature.test.tsx`
Tests contract signing functionality:
- Digital signature capture
- PDF regeneration with signatures
- Status updates

#### `SignedContractsView.test.tsx`
Tests signed contracts view:
- Contract listing
- Status filtering
- Download functionality

#### `CreatorTimeline.test.tsx` & `CreatorTimelineIntegration.test.tsx`
Tests creator journey timeline:
- Stage progression
- Event tracking
- Notification system
- Integration flows

#### `ContentUpload.test.tsx`
Tests content upload functionality:
- File upload
- Metadata handling
- Storage integration

#### `InvoiceManagement.test.tsx`
Tests invoice management:
- Invoice creation
- Status transitions
- Payment confirmation
- Overdue handling

#### `MeetingScheduling.test.tsx`
Tests meeting scheduling:
- Availability checking
- Booking creation
- Status updates
- Notifications

#### `OnboardingFlow.test.tsx` & `OnboardingStageGate.test.tsx`
Tests creator onboarding:
- Step progression
- Data validation
- Stage gates
- Completion tracking

#### `SupportTickets.test.tsx`
Tests support ticket system:
- Ticket creation
- Admin responses
- Status management

### Internationalization

#### `LanguageSelector.test.tsx` & `i18n.test.tsx`
Tests multi-language support:
- Language switching
- Translation loading
- Content localization

## Coverage Goals

- **Lines**: 70%
- **Functions**: 70%
- **Branches**: 65%
- **Statements**: 70%

## Test Patterns

### Role Checking Pattern
```typescript
vi.mocked(supabase.from).mockImplementation((table: string) => {
  if (table === 'user_roles') {
    return {
      select: vi.fn(() => ({
        eq: vi.fn(() => Promise.resolve({
          data: [{ role: 'admin' }],
          error: null,
        })),
      })),
    };
  }
});
```

### Permission Enforcement Pattern
```typescript
const { error } = await supabase
  .from('protected_table')
  .insert(data);

expect(error).toBeDefined();
expect(error?.message).toContain('Permission denied');
```

### Access Level Pattern
```typescript
const { data } = await supabase
  .from('creator_access_levels')
  .select('access_level')
  .eq('user_id', userId)
  .single();

expect(data?.access_level).toBe('full_access');
```

## Adding New Tests

When adding new tests:

1. **Follow existing patterns** for consistency
2. **Mock Supabase client** properly with `vi.mock`
3. **Test both success and error cases**
4. **Use descriptive test names** that explain what's being tested
5. **Group related tests** in `describe` blocks
6. **Clean up** with `beforeEach(() => vi.clearAllMocks())`

## CI/CD Integration

Tests run automatically on:
- Pull requests
- Commits to main branch
- Before deployment

Failed tests will block deployment to ensure quality.

## Troubleshooting

### Tests Not Running
- Check Node.js version (v18+ required)
- Run `npm install` to ensure dependencies are installed
- Clear test cache: `npm test -- --clearCache`

### Mock Issues
- Ensure `vi.mock('@/integrations/supabase/client')` is at the top
- Clear mocks in `beforeEach` hooks
- Check mock implementation matches actual API

### Coverage Issues
- Run with `--coverage` flag to see detailed report
- Focus on critical business logic first
- UI components may have lower coverage (expected)

## Best Practices

1. **Test behavior, not implementation** - Focus on what the code does, not how
2. **Keep tests isolated** - Each test should work independently
3. **Use meaningful assertions** - Test specific values, not just "truthy"
4. **Test edge cases** - Empty data, null values, errors
5. **Keep tests fast** - Mock external dependencies
6. **Document complex tests** - Add comments for non-obvious logic

## Security Testing

The role permissions tests validate:
- ✅ Admin cannot modify super_admin roles
- ✅ Cannot remove last super_admin
- ✅ RLS policies block unauthorized access
- ✅ Creators cannot access admin functions
- ✅ Managers can only access assigned creators
- ✅ Anonymous users blocked from sensitive data

These security tests are critical and should never be removed or disabled.
