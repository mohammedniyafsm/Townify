import e, { type Request, type Response } from "express";
import {
  createSpaceService,
  updateSpaceService,
  deleteSpaceService,
  joinSpaceService,
  leaveSpaceService,
  sendInvitationService,
  getUserSpacesService,
  findSpaceBySlugService,
  requestAccessService,
  checkUserSpaceAccessService,
  removeInvitesService,
  approveInviteService,
  toggleMemberService,
  bulkRemoveInvitesService,
  bulkApproveInvitesService,
  getSpaceManageDetailsService,
} from "./spaces.service.js";
import { redisPublisher } from "../../redis/redis.js";

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
      mapId,
      req.user!.userId
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

export const requestAccessToSpace = async (req: Request, res: Response) => {
  try {
    await requestAccessService(req.params.slug as string, req.user!.userId);
    res.json({ message: "Access request sent" });
  } catch (e: any) {
    res.status(400).json({ message: e.message });
  }
};

export const sendInvitation = async (req: Request, res: Response) => {
  try {
    const invites = await sendInvitationService(
      req.body.slug,
      req.body.email,
      req.user!.email,
      req.body.url,
      req.user!.userId
    );
    res.json({ message: "Invitations sent", invites });
  } catch (e: any) {
    res.status(400).json({ message: e.message });
  }
};

export const getUserSpaces = async (req: Request, res: Response) => {
  const spaces = await getUserSpacesService(req.user!.userId);
  res.json({ spaces });
};

export const checkSpaceAccess = async (req: Request, res: Response) => {
  try {
    const result = await checkUserSpaceAccessService(
      req.params.slug as string,
      req.user!.userId
    );

    res.json(result);
  } catch (e: any) {
    res.status(403).json({ message: e.message });
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

export const toggleMember = async (req: Request, res: Response) => {
  try {
    const blocked = await toggleMemberService(
      req.params.slug as string,
      req.user!.userId,
      req.params.userId as string
    );
    console.log("[BLOCKING] Member toggled:", { status: blocked.status, userId: req.params.userId, slug: req.params.slug });
    if (blocked.status === "blocked") {
      const event = {
        type: "USER_BLOCKED",
        payload: {
          userId: req.params.userId,
          spaceName: req.params.slug,
        },
      };
      console.log("[BLOCKING] Publishing to Redis:", event);
      await redisPublisher.publish(
        "SPACE_EVENTS",
        JSON.stringify(event)
      );
      console.log("[BLOCKING] Event published successfully");
    }
    res.json({ status: blocked.status });
  } catch (e: any) {
    res.status(403).json({ message: e.message });
  }
};

export const findSpaceBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const space = await findSpaceBySlugService(
      slug as string,
      req.user!.userId
    );
    res.json({ space });
  } catch (error: any) {
    if (error.message === "SPACE_NOT_FOUND") {
      return res.status(404).json({ message: "Space not found" });
    }
    if (error.message === "FORBIDDEN") {
      return res.status(403).json({ message: "Forbidden" });
    }
    res.status(500).json(error);
  }
};

export const removeInvites = async (req: Request, res: Response) => {
  try {
    await removeInvitesService(req.user!.userId, req.params.id as string);
    res.json({ message: "Invites removed" });
  } catch (e: any) {
    if (e.message === "FORBIDDEN") {
      return res.status(403).json({ message: e.message });
    } else if (e.message) {
      return res.status(404).json({ message: e.message });
    }
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const approveRequestAccess = async (req: Request, res: Response) => {
  try {
    const { inviteId } = req.params;
    const result = await approveInviteService(inviteId!, req.user!.userId);
    res.json({
      message: "Invite approved and user added as member",
      member: result.member,
    });
  } catch (error: any) {
    if (error?.message === "FORBIDDEN") {
      return res.status(403).json({ message: "Forbidden" });
    } else if (error?.message) {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const bulkRemoveInvites = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const { invitationIds } = req.body;
    if (!Array.isArray(invitationIds) || invitationIds.length === 0) {
      return res.status(400).json({
        message: "invitationIds must be a non-empty array",
      });
    }
    await bulkRemoveInvitesService(
      req.user!.userId,
      slug as string,
      invitationIds
    );
    res.json({ message: "Invites removed" });
  } catch (e: any) {
    if (e.message === "FORBIDDEN") {
      return res.status(403).json({ message: e.message });
    } else if (e.message) {
      return res.status(404).json({ message: e.message });
    }
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const bulkApproveInvites = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const result = await bulkApproveInvitesService(
      req.user!.userId,
      slug as string,
      req.body.invitationIds
    );
    res.json({
      message: "Invites approved",
      invites: result.invites,
      members: result.members,
    });
  } catch (e: any) {
    if (e.message === "FORBIDDEN") {
      return res.status(403).json({ message: e.message });
    } else if (e.message) {
      return res.status(404).json({ message: e.message });
    }
    res.status(500).json({ message: "Internal Server Error" });
  }
};


export const getSpaceManageDetails = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const space = await getSpaceManageDetailsService(
      slug as string,
      req.user!.userId
    );
    res.status(200).json({ space });
  }
  catch (error: any) {
    if (error.message === "SPACE_NOT_FOUND") {
      return res.status(404).json({ message: "Space not found" });
    }
    if (error.message === "FORBIDDEN") {
      return res.status(403).json({ message: "Forbidden" });
    }
    res.status(500).json(error.message || "Internal Server Error");
  }
};