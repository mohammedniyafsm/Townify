import { type  Request, type Response } from "express";
import {
  uploadAvatarService,
  fetchAllAvatarsService,
  fetchAvatarService,
  updateAvatarService,
  deleteAvatarService,
} from "./ avatars.service.js";

export const uploadAvatar = async (req: Request, res: Response) => {
  try {
    const avatar = await uploadAvatarService(
      req.body.name,
      req.file!
    );
    res.status(201).json({ avatar });
  } catch (e: any) {
    res.status(400).json({ message: e.message });
  }
};

export const fetchAllAvatar = async (_: Request, res: Response) => {
  const avatars = await fetchAllAvatarsService();
  res.json({ avatars });
};

export const fetchAvatar = async (req: Request, res: Response) => {
  try {
    const avatar = await fetchAvatarService(req.params.id as string);
    res.json({ avatar });
  } catch {
    res.status(404).json({ message: "Avatar not found" });
  }
};

export const updateAvatar = async (req: Request, res: Response) => {
  try {
    const avatar = await updateAvatarService(
      req.params.id as string,
      req.body.name,
      req.file
    );
    res.json({ avatar });
  } catch (e: any) {
    res.status(400).json({ message: e.message });
  }
};

export const deleteAvatar = async (req: Request, res: Response) => {
  try {
    await deleteAvatarService(req.params.id as string);
    res.json({ message: "Avatar deleted" });
  } catch {
    res.status(404).json({ message: "Avatar not found" });
  }
};
