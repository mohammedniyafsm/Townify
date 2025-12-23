import { type Request, type Response } from "express";
import {
  createSpaceService,
  updateSpaceService,
  deleteSpaceService,
  joinSpaceService,
  leaveSpaceService,
  blockUserService,
  sendInvitationService,
  getUserSpacesService,
  findSpaceBySlugService,
} from "./spaces.service.js";

export const createSpace = async (req: Request, res: Response) => {
  try {
    const space = await createSpaceService(
      req.user!.userId,
      req.body.name,
      req.body.mapId
    );
    res.status(201).json({ space });
  } catch (e: any) {
    res.status(400).json({ message: e.message });
  }
};

export const updateSpace = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, mapId } = req.body;
    const space = await updateSpaceService(
      id as string,
      name,
      mapId
    );
    res.json({ space });
  } catch (e: any) {
    res.status(400).json({ message: e.message });
  }
};

export const deleteSpace = async (req: Request, res: Response) => {
  try {
    await deleteSpaceService(req.params.id as string, req.user!.userId);
    res.json({ message: "Space deleted" });
  } catch (e: any) {
    res.status(403).json({ message: e.message });
  }
};

export const joinSpace = async (req: Request, res: Response) => {
  try {
    const member = await joinSpaceService(
      req.params.slug as string,
      req.user!.userId
    );
    res.json({ member });
  } catch (e: any) {
    res.status(400).json({ message: e.message });
  }
};

export const leaveSpace = async (req: Request, res: Response) => {
  try {
    await leaveSpaceService(req.params.slug as string, req.user!.userId);
    res.json({ message: "Left space" });
  } catch (e: any) {
    res.status(400).json({ message: e.message });
  }
};

export const blockUser = async (req: Request, res: Response) => {
  try {
    const blocked = await blockUserService(
      req.params.slug as string,
      req.user!.userId,
      req.params.userIdToBlock as string
    );
    res.json({ blocked });
  } catch (e: any) {
    res.status(403).json({ message: e.message });
  }
};

export const sendInvitation = async (req: Request, res: Response) => {
  try {
    await sendInvitationService(
      req.body.slug,
      req.body.email,
      req.user!.email,
      req.body.url
    );
    res.json({ message: "Invitations sent" });
  } catch (e: any) {
    res.status(400).json({ message: e.message });
  }
};

export const getUserSpaces = async (req: Request, res: Response) => {
  const spaces = await getUserSpacesService(req.user!.userId);
  res.json({ spaces });
};

export const findSpaceBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const space = await findSpaceBySlugService(slug as string);
    res.json({space});
  } catch (error: any) {
    res.status(500).json(error);
  }
}