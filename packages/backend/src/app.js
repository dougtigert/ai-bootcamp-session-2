const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const Database = require('better-sqlite3');

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Initialize in-memory SQLite database
const db = new Database(':memory:');

// Create tasks table with enhanced schema
db.exec(`
  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    completed BOOLEAN DEFAULT 0,
    priority TEXT CHECK(priority IN ('low', 'medium', 'high')) DEFAULT 'medium',
    due_date TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`);

// Insert some initial sample tasks
const initialTasks = [
  { title: 'Complete project documentation', description: 'Write comprehensive docs', priority: 'high', due_date: '2026-02-20' },
  { title: 'Review pull requests', description: 'Check team PRs', priority: 'medium', due_date: '2026-02-15' },
  { title: 'Update dependencies', description: 'Run npm audit fix', priority: 'low', due_date: '2026-02-28' }
];

const insertStmt = db.prepare(`
  INSERT INTO tasks (title, description, priority, due_date) 
  VALUES (?, ?, ?, ?)
`);

initialTasks.forEach(task => {
  insertStmt.run(task.title, task.description, task.priority, task.due_date);
});

console.log('In-memory database initialized with sample tasks');

// Validation helper functions
const validateTask = (task) => {
  const errors = [];

  if (!task.title || typeof task.title !== 'string' || task.title.trim() === '') {
    errors.push('Title is required');
  } else if (task.title.length > 200) {
    errors.push('Title must be 200 characters or less');
  }

  if (task.description && task.description.length > 1000) {
    errors.push('Description must be 1000 characters or less');
  }

  if (task.priority && !['low', 'medium', 'high'].includes(task.priority)) {
    errors.push('Priority must be low, medium, or high');
  }

  if (task.due_date) {
    const dueDate = new Date(task.due_date);
    if (isNaN(dueDate.getTime())) {
      errors.push('Due date must be a valid date');
    }
  }

  return errors;
};

// API Routes

// GET /api/tasks - List all tasks with optional filtering
app.get('/api/tasks', (req, res) => {
  try {
    const { status, priority } = req.query;
    let query = 'SELECT * FROM tasks WHERE 1=1';
    const params = [];

    if (status === 'active') {
      query += ' AND completed = 0';
    } else if (status === 'completed') {
      query += ' AND completed = 1';
    }

    if (priority && ['low', 'medium', 'high'].includes(priority)) {
      query += ' AND priority = ?';
      params.push(priority);
    }

    query += ' ORDER BY created_at DESC';

    const tasks = db.prepare(query).all(...params);
    
    // Convert boolean values for JSON
    const formattedTasks = tasks.map(task => ({
      ...task,
      completed: Boolean(task.completed)
    }));
    
    res.json(formattedTasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// GET /api/tasks/:id - Get a single task
app.get('/api/tasks/:id', (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({ error: 'Valid task ID is required' });
    }

    const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
    
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json({
      ...task,
      completed: Boolean(task.completed)
    });
  } catch (error) {
    console.error('Error fetching task:', error);
    res.status(500).json({ error: 'Failed to fetch task' });
  }
});

// POST /api/tasks - Create a new task
app.post('/api/tasks', (req, res) => {
  try {
    const { title, description, priority = 'medium', due_date } = req.body;

    const validationErrors = validateTask(req.body);
    if (validationErrors.length > 0) {
      return res.status(400).json({ error: validationErrors.join(', ') });
    }

    const stmt = db.prepare(`
      INSERT INTO tasks (title, description, priority, due_date) 
      VALUES (?, ?, ?, ?)
    `);
    
    const result = stmt.run(
      title.trim(),
      description ? description.trim() : null,
      priority,
      due_date || null
    );
    
    const id = result.lastInsertRowid;
    const newTask = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
    
    res.status(201).json({
      ...newTask,
      completed: Boolean(newTask.completed)
    });
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ error: 'Failed to create task' });
  }
});

// PUT /api/tasks/:id - Update a task
app.put('/api/tasks/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, priority, due_date, completed } = req.body;

    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({ error: 'Valid task ID is required' });
    }

    const existingTask = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
    if (!existingTask) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const validationErrors = validateTask(req.body);
    if (validationErrors.length > 0) {
      return res.status(400).json({ error: validationErrors.join(', ') });
    }

    const stmt = db.prepare(`
      UPDATE tasks 
      SET title = ?, description = ?, priority = ?, due_date = ?, completed = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);

    stmt.run(
      title.trim(),
      description ? description.trim() : null,
      priority || 'medium',
      due_date || null,
      completed ? 1 : 0,
      id
    );

    const updatedTask = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
    
    res.json({
      ...updatedTask,
      completed: Boolean(updatedTask.completed)
    });
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ error: 'Failed to update task' });
  }
});

// PATCH /api/tasks/:id/complete - Toggle task completion status
app.patch('/api/tasks/:id/complete', (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({ error: 'Valid task ID is required' });
    }

    const existingTask = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
    if (!existingTask) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const newCompletedStatus = existingTask.completed ? 0 : 1;
    
    const stmt = db.prepare(`
      UPDATE tasks 
      SET completed = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);

    stmt.run(newCompletedStatus, id);

    const updatedTask = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
    
    res.json({
      ...updatedTask,
      completed: Boolean(updatedTask.completed)
    });
  } catch (error) {
    console.error('Error toggling task completion:', error);
    res.status(500).json({ error: 'Failed to toggle task completion' });
  }
});

// DELETE /api/tasks/:id - Delete a task
app.delete('/api/tasks/:id', (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({ error: 'Valid task ID is required' });
    }

    const existingTask = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
    if (!existingTask) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const deleteStmt = db.prepare('DELETE FROM tasks WHERE id = ?');
    const result = deleteStmt.run(id);

    if (result.changes > 0) {
      res.json({ message: 'Task deleted successfully', id: parseInt(id) });
    } else {
      res.status(404).json({ error: 'Task not found' });
    }
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

module.exports = { app, db };