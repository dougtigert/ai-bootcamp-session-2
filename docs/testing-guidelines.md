# Testing Guidelines

## Overview

This document outlines the testing strategy and principles for the TODO application. These guidelines ensure code quality, reliability, and maintainability across all features.

## Testing Philosophy

### Core Principles

1. **Test Early and Often** - Write tests alongside feature development, not as an afterthought
2. **Maintainability First** - Tests should be easy to read, understand, and modify
3. **Appropriate Coverage** - Focus on meaningful coverage rather than achieving arbitrary percentages
4. **Fast Feedback** - Tests should run quickly to support rapid development cycles
5. **Realistic Scenarios** - Test real-world use cases that users will encounter

### Testing Pyramid

Follow the testing pyramid approach to balance test types:

```
        /\
       /E2E\      ← Few comprehensive end-to-end tests
      /------\
     /  INT   \   ← Moderate number of integration tests
    /----------\
   /   UNIT     \ ← Many focused unit tests
  /--------------\
```

## Test Types

### Unit Tests

**Purpose**: Test individual functions, components, or modules in isolation

**Characteristics**:
- Fast execution (milliseconds per test)
- No external dependencies (databases, APIs, file systems)
- Single responsibility - test one thing at a time
- Use mocks/stubs for dependencies

**Coverage Requirements**:
- All utility functions and helpers
- Business logic and data transformations
- Individual React components (rendering, state, props)
- API endpoint handlers
- Input validation functions

**Example Scenarios**:
- A function that formats dates displays correctly
- A React component renders with given props
- A validation function rejects invalid input
- A calculation function returns correct results

### Integration Tests

**Purpose**: Test how multiple units work together

**Characteristics**:
- Moderate execution speed (seconds per test)
- Tests interactions between modules
- May use real dependencies (test databases, etc.)
- Verify data flow between components

**Coverage Requirements**:
- API endpoint interactions with database
- React components with state management (Context, Redux)
- Form submissions with validation
- Multi-step workflows
- Component hierarchies

**Example Scenarios**:
- Creating a task via API stores it in the database
- Submitting a form updates the UI correctly
- Filtering tasks updates the displayed list
- User authentication flow works end-to-end

### End-to-End (E2E) Tests

**Purpose**: Test complete user workflows in a production-like environment

**Characteristics**:
- Slower execution (seconds to minutes per test)
- Tests from the user's perspective
- Uses real or staging environments
- Validates entire application stack

**Coverage Requirements**:
- Critical user journeys
- Common user workflows
- Cross-browser compatibility
- Mobile responsiveness

**Example Scenarios**:
- User can add, edit, and delete tasks
- User can mark tasks as complete
- User can filter and search tasks
- User can set due dates and priorities
- Application works on mobile devices

## Testing Requirements

### For All New Features

Every new feature must include:

1. **Unit Tests** for individual components and functions
2. **Integration Tests** for component interactions
3. **E2E Tests** for critical user paths (if applicable)

### For Bug Fixes

Every bug fix should:

1. Include a test that reproduces the bug
2. Verify the test fails before the fix
3. Verify the test passes after the fix
4. Prevent regression of the same issue

### Code Coverage Goals

- **Overall Coverage**: Minimum 80%
- **Critical Paths**: Minimum 95%
- **Utility Functions**: 100%
- **New Code**: Minimum 85%

Note: Coverage is a metric, not a goal. Focus on meaningful tests rather than arbitrary numbers.

## Testing Framework Setup

### Frontend (React)

**Testing Stack**:
- **Jest** - Test runner and assertion library
- **React Testing Library** - Component testing utilities
- **@testing-library/user-event** - User interaction simulation
- **MSW (Mock Service Worker)** - API mocking (future enhancement)

**Configuration**:
- Tests located in `src/__tests__/` or alongside source files as `.test.js`
- Use `setupTests.js` for global test configuration
- Mock external dependencies by default

### Backend (Node.js/Express)

**Testing Stack**:
- **Jest** - Test runner and assertion library
- **Supertest** - HTTP assertion library
- **node-mocks-http** - Mock request/response objects

**Configuration**:
- Tests located in `__tests__/` directory
- Use `beforeAll`/`afterAll` for database setup/teardown
- Mock external services and APIs

## Writing Good Tests

### Test Structure (AAA Pattern)

```javascript
test('should mark task as complete when checkbox is clicked', () => {
  // Arrange - Set up test data and conditions
  const task = { id: 1, title: 'Buy groceries', completed: false };
  
  // Act - Perform the action being tested
  const result = toggleTaskCompletion(task);
  
  // Assert - Verify the expected outcome
  expect(result.completed).toBe(true);
});
```

### Naming Conventions

Use descriptive test names that explain what is being tested and the expected outcome:

**Good Examples**:
- `should render task title and due date`
- `should display error message when title is empty`
- `should filter tasks by status when filter is selected`

**Poor Examples**:
- `test1`
- `it works`
- `should do stuff`

### Test Independence

- Each test should run independently
- Tests should not depend on execution order
- Clean up after each test (reset state, clear mocks)
- Avoid sharing mutable state between tests

### Avoid Test Smells

**Don't**:
- Test implementation details (internal state, private methods)
- Write overly complex tests that need their own tests
- Use hard-coded delays (`setTimeout`)
- Test multiple unrelated things in one test
- Rely on test execution order

**Do**:
- Test behavior and outcomes, not implementation
- Keep tests simple and readable
- Use async utilities (`waitFor`, `findBy`) for async operations
- Focus each test on a single concept
- Make tests independent and isolated

## Mocking Strategy

### When to Mock

**Mock**:
- External APIs and services
- Database connections in unit tests
- Time-dependent functions (Date.now(), setTimeout)
- File system operations
- Network requests

**Don't Mock**:
- The code you're testing
- Simple utilities within your codebase
- Standard library functions
- Test framework utilities

### Mock Examples

**Mocking Functions**:
```javascript
jest.mock('../utils/dateFormatter');
dateFormatter.format.mockReturnValue('2026-02-13');
```

**Mocking Modules**:
```javascript
jest.mock('../services/api', () => ({
  fetchTasks: jest.fn()
}));
```

**Mocking Timers**:
```javascript
jest.useFakeTimers();
jest.advanceTimersByTime(1000);
```

## Running Tests

### Commands

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage

# Run specific test file
npm test -- TaskList.test.js

# Run tests matching pattern
npm test -- --testNamePattern="should render"
```

### Continuous Integration

- All tests must pass before merging
- Run tests on every pull request
- Monitor test coverage trends
- Fail builds if coverage drops below thresholds

## Test Data Management

### Test Data Principles

1. **Use Realistic Data** - Test with data that resembles production
2. **Keep It Minimal** - Use only necessary data for each test
3. **Make It Obvious** - Use descriptive values (e.g., "Test Task 1")
4. **Avoid Magic Values** - Use constants or factories

### Test Factories

Create reusable factories for test data:

```javascript
// taskFactory.js
export const createTask = (overrides = {}) => ({
  id: 1,
  title: 'Test Task',
  description: 'Test Description',
  completed: false,
  dueDate: '2026-12-31',
  priority: 'medium',
  ...overrides
});
```

### Test Fixtures

Use fixtures for complex or repeated test data:

```javascript
// fixtures/tasks.json
{
  "pendingTask": { "id": 1, "title": "Pending", "completed": false },
  "completedTask": { "id": 2, "title": "Done", "completed": true }
}
```

## Debugging Tests

### Strategies

1. **Run Tests Individually** - Isolate failing tests
2. **Use Console Logs** - Add temporary logs to track values
3. **Use Debugger** - Add `debugger` statements and run with Node inspector
4. **Check Test Output** - Read error messages carefully
5. **Simplify Tests** - Reduce complexity to identify issues

### Debugging Commands

```bash
# Run specific test with detailed output
npm test -- --verbose TaskList.test.js

# Debug test in Node inspector
node --inspect-brk node_modules/.bin/jest --runInBand

# Show detailed error output
npm test -- --no-coverage --verbose
```

## Accessibility Testing

### Requirements

- Test keyboard navigation in components
- Verify ARIA labels and roles
- Check color contrast in visual regression tests
- Test with screen reader compatibility in mind

### Tools

- **jest-axe** - Automated accessibility testing
- **@testing-library/jest-dom** - Custom matchers including accessibility checks

## Performance Testing

### Guidelines

- Monitor test execution time
- Optimize slow tests (> 1 second)
- Run performance-critical code through benchmarks
- Test with realistic data volumes

## Future Enhancements

### Planned Additions

- **Visual Regression Testing** - Catch unintended UI changes
- **API Contract Testing** - Verify API compatibility
- **Load Testing** - Test performance under load
- **Security Testing** - Automated security scans
- **Mutation Testing** - Verify test effectiveness

## Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/react)
- [Testing Best Practices](https://testingjavascript.com/)
- [Martin Fowler - Testing Strategies](https://martinfowler.com/testing/)

## Maintenance

These guidelines are living documents and should be:
- Reviewed quarterly
- Updated when new patterns emerge
- Refined based on team feedback
- Evolved as the project grows

Remember: The goal of testing is confidence in your code, not perfect coverage metrics.
