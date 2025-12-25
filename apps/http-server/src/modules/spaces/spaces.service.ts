import {
  createSpaceRepo,
  findSpaceById,
  findSpaceBySlug,
  updateSpaceRepo,
  deleteSpaceRepo,
  getSpacesByUser,
  addMember,
  findMember,
  removeMember,
  blockMember,
  createEmailInviteRepo,
  findUserById,
  UserInvited,
  findMemberBySpaceIdAndUserId,
  findPendingInviteByEmail,
  createMember,
  approveInviteById,
  findInviteByEmail,
  createLinkInvite,
} from "./spaces.repository.js";
import { sendInvitationEmail } from "../../shared/services/nodemailer.service.js";
import { cacheDel } from "@repo/cache/dist/index.js";


export const createSpaceService = async (
  userId: string,
  name: string,
  mapId?: string
) => {
  if (!name.trim()) throw new Error("INVALID_NAME");

  if (!name || !userId || !mapId) return;

  const space = await createSpaceRepo({ name, creatorId: userId, mapId });
   await cacheDel("spaces:list")
   await addMember(space.id, userId);
  return space;
};

export const updateSpaceService = async (
  spaceId: string,
  name?: string,
  mapId?: string,
  userId? : string
) => {
  const space = await findSpaceById(spaceId);
  if (!space) throw new Error("SPACE_NOT_FOUND");
  if (space.creatorId !== userId) throw new Error("FORBIDDEN");

  await cacheDel("spaces:list")
  return updateSpaceRepo(spaceId, {
    ...(name && { name: name.trim() }),
    ...(mapId && { mapId }),
  });
};

export const deleteSpaceService = async (
  spaceId: string,
  userId: string
) => {
  const space = await findSpaceById(spaceId);
  if (!space) throw new Error("SPACE_NOT_FOUND");

  if (space.creatorId.toString() != userId) throw new Error("FORBIDDEN");

  await cacheDel("spaces:list")
  await deleteSpaceRepo(spaceId, space.slug);
};

export const joinSpaceService = async (slug: string, userId: string) => {
  //  Find space
  const space = await findSpaceBySlug(slug);
  if (!space) throw new Error("SPACE_NOT_FOUND");

  //  Find user
  const user = await findUserById(userId);
  if (!user) throw new Error("USER_NOT_FOUND");

  //  Check membership
  const member = await findMemberBySpaceIdAndUserId(space.id, userId);

  if (member) {
    if (member.status === "blocked") {
      throw new Error("USER_BLOCKED");
    }
    return member;
  }

  //  Check invitation
  const invite = await findPendingInviteByEmail(space.id, user.email);

  if (!invite) {
    throw new Error("NOT_INVITED");
  }

  // 5️⃣ Handle invite type
  if (invite.type === "email") {
    const newMember = await createMember(space.id, userId);
    await approveInviteById(invite.id);
    return newMember;
  }

  throw new Error("WAITING_FOR_APPROVAL");
};

export const leaveSpaceService = async (spaceId: string, userId: string) => {
  const member = await findMember(spaceId, userId);
  if (!member) throw new Error("NOT_MEMBER");

  await removeMember(member.id);
};

export const blockUserService = async (
  slug: string,
  creatorId: string,
  userIdToBlock: string
) => {
  const space = await findSpaceBySlug(slug);
  if (!space) throw new Error("SPACE_NOT_FOUND");
  if (space.creatorId !== creatorId) throw new Error("FORBIDDEN");

  const member = await findMember(slug, userIdToBlock);
  if (!member) throw new Error("NOT_MEMBER");

  return blockMember(member.id);
};

export const sendInvitationService = async (
  slug: string,
  emails: string[],
  inviterEmail: string,
  url: string,
  userId : string
) => {
  const space = await findSpaceBySlug(slug);
  if (!space) throw new Error("SPACE_NOT_FOUND");
  
  if(space.creatorId !== userId) throw new Error("ONLY SPACE OWNER CAN SEND INVITES");

  await Promise.all(
    emails.map(async (email) => {
      const cleanEmail = email.trim();

      await createEmailInviteRepo(space.id, cleanEmail);

      await sendInvitationEmail(
        cleanEmail,
        space.name,
        inviterEmail,
        `${url}/${slug}`
      );
    })
  );
};

export const checkUserSpaceAccessService = async (
  slug: string,
  userId: string
) => {
  //  Find space
  const space = await findSpaceBySlug(slug);
  if (!space) throw new Error("SPACE_NOT_FOUND");

  //  Owner check (FASTEST)
  if (space.creatorId === userId) {
    return {
      isOwner: true,
      role: "owner",
    };
  }

  //  Member check
  const member = await findMemberBySpaceIdAndUserId(
    space.id,
    userId
  );

  if (!member) {
    throw new Error("NO_ACCESS");
  }

  if (member.status === "blocked") {
    throw new Error("BLOCKED");
  }

  return {
    isOwner: false,
    role: "member",
  };
};

export const getUserSpacesService = async (userId: string) => {
  return getSpacesByUser(userId);
};

export const findSpaceBySlugService = async (slug: string) => {
  return findSpaceBySlug(slug);
}

export const requestAccessService = async (
  slug: string,
  userId: string
) => {
  //  Find space
  const space = await findSpaceBySlug(slug);
  if (!space) throw new Error("SPACE_NOT_FOUND");

  //  Find user
  const user = await findUserById(userId);
  if (!user) throw new Error("USER_NOT_FOUND");

  //  Check already member
  const member = await findMemberBySpaceIdAndUserId(space.id, userId);
  if (member) throw new Error("ALREADY_MEMBER");

  //  Check existing invite/request
  const existingInvite = await findInviteByEmail(
    space.id,
    user.email
  );

  if (existingInvite) {
    if (existingInvite.status === "pending") {
      throw new Error("REQUEST_ALREADY_SENT");
    }
    if (existingInvite.status === "approved") {
      throw new Error("ALREADY_APPROVED");
    }
  }

  //  Create request invite (LINK TYPE)
  await createLinkInvite(space.id, user.email);

  return true;
};
