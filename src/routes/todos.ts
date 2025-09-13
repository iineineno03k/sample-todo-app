import { PrismaClient, TodoStatus } from '@prisma/client';
import express from 'express';
import { type AuthRequest, authenticateToken } from '../middleware/auth';
import type { CreateTodoRequest, UpdateTodoRequest, UpdateTodoStatusRequest } from '../types';

const router = express.Router();
const prisma = new PrismaClient();

// Apply authentication middleware to all routes
router.use(authenticateToken);

// Get all todos for authenticated user
router.get('/', async (req: AuthRequest, res: express.Response) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const todos = await prisma.todo.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    res.json(todos);
  } catch (error) {
    console.error('Get todos error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get single todo by ID
router.get('/:id', async (req: AuthRequest, res: express.Response) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const todo = await prisma.todo.findFirst({
      where: { id, userId },
    });

    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    res.json(todo);
  } catch (error) {
    console.error('Get todo error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new todo
router.post('/', async (req: AuthRequest, res: express.Response) => {
  try {
    const { title, description }: CreateTodoRequest = req.body;
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const todo = await prisma.todo.create({
      data: {
        title,
        description,
        userId,
        status: TodoStatus.TODO,
      },
    });

    res.status(201).json(todo);
  } catch (error) {
    console.error('Create todo error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update todo
router.put('/:id', async (req: AuthRequest, res: express.Response) => {
  try {
    const { id } = req.params;
    const { title, description }: UpdateTodoRequest = req.body;
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    // Check if todo exists and belongs to user
    const existingTodo = await prisma.todo.findFirst({
      where: { id, userId },
    });

    if (!existingTodo) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    const updatedTodo = await prisma.todo.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(description !== undefined && { description }),
      },
    });

    res.json(updatedTodo);
  } catch (error) {
    console.error('Update todo error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update todo status
router.put('/:id/status', async (req: AuthRequest, res: express.Response) => {
  try {
    const { id } = req.params;
    const { status }: UpdateTodoStatusRequest = req.body;
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    if (!status || !Object.values(TodoStatus).includes(status as TodoStatus)) {
      return res.status(400).json({
        error: 'Valid status is required',
        validStatuses: Object.values(TodoStatus),
      });
    }

    // Check if todo exists and belongs to user
    const existingTodo = await prisma.todo.findFirst({
      where: { id, userId },
    });

    if (!existingTodo) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    const updatedTodo = await prisma.todo.update({
      where: { id },
      data: { status: status as TodoStatus },
    });

    res.json(updatedTodo);
  } catch (error) {
    console.error('Update todo status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete todo
router.delete('/:id', async (req: AuthRequest, res: express.Response) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    // Check if todo exists and belongs to user
    const existingTodo = await prisma.todo.findFirst({
      where: { id, userId },
    });

    if (!existingTodo) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    await prisma.todo.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error) {
    console.error('Delete todo error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
