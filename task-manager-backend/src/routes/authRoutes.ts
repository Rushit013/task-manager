import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/User";
import authMiddleware, { AuthRequest } from "../middleware/authMiddleware";

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

router.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || "secret"
      // { expiresIn: "1h" }
    );

    const userData = user.toObject();
    delete userData.password;
    res.json({ token, user: userData });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Change Password Endpoint
router.put(
  "/change-password",
  authMiddleware,
  async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res
        .status(400)
        .json({ error: "Old and new passwords are required." });
    }

    try {
      const user = (await User.findById(userId)) as IUser;
      if (!user) {
        return res.status(404).json({ error: "User not found." });
      }

      // Compare the provided old password with the stored password
      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ error: "Old password is incorrect." });
      }

      // Hash the new password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      // Update user password and save
      user.password = hashedPassword;
      await user.save();

      return res
        .status(200)
        .json({ message: "Password changed successfully." });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Server error." });
    }
  }
);

export default router;
