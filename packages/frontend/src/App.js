import React, { useState, useEffect, useCallback } from 'react';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import TaskFilter from './components/TaskFilter';
import LoadingSpinner from './components/LoadingSpinner';
import {
  getAllTasks,
  createTask,
  updateTask,
  toggleTaskComplete,
  deleteTask
} from './services/taskService';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingTask, setEditingTask] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [filters, setFilters] = useState({
    status: 'all',
    priority: 'all'
  });

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedTasks = await getAllTasks(filters);
      setTasks(fetchedTasks);
    } catch (err) {
      setError('Failed to load tasks. Please try again.');
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleCreateTask = async (taskData) => {
    try {
      const newTask = await createTask(taskData);
      setTasks(prevTasks => [newTask, ...prevTasks]);
      setShowForm(false);
      setError(null);
    } catch (err) {
      throw new Error(err.message || 'Failed to create task');
    }
  };

  const handleUpdateTask = async (taskData) => {
    try {
      const updatedTask = await updateTask(editingTask.id, {
        ...taskData,
        completed: editingTask.completed
      });
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task.id === editingTask.id ? updatedTask : task
        )
      );
      setEditingTask(null);
      setError(null);
    } catch (err) {
      throw new Error(err.message || 'Failed to update task');
    }
  };

  const handleToggleComplete = async (taskId) => {
    try {
      const updatedTask = await toggleTaskComplete(taskId);
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task.id === taskId ? updatedTask : task
        )
      );
      setError(null);
    } catch (err) {
      setError('Failed to update task status');
      console.error('Error toggling task:', err);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await deleteTask(taskId);
      setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
      setError(null);
    } catch (err) {
      setError('Failed to delete task');
      console.error('Error deleting task:', err);
    }
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setShowForm(false);
  };

  const handleCancelEdit = () => {
    setEditingTask(null);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>📝 Todo App</h1>
        <p>Organize your tasks efficiently</p>
      </header>

      <main className="App-main">
        {error && (
          <div className="error-banner">
            <span className="error-icon">⚠️</span>
            {error}
            <button
              className="error-close"
              onClick={() => setError(null)}
              aria-label="Dismiss error"
            >
              ✕
            </button>
          </div>
        )}

        <div className="content-wrapper">
          {!editingTask && !showForm && (
            <button
              className="btn btn-primary btn-add-task"
              onClick={() => setShowForm(true)}
            >
              + Add New Task
            </button>
          )}

          {showForm && !editingTask && (
            <TaskForm
              onSubmit={handleCreateTask}
              onCancel={() => setShowForm(false)}
            />
          )}

          {editingTask && (
            <TaskForm
              onSubmit={handleUpdateTask}
              onCancel={handleCancelEdit}
              initialData={editingTask}
              isEditing={true}
            />
          )}

          <TaskFilter
            filters={filters}
            onFilterChange={handleFilterChange}
          />

          {loading ? (
            <LoadingSpinner size="large" />
          ) : (
            <TaskList
              tasks={tasks}
              onToggleComplete={handleToggleComplete}
              onEdit={handleEditTask}
              onDelete={handleDeleteTask}
              isLoading={loading}
            />
          )}
        </div>
      </main>
    </div>
  );
}

export default App;