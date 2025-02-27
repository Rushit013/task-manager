import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/User";
import authMiddleware, { AuthRequest } from "../middleware/authMiddleware";
import { omit } from "lodash";

const router = Router();

router.post("/signup", async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user: IUser = new User({ name, email, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: "User created" });
  } catch (err) {
    res.status(400).json({ error: "Email already exists or invalid data" });
  }
});

router.post("/login", async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ error: "User not found" });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({ error: "Invalid credentials" });
      return;
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || "secret"
    );

    const userData = user.toObject();

    res.json({ token, user: omit(userData, ["password"]) });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Change Password Endpoint
router.put(
  "/change-password",
  authMiddleware,
  async (req: AuthRequest, res: Response): Promise<void> => {
    const userId = req.user?.id;
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      res.status(400).json({ error: "Old and new passwords are required." });
      return;
    }

    try {
      const user = await User.findById(userId);
      if (!user) {
        res.status(404).json({ error: "User not found." });
        return;
      }

      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
        res.status(400).json({ error: "Old password is incorrect." });
        return;
      }

      user.password = await bcrypt.hash(newPassword, 10);
      await user.save();

      res.status(200).json({ message: "Password changed successfully." });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error." });
    }
  }
);

export default router;
