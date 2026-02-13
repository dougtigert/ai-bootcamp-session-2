/**
 * Validation Utilities
 */

/**
 * Validates a task title
 * @param {string} title - Task title
 * @returns {string|null} Error message or null if valid
 */
export const validateTitle = (title) => {
  if (!title || typeof title !== 'string') {
    return 'Title is required';
  }
  
  const trimmedTitle = title.trim();
  
  if (trimmedTitle.length === 0) {
    return 'Title cannot be empty';
  }
  
  if (trimmedTitle.length > 200) {
    return 'Title must be 200 characters or less';
  }
  
  return null;
};

/**
 * Validates a task description
 * @param {string} description - Task description
 * @returns {string|null} Error message or null if valid
 */
export const validateDescription = (description) => {
  if (!description) return null; // Description is optional
  
  if (typeof description !== 'string') {
    return 'Description must be text';
  }
  
  if (description.length > 1000) {
    return 'Description must be 1000 characters or less';
  }
  
  return null;
};

/**
 * Validates a priority value
 * @param {string} priority - Priority value
 * @returns {string|null} Error message or null if valid
 */
export const validatePriority = (priority) => {
  const validPriorities = ['low', 'medium', 'high'];
  
  if (!priority) return null; // Use default if not provided
  
  if (!validPriorities.includes(priority)) {
    return 'Priority must be low, medium, or high';
  }
  
  return null;
};

/**
 * Validates a due date
 * @param {string} dueDate - Due date string
 * @param {boolean} allowPast - Whether to allow past dates
 * @returns {string|null} Error message or null if valid
 */
export const validateDueDate = (dueDate, allowPast = true) => {
  if (!dueDate) return null; // Due date is optional
  
  const date = new Date(dueDate);
  
  if (isNaN(date.getTime())) {
    return 'Due date must be a valid date';
  }
  
  if (!allowPast) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);
    
    if (targetDate < today) {
      return 'Due date cannot be in the past';
    }
  }
  
  return null;
};

/**
 * Validates all task fields
 * @param {Object} taskData - Task data object
 * @param {boolean} allowPastDates - Whether to allow past dates
 * @returns {Object} Object with validation errors
 */
export const validateTask = (taskData, allowPastDates = true) => {
  const errors = {};
  
  const titleError = validateTitle(taskData.title);
  if (titleError) errors.title = titleError;
  
  const descriptionError = validateDescription(taskData.description);
  if (descriptionError) errors.description = descriptionError;
  
  const priorityError = validatePriority(taskData.priority);
  if (priorityError) errors.priority = priorityError;
  
  const dueDateError = validateDueDate(taskData.due_date, allowPastDates);
  if (dueDateError) errors.due_date = dueDateError;
  
  return errors;
};

/**
 * Checks if a validation errors object has any errors
 * @param {Object} errors - Validation errors object
 * @returns {boolean} True if there are errors
 */
export const hasErrors = (errors) => {
  return Object.keys(errors).length > 0;
};
