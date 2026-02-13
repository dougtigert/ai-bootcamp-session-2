/**
 * Task Service
 * Centralized API communication layer for task operations
 */

const API_BASE_URL = '/api/tasks';

/**
 * Fetches all tasks with optional filters
 * @param {Object} filters - Optional filter parameters
 * @param {string} filters.status - Filter by status (all, active, completed)
 * @param {string} filters.priority - Filter by priority (low, medium, high)
 * @returns {Promise<Array>} Array of tasks
 */
export const getAllTasks = async (filters = {}) => {
  try {
    const queryParams = new URLSearchParams();
    
    if (filters.status && filters.status !== 'all') {
      queryParams.append('status', filters.status);
    }
    
    if (filters.priority && filters.priority !== 'all') {
      queryParams.append('priority', filters.priority);
    }

    const url = queryParams.toString() 
      ? `${API_BASE_URL}?${queryParams.toString()}` 
      : API_BASE_URL;

    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch tasks: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching tasks:', error);
    throw error;
  }
};

/**
 * Fetches a single task by ID
 * @param {number} taskId - The task ID
 * @returns {Promise<Object>} Task object
 */
export const getTaskById = async (taskId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${taskId}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Task not found');
      }
      throw new Error(`Failed to fetch task: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching task:', error);
    throw error;
  }
};

/**
 * Creates a new task
 * @param {Object} taskData - Task data
 * @param {string} taskData.title - Task title (required)
 * @param {string} [taskData.description] - Task description
 * @param {string} [taskData.priority] - Priority (low, medium, high)
 * @param {string} [taskData.due_date] - Due date in YYYY-MM-DD format
 * @returns {Promise<Object>} Created task object
 */
export const createTask = async (taskData) => {
  try {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(taskData),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to create task');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error creating task:', error);
    throw error;
  }
};

/**
 * Updates an existing task
 * @param {number} taskId - The task ID
 * @param {Object} taskData - Updated task data
 * @returns {Promise<Object>} Updated task object
 */
export const updateTask = async (taskId, taskData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${taskId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(taskData),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to update task');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error updating task:', error);
    throw error;
  }
};

/**
 * Toggles the completion status of a task
 * @param {number} taskId - The task ID
 * @returns {Promise<Object>} Updated task object
 */
export const toggleTaskComplete = async (taskId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${taskId}/complete`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to toggle task completion');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error toggling task completion:', error);
    throw error;
  }
};

/**
 * Deletes a task
 * @param {number} taskId - The task ID
 * @returns {Promise<Object>} Deletion confirmation
 */
export const deleteTask = async (taskId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${taskId}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to delete task');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error deleting task:', error);
    throw error;
  }
};
