import { Router, Request, Response } from "express";
import Task, { ITask } from "../models/Task";
import authMiddleware, { AuthRequest } from "../middleware/authMiddleware";

const router = Router();

// Create a new task with an optional "completed" field (default is false)
router.post("/", authMiddleware, async (req: AuthRequest, res: Response) => {
  const { title, description, completed } = req.body;
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ error: "Unauthorized" });

  try {
    const newTask: ITask = new Task({
      title,
      description,
      user: userId,
      completed: completed ?? false, // default to false if not provided
    });
    await newTask.save();
    res.status(201).json(newTask);
  } catch (err) {
    res.status(400).json({ error: "Unable to create task" });
  }
});

// Get all tasks for the logged-in user
router.get("/", authMiddleware, async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ error: "Unauthorized" });

  try {
    // Fetch tasks & include createdAt
    const tasks = await Task.find({ user: userId }).select(
      "title description completed createdAt"
    );

    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: "Unable to fetch tasks" });
  }
});

// Get a specific task by its ID
router.get("/:id", authMiddleware, async (req: Request, res: Response) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ error: "Task not found" });
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: "Unable to fetch task" });
  }
});

// Update a task (e.g., title, description, completed)
router.put("/:id", authMiddleware, async (req: Request, res: Response) => {
  try {
    // req.body can include title, description, and completed
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedTask) return res.status(404).json({ error: "Task not found" });
    res.json(updatedTask);
  } catch (err) {
    res.status(400).json({ error: "Unable to update task" });
  }
});

// Delete a task
router.delete("/:id", authMiddleware, async (req: Request, res: Response) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: "Task deleted" });
  } catch (err) {
    res.status(400).json({ error: "Unable to delete task" });
  }
});

export default router;
