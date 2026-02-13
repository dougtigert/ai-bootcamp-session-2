# Coding Guidelines

## Overview

This document outlines the coding standards and quality principles for the TODO application. Following these guidelines ensures consistency, maintainability, and high code quality across the entire codebase.

## Philosophy

Our coding philosophy centers on three core values:

1. **Clarity over Cleverness** - Write code that is easy to understand, even if it means being more verbose
2. **Consistency over Preference** - Follow established patterns even if you prefer a different approach
3. **Maintainability over Speed** - Optimize for long-term maintenance rather than short-term development speed

Code is read far more often than it is written. Every line of code should communicate its intent clearly to future developers—including your future self.

## Code Formatting

### General Principles

Consistent formatting makes code easier to read and reduces cognitive load. We follow these general principles:

- **Use 2 spaces for indentation** - Never use tabs
- **Maximum line length of 100 characters** - Break longer lines for readability
- **Use consistent spacing** - Add space around operators and after commas
- **End files with a newline** - Ensures compatibility across systems
- **No trailing whitespace** - Clean up extra spaces at line ends

### File Organization

Structure files in a consistent, logical order:

```javascript
// 1. Imports (external dependencies first, then internal)
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { TaskService } from '../services/TaskService';
import { formatDate } from '../utils/dateFormatter';
import './TaskList.css';

// 2. Constants and configuration
const MAX_TASKS_PER_PAGE = 20;
const DEFAULT_PRIORITY = 'medium';

// 3. Helper functions (if small and file-specific)
const sortByDueDate = (a, b) => new Date(a.dueDate) - new Date(b.dueDate);

// 4. Main component or module logic
const TaskList = ({ userId }) => {
  // Component implementation
};

// 5. PropTypes or type definitions
TaskList.propTypes = {
  userId: PropTypes.string.isRequired
};

// 6. Export statements
export default TaskList;
```

### Naming Conventions

Use descriptive, meaningful names that convey purpose:

**Files and Directories**:
- React components: `PascalCase.js` (e.g., `TaskList.js`, `TaskItem.js`)
- Utilities and helpers: `camelCase.js` (e.g., `dateFormatter.js`, `validation.js`)
- Test files: Match source file with `.test.js` suffix (e.g., `TaskList.test.js`)
- Stylesheets: Match component name (e.g., `TaskList.css`)

**Variables and Functions**:
- Variables: `camelCase` (e.g., `taskList`, `userInput`, `isCompleted`)
- Functions: `camelCase` with verb prefix (e.g., `getTasks`, `handleSubmit`, `validateInput`)
- Boolean variables: Use is/has/can prefix (e.g., `isLoading`, `hasError`, `canEdit`)
- Constants: `UPPER_SNAKE_CASE` (e.g., `API_BASE_URL`, `MAX_RETRIES`)

**React Components**:
- Component names: `PascalCase` (e.g., `TaskForm`, `DatePicker`)
- Component files: Match component name exactly
- Props: `camelCase` (e.g., `onTaskComplete`, `taskList`)
- Event handlers: `handle` prefix (e.g., `handleClick`, `handleSubmit`)

**Functions and Methods**:
- Action functions: Start with verbs (e.g., `createTask`, `deleteTask`, `updateTask`)
- Query functions: Use descriptive names (e.g., `getAllTasks`, `findTaskById`)
- Validation functions: `validate` prefix (e.g., `validateEmail`, `validateTaskData`)

### Code Style Examples

**Good**:
```javascript
// Clear, descriptive names
const isTaskOverdue = (task) => {
  const currentDate = new Date();
  const dueDate = new Date(task.dueDate);
  return dueDate < currentDate && !task.completed;
};

// Proper spacing and formatting
const TaskItem = ({ task, onComplete, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  
  const handleComplete = () => {
    onComplete(task.id);
  };
  
  return (
    <div className="task-item">
      <h3>{task.title}</h3>
    </div>
  );
};
```

**Avoid**:
```javascript
// Poor names, unclear intent
const x = (t) => {
  const c = new Date();
  const d = new Date(t.dueDate);
  return d < c && !t.completed;
};

// Inconsistent spacing
const TaskItem=({task,onComplete,onDelete})=>{
  const [isEditing,setIsEditing]=useState(false);
  const handleComplete=()=>{onComplete(task.id);};
  return(<div className="task-item"><h3>{task.title}</h3></div>);
};
```

## Import Organization

Organize imports in a consistent order for better readability:

### Import Order

```javascript
// 1. External libraries (alphabetically)
import express from 'express';
import React from 'react';

// 2. React hooks and utilities (if separate from main React import)
import { useState, useEffect, useCallback } from 'react';

// 3. Third-party UI libraries
import { Button, TextField } from '@material-ui/core';

// 4. Internal services and API clients
import { TaskService } from '../services/TaskService';
import { apiClient } from '../api/client';

// 5. Internal utilities and helpers
import { formatDate, parseDate } from '../utils/dateFormatter';
import { validateTask } from '../utils/validation';

// 6. Internal components (if importing from other components)
import { Button } from '../components/Button';
import { Modal } from '../components/Modal';

// 7. Type definitions (TypeScript, or PropTypes)
import PropTypes from 'prop-types';

// 8. Styles
import './TaskList.css';
```

### Import Best Practices

- **Group by category** - Separate external from internal imports with blank lines
- **Use absolute imports** - For shared utilities (configure path aliases)
- **Use relative imports** - For nearby files in the same feature
- **Import only what you need** - Use named imports when possible
- **Avoid wildcard imports** - `import * as` makes dependencies unclear
- **Remove unused imports** - Clean up imports regularly

## Linter Configuration

### ESLint Setup

We use ESLint to enforce code quality and consistency. All code must pass linting before being committed.

**Configuration** (`.eslintrc.js`):
```javascript
module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended'
  ],
  rules: {
    'indent': ['error', 2],
    'quotes': ['error', 'single'],
    'semi': ['error', 'always'],
    'no-unused-vars': ['warn'],
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'react/prop-types': ['warn']
  }
};
```

### Prettier Integration

Use Prettier for automatic code formatting:

**Configuration** (`.prettierrc`):
```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100,
  "arrowParens": "always"
}
```

### Running Linters

```bash
# Lint all files
npm run lint

# Fix auto-fixable issues
npm run lint:fix

# Format all files with Prettier
npm run format

# Check formatting without modifying files
npm run format:check
```

**Pre-commit Hooks**: Configure Git hooks to run linters automatically before commits to catch issues early.

## Code Quality Principles

### DRY (Don't Repeat Yourself)

Avoid code duplication by extracting common logic into reusable functions or components.

**Before (Repetitive)**:
```javascript
const TaskList = () => {
  const formatTaskDate = (date) => {
    const d = new Date(date);
    return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
  };
  
  return (
    <div>
      <p>Due: {formatTaskDate(task1.dueDate)}</p>
      <p>Due: {formatTaskDate(task2.dueDate)}</p>
    </div>
  );
};

const TaskForm = () => {
  const formatTaskDate = (date) => {
    const d = new Date(date);
    return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
  };
  // ...
};
```

**After (DRY)**:
```javascript
// utils/dateFormatter.js
export const formatDate = (date) => {
  const d = new Date(date);
  return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
};

// TaskList.js
import { formatDate } from '../utils/dateFormatter';

const TaskList = () => {
  return (
    <div>
      <p>Due: {formatDate(task1.dueDate)}</p>
      <p>Due: {formatDate(task2.dueDate)}</p>
    </div>
  );
};
```

### SOLID Principles

Apply SOLID principles for maintainable, flexible code:

**Single Responsibility Principle**: Each function or component should have one clear purpose.

```javascript
// Good - Each function has a single responsibility
const validateTaskTitle = (title) => title.trim().length > 0;
const validateDueDate = (date) => new Date(date) > new Date();
const validateTask = (task) => {
  return validateTaskTitle(task.title) && validateDueDate(task.dueDate);
};

// Avoid - Function doing too many things
const saveTask = (task) => {
  // Validates
  if (!task.title) return false;
  // Formats
  task.title = task.title.trim();
  // Saves to API
  fetch('/api/tasks', { method: 'POST', body: JSON.stringify(task) });
  // Updates UI
  updateTaskList();
};
```

**Open/Closed Principle**: Code should be open for extension but closed for modification.

```javascript
// Good - Easy to extend with new task types
const taskRenderers = {
  default: (task) => <TaskItem task={task} />,
  urgent: (task) => <UrgentTaskItem task={task} />,
  recurring: (task) => <RecurringTaskItem task={task} />
};

const renderTask = (task) => {
  const renderer = taskRenderers[task.type] || taskRenderers.default;
  return renderer(task);
};
```

### KISS (Keep It Simple, Stupid)

Write simple, straightforward code. Complex solutions should only be used when simpler ones won't work.

```javascript
// Good - Simple and clear
const isTaskComplete = (task) => task.completed === true;

// Avoid - Unnecessarily complex
const isTaskComplete = (task) => {
  return task ? (task.completed !== undefined ? 
    (task.completed === true ? true : false) : false) : false;
};
```

### YAGNI (You Aren't Gonna Need It)

Don't add functionality until it's needed. Avoid over-engineering.

```javascript
// Good - Implements only what's needed now
const createTask = (title, dueDate) => {
  return { id: generateId(), title, dueDate, completed: false };
};

// Avoid - Adding unnecessary complexity for future "maybe" features
const createTask = (title, dueDate, options = {}) => {
  const task = { 
    id: generateId(), 
    title, 
    dueDate, 
    completed: false,
    priority: options.priority || 'medium',
    tags: options.tags || [],
    assignees: options.assignees || [],
    subtasks: options.subtasks || [],
    attachments: options.attachments || [],
    customFields: options.customFields || {}
  };
  return task;
};
```

### Composition Over Inheritance

Favor composition and hooks over class inheritance in React.

```javascript
// Good - Composition with hooks
const useTaskManager = () => {
  const [tasks, setTasks] = useState([]);
  const addTask = (task) => setTasks([...tasks, task]);
  const removeTask = (id) => setTasks(tasks.filter(t => t.id !== id));
  return { tasks, addTask, removeTask };
};

const TaskList = () => {
  const { tasks, addTask, removeTask } = useTaskManager();
  // Use the composed functionality
};
```

## Function Best Practices

### Function Length

Keep functions short and focused:
- **Ideal**: 5-15 lines
- **Maximum**: 50 lines
- If longer, break into smaller functions

### Function Parameters

- **Limit parameters**: Maximum 3-4 parameters
- **Use object parameters** for more than 3 arguments
- **Provide defaults** for optional parameters
- **Validate inputs** at function boundaries

```javascript
// Good - Object parameter with defaults
const createTask = ({ 
  title, 
  dueDate, 
  priority = 'medium',
  tags = [] 
}) => {
  if (!title) throw new Error('Title is required');
  return { title, dueDate, priority, tags };
};

// Avoid - Too many parameters
const createTask = (title, dueDate, priority, tags, assignee, notes, color) => {
  // Implementation
};
```

### Pure Functions

Prefer pure functions that don't modify inputs or have side effects:

```javascript
// Good - Pure function
const completeTask = (task) => {
  return { ...task, completed: true };
};

// Avoid - Mutating input
const completeTask = (task) => {
  task.completed = true;
  return task;
};
```

## Error Handling

### Consistent Error Handling

Use try-catch blocks for async operations and provide meaningful error messages:

```javascript
// Good
const fetchTasks = async () => {
  try {
    const response = await fetch('/api/tasks');
    if (!response.ok) {
      throw new Error(`Failed to fetch tasks: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching tasks:', error);
    throw error; // Re-throw for caller to handle
  }
};

// Avoid - Silent failures
const fetchTasks = async () => {
  const response = await fetch('/api/tasks');
  return await response.json();
};
```

### Error Boundaries (React)

Use Error Boundaries to catch rendering errors in React components:

```javascript
class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };
  
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  
  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }
  
  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} />;
    }
    return this.props.children;
  }
}
```

## Comments and Documentation

### When to Comment

- **Why, not what**: Explain the reasoning behind non-obvious decisions
- **Complex algorithms**: Document the approach and any trade-offs
- **Workarounds**: Explain why a workaround is necessary
- **TODOs**: Mark future improvements (include ticket number if applicable)

### Comment Style

```javascript
// Good - Explains WHY
// Using setTimeout to debounce rapid API calls and reduce server load
const debouncedSearch = debounce(searchTasks, 300);

// Avoid - States the obvious
// This function adds two numbers
const add = (a, b) => a + b;
```

### JSDoc for Public APIs

Use JSDoc for functions that are part of the public API:

```javascript
/**
 * Creates a new task with the provided details.
 * 
 * @param {Object} taskData - The task data
 * @param {string} taskData.title - The task title
 * @param {string} taskData.dueDate - The due date in ISO format
 * @param {string} [taskData.priority='medium'] - The task priority
 * @returns {Promise<Object>} The created task with generated ID
 * @throws {Error} If title is empty or dueDate is invalid
 */
const createTask = async (taskData) => {
  // Implementation
};
```

## React-Specific Guidelines

### Component Structure

```javascript
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const TaskItem = ({ task, onComplete, onDelete }) => {
  // 1. Hooks (in consistent order)
  const [isEditing, setIsEditing] = useState(false);
  const [localTitle, setLocalTitle] = useState(task.title);
  
  // 2. Effects
  useEffect(() => {
    setLocalTitle(task.title);
  }, [task.title]);
  
  // 3. Event handlers
  const handleEdit = () => setIsEditing(true);
  const handleSave = () => {
    onComplete(task.id, localTitle);
    setIsEditing(false);
  };
  
  // 4. Render helpers (if needed)
  const renderEditMode = () => (
    <input value={localTitle} onChange={(e) => setLocalTitle(e.target.value)} />
  );
  
  // 5. Main render
  return (
    <div className="task-item">
      {isEditing ? renderEditMode() : <h3>{task.title}</h3>}
    </div>
  );
};

// 6. PropTypes
TaskItem.propTypes = {
  task: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired
  }).isRequired,
  onComplete: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired
};

export default TaskItem;
```

### Hooks Guidelines

- **Use hooks at the top level** - Never inside conditions or loops
- **Custom hooks prefix** - Always start with "use" (e.g., `useTaskManager`)
- **Extract reusable logic** - Create custom hooks for shared functionality
- **Dependencies matter** - Always include all dependencies in useEffect/useCallback arrays

## Performance Considerations

### React Optimization

- **Avoid inline functions** in props (use useCallback for handlers)
- **Memoize expensive calculations** with useMemo
- **Use React.memo** for components that render often with same props
- **Lazy load components** with React.lazy for code splitting

```javascript
// Good - Memoized handler
const TaskList = ({ tasks }) => {
  const handleTaskComplete = useCallback((taskId) => {
    // Handler logic
  }, [/* dependencies */]);
  
  return tasks.map((task) => (
    <TaskItem key={task.id} task={task} onComplete={handleTaskComplete} />
  ));
};
```

## Version Control

### Commit Messages

Follow conventional commit format:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types**: feat, fix, docs, style, refactor, test, chore

**Examples**:
```
feat(tasks): add due date filtering
fix(api): handle null task description
docs(readme): update installation instructions
```

### Branch Naming

- Feature branches: `feature/description` (e.g., `feature/task-filtering`)
- Bug fixes: `fix/description` (e.g., `fix/date-validation`)
- Hotfixes: `hotfix/description` (e.g., `hotfix/api-crash`)

## Resources

- [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)
- [Google JavaScript Style Guide](https://google.github.io/styleguide/jsguide.html)
- [Clean Code JavaScript](https://github.com/ryanmcdermott/clean-code-javascript)
- [React Best Practices](https://react.dev/learn/thinking-in-react)

## Continuous Improvement

These guidelines are living documents that evolve with the project. Team members are encouraged to:
- Suggest improvements through pull requests
- Question guidelines that don't serve the project
- Share learnings from production issues
- Update guidelines as technology and best practices evolve

Remember: Guidelines exist to help us write better code, not to be followed blindly. Use judgment and discuss exceptions with the team when appropriate.
