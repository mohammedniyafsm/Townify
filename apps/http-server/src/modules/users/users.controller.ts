import { type Request, type Response } from "express";
import {
  getUserService,
  updateUserProfileService,
} from "./users.service.js";

export const getUser = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId!;
    const user = await getUserService(userId);

    return res.json({ user });
  } catch (err: any) {
    if (err.message === "USER_NOT_FOUND") {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateUserProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId!;
    const { name, avatarId } = req.body;
    const file = req.file;

    const user = await updateUserProfileService({
      userId,
      name,
      avatarId,
      file,
    });

    return res.json({
      message: "User updated successfully",
      user,
    });
  } catch (err: any) {
    if (err.message === "USER_NOT_FOUND") {
      return res.status(404).json({ message: "User not found" });
    }
    if (err.message === "INVALID_NAME") {
      return res.status(400).json({ message: "Name cannot be empty" });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
};
