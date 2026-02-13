import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../App';

// Mock the task service
jest.mock('../services/taskService', () => ({
  getAllTasks: jest.fn(),
  createTask: jest.fn(),
  updateTask: jest.fn(),
  toggleTaskComplete: jest.fn(),
  deleteTask: jest.fn()
}));

import * as taskService from '../services/taskService';

const mockTasks = [
  {
    id: 1,
    title: 'Test Task 1',
    description: 'Task 1 description',
    completed: false,
    priority: 'high',
    due_date: '2026-12-31',
    created_at: '2026-02-13T00:00:00.000Z'
  },
  {
    id: 2,
    title: 'Test Task 2',
    description: 'Task 2 description',
    completed: true,
    priority: 'medium',
    due_date: '2026-03-15',
    created_at: '2026-02-13T00:00:00.000Z'
  }
];

describe('App', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    taskService.getAllTasks.mockResolvedValue(mockTasks);
  });

  test('renders app header', async () => {
    render(<App />);
    
    expect(screen.getByText('📝 Todo App')).toBeInTheDocument();
    expect(screen.getByText('Organize your tasks efficiently')).toBeInTheDocument();
  });

  test('loads and displays tasks on mount', async () => {
    render(<App />);

    await waitFor(() => {
      expect(taskService.getAllTasks).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(screen.getByText('Test Task 1')).toBeInTheDocument();
      expect(screen.getByText('Test Task 2')).toBeInTheDocument();
    });
  });

  test('shows loading spinner while fetching tasks', () => {
    render(<App />);
    
    expect(screen.getByText('Loading tasks...')).toBeInTheDocument();
  });

  test('displays error message when fetch fails', async () => {
    taskService.getAllTasks.mockRejectedValue(new Error('Network error'));
    
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(/Failed to load tasks/)).toBeInTheDocument();
    });
  });

  test('shows add task form when add button is clicked', async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Test Task 1')).toBeInTheDocument();
    });

    const addButton = screen.getByText('+ Add New Task');
    fireEvent.click(addButton);

    expect(screen.getByText('Add New Task')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter task title')).toBeInTheDocument();
  });

  test('creates a new task when form is submitted', async () => {
    const newTask = {
      id: 3,
      title: 'New Task',
      description: 'New description',
      completed: false,
      priority: 'low',
      due_date: '2026-12-25'
    };

    taskService.createTask.mockResolvedValue(newTask);

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Test Task 1')).toBeInTheDocument();
    });

    const addButton = screen.getByText('+ Add New Task');
    fireEvent.click(addButton);

    const titleInput = screen.getByPlaceholderText('Enter task title');
    fireEvent.change(titleInput, { target: { value: 'New Task' } });

    const submitButton = screen.getByText('Add Task');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(taskService.createTask).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'New Task'
        })
      );
    });
  });

  test('filters tasks by status', async () => {
    const activeTasks = [mockTasks[0]];
    taskService.getAllTasks.mockResolvedValue(activeTasks);

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Test Task 1')).toBeInTheDocument();
    });

    const statusFilter = screen.getByLabelText('Status:');
    fireEvent.change(statusFilter, { target: { value: 'active' } });

    await waitFor(() => {
      expect(taskService.getAllTasks).toHaveBeenCalledWith(
        expect.objectContaining({ status: 'active' })
      );
    });
  });

  test('toggles task completion status', async () => {
    const updatedTask = { ...mockTasks[0], completed: true };
    taskService.toggleTaskComplete.mockResolvedValue(updatedTask);

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Test Task 1')).toBeInTheDocument();
    });

    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[0]);

    await waitFor(() => {
      expect(taskService.toggleTaskComplete).toHaveBeenCalledWith(1);
    });
  });

  test('deletes a task when delete button is clicked', async () => {
    global.confirm = jest.fn(() => true);
    taskService.deleteTask.mockResolvedValue({ message: 'Task deleted' });

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Test Task 1')).toBeInTheDocument();
    });

    const deleteButtons = screen.getAllByLabelText(/Delete task/);
    fireEvent.click(deleteButtons[0]);

    await waitFor(() => {
      expect(taskService.deleteTask).toHaveBeenCalledWith(1);
    });
  });
});