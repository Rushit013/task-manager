import { Router, Request, Response } from "express";
import Task, { ITask } from "../models/Task";
import authMiddleware, { AuthRequest } from "../middleware/authMiddleware";

const router = Router();

// Create a new task
router.post(
  "/",
  authMiddleware,
  async (req: AuthRequest, res: Response): Promise<void> => {
    const { title, description, completed } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    try {
      const newTask: ITask = new Task({
        title,
        description,
        user: userId,
        completed: completed ?? false,
      });

      await newTask.save();
      res.status(201).json(newTask);
    } catch (err) {
      res.status(400).json({ error: "Unable to create task" });
    }
  }
);

// Get all tasks for the logged-in user
router.get(
  "/",
  authMiddleware,
  async (req: AuthRequest, res: Response): Promise<void> => {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    try {
      const tasks = await Task.find({ user: userId }).select(
        "title description completed createdAt"
      );
      res.json(tasks);
    } catch (err) {
      res.status(500).json({ error: "Unable to fetch tasks" });
    }
  }
);

// Get a specific task by its ID
router.get(
  "/:id",
  authMiddleware,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const task = await Task.findById(req.params.id);

      if (!task) {
        res.status(404).json({ error: "Task not found" });
        return;
      }

      res.json(task);
    } catch (err) {
      res.status(500).json({ error: "Unable to fetch task" });
    }
  }
);

// Update a task
router.put(
  "/:id",
  authMiddleware,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const updatedTask = await Task.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );

      if (!updatedTask) {
        res.status(404).json({ error: "Task not found" });
        return;
      }

      res.json(updatedTask);
    } catch (err) {
      res.status(400).json({ error: "Unable to update task" });
    }
  }
);

// Delete a task
router.delete(
  "/:id",
  authMiddleware,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const task = await Task.findByIdAndDelete(req.params.id);

      if (!task) {
        res.status(404).json({ error: "Task not found" });
        return;
      }

      res.json({ message: "Task deleted" });
    } catch (err) {
      res.status(400).json({ error: "Unable to delete task" });
    }
  }
);

export default router;
