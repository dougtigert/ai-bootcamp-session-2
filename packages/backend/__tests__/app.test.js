const request = require('supertest');
const { app, db } = require('../src/app');

// Close the database connection after all tests
afterAll(() => {
  if (db) {
    db.close();
  }
});

// Test helpers
const createTask = async (taskData = {}) => {
  const defaultTask = {
    title: 'Test Task',
    description: 'Test description',
    priority: 'medium',
    due_date: '2026-12-31'
  };
  
  const response = await request(app)
    .post('/api/tasks')
    .send({ ...defaultTask, ...taskData })
    .set('Accept', 'application/json');

  expect(response.status).toBe(201);
  expect(response.body).toHaveProperty('id');
  return response.body;
};

describe('API Endpoints', () => {
  describe('GET /api/tasks', () => {
    it('should return all tasks', async () => {
      const response = await request(app).get('/api/tasks');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);

      // Check if tasks have the expected structure
      const task = response.body[0];
      expect(task).toHaveProperty('id');
      expect(task).toHaveProperty('title');
      expect(task).toHaveProperty('description');
      expect(task).toHaveProperty('completed');
      expect(task).toHaveProperty('priority');
      expect(task).toHaveProperty('created_at');
    });

    it('should filter tasks by status', async () => {
      const response = await request(app).get('/api/tasks?status=active');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      response.body.forEach(task => {
        expect(task.completed).toBe(false);
      });
    });

    it('should filter tasks by priority', async () => {
      const response = await request(app).get('/api/tasks?priority=high');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      response.body.forEach(task => {
        expect(task.priority).toBe('high');
      });
    });
  });

  describe('GET /api/tasks/:id', () => {
    it('should return a single task', async () => {
      const task = await createTask();
      const response = await request(app).get(`/api/tasks/${task.id}`);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(task.id);
      expect(response.body.title).toBe(task.title);
    });

    it('should return 404 for non-existent task', async () => {
      const response = await request(app).get('/api/tasks/999999');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Task not found');
    });

    it('should return 400 for invalid id', async () => {
      const response = await request(app).get('/api/tasks/abc');

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Valid task ID is required');
    });
  });

  describe('POST /api/tasks', () => {
    it('should create a new task with all fields', async () => {
      const newTask = {
        title: 'New Test Task',
        description: 'Task description',
        priority: 'high',
        due_date: '2026-12-31'
      };
      
      const response = await request(app)
        .post('/api/tasks')
        .send(newTask)
        .set('Accept', 'application/json');

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.title).toBe(newTask.title);
      expect(response.body.description).toBe(newTask.description);
      expect(response.body.priority).toBe(newTask.priority);
      expect(response.body.due_date).toBe(newTask.due_date);
      expect(response.body.completed).toBe(false);
    });

    it('should create a task with only required fields', async () => {
      const newTask = { title: 'Minimal Task' };
      
      const response = await request(app)
        .post('/api/tasks')
        .send(newTask)
        .set('Accept', 'application/json');

      expect(response.status).toBe(201);
      expect(response.body.title).toBe(newTask.title);
      expect(response.body.priority).toBe('medium');
      expect(response.body.completed).toBe(false);
    });

    it('should return 400 if title is missing', async () => {
      const response = await request(app)
        .post('/api/tasks')
        .send({ description: 'No title' })
        .set('Accept', 'application/json');

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('Title is required');
    });

    it('should return 400 if title is empty', async () => {
      const response = await request(app)
        .post('/api/tasks')
        .send({ title: '   ' })
        .set('Accept', 'application/json');

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 if title exceeds 200 characters', async () => {
      const longTitle = 'a'.repeat(201);
      const response = await request(app)
        .post('/api/tasks')
        .send({ title: longTitle })
        .set('Accept', 'application/json');

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('200 characters or less');
    });

    it('should return 400 for invalid priority', async () => {
      const response = await request(app)
        .post('/api/tasks')
        .send({ title: 'Test', priority: 'invalid' })
        .set('Accept', 'application/json');

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('Priority must be');
    });
  });

  describe('PUT /api/tasks/:id', () => {
    it('should update an existing task', async () => {
      const task = await createTask();
      const updates = {
        title: 'Updated Title',
        description: 'Updated description',
        priority: 'low',
        due_date: '2027-01-01',
        completed: true
      };

      const response = await request(app)
        .put(`/api/tasks/${task.id}`)
        .send(updates)
        .set('Accept', 'application/json');

      expect(response.status).toBe(200);
      expect(response.body.title).toBe(updates.title);
      expect(response.body.description).toBe(updates.description);
      expect(response.body.priority).toBe(updates.priority);
      expect(response.body.completed).toBe(true);
    });

    it('should return 404 for non-existent task', async () => {
      const response = await request(app)
        .put('/api/tasks/999999')
        .send({ title: 'Test' })
        .set('Accept', 'application/json');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Task not found');
    });

    it('should return 400 for invalid data', async () => {
      const task = await createTask();
      const response = await request(app)
        .put(`/api/tasks/${task.id}`)
        .send({ title: '' })
        .set('Accept', 'application/json');

      expect(response.status).toBe(400);
    });
  });

  describe('PATCH /api/tasks/:id/complete', () => {
    it('should toggle task completion from false to true', async () => {
      const task = await createTask();
      expect(task.completed).toBe(false);

      const response = await request(app)
        .patch(`/api/tasks/${task.id}/complete`)
        .set('Accept', 'application/json');

      expect(response.status).toBe(200);
      expect(response.body.completed).toBe(true);
    });

    it('should toggle task completion from true to false', async () => {
      const task = await createTask();
      
      // First toggle to true
      await request(app).patch(`/api/tasks/${task.id}/complete`);
      
      // Then toggle back to false
      const response = await request(app)
        .patch(`/api/tasks/${task.id}/complete`)
        .set('Accept', 'application/json');

      expect(response.status).toBe(200);
      expect(response.body.completed).toBe(false);
    });

    it('should return 404 for non-existent task', async () => {
      const response = await request(app)
        .patch('/api/tasks/999999/complete')
        .set('Accept', 'application/json');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Task not found');
    });
  });

  describe('DELETE /api/tasks/:id', () => {
    it('should delete an existing task', async () => {
      const task = await createTask({ title: 'Task To Be Deleted' });

      const deleteResponse = await request(app).delete(`/api/tasks/${task.id}`);
      expect(deleteResponse.status).toBe(200);
      expect(deleteResponse.body).toEqual({ 
        message: 'Task deleted successfully', 
        id: task.id 
      });

      const deleteAgain = await request(app).delete(`/api/tasks/${task.id}`);
      expect(deleteAgain.status).toBe(404);
      expect(deleteAgain.body).toHaveProperty('error', 'Task not found');
    });

    it('should return 404 when task does not exist', async () => {
      const response = await request(app).delete('/api/tasks/999999');
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Task not found');
    });

    it('should return 400 for invalid id', async () => {
      const response = await request(app).delete('/api/tasks/abc');
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Valid task ID is required');
    });
  });
});