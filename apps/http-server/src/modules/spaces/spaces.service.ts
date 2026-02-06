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
  createEmailInviteRepo,
  findUserById,
  findMemberBySpaceIdAndUserId,
  findPendingInviteByEmail,
  createMember,
  approveInviteById,
  findInviteByEmail,
  createLinkInvite,
  findInvitesBySpaceId,
  deleteInviteById,
  removeMemberByEmailAndSpaceId,
  findInviteById,
  toogleMember,
  bulkDeleteInvitesByIds,
  bulkRemoveMembersByIds,
  getApprovedInvitesByIds,
  bulkApproveInvitesByIds,
  bulkAddMembers,
  getUserIdsFromInvites,
  getSpaceManageDetailsRepo,
  findMembersBySpaceId,
} from "./spaces.repository.js";
import { inviteApprovalEmail, sendInvitationEmail } from "../../shared/services/nodemailer.service.js";
import { cacheDel, cacheWrap } from "@repo/cache/dist/index.js";
import { prisma } from "@repo/database";
import { publishSpaceEvent } from "../../redis/publish.js";


export const createSpaceService = async (
  userId: string,
  name: string,
  mapId?: string
) => {
  if (!name.trim()) throw new Error("INVALID_NAME");

  if (!name || !userId || !mapId) return;

  await cacheDel("spaces:list")
  await cacheDel(`users:me:${userId}`) // Creator's space list updated
  await cacheDel(`spaces:user:${userId}`) // Creator's cached spaces updated

  const space = await createSpaceRepo({ name, creatorId: userId, mapId });
  await addMember(space.id, userId);
  return space;
};

export const updateSpaceService = async (
  spaceId: string,
  name?: string,
  mapId?: string,
  userId?: string
) => {
  const space = await findSpaceById(spaceId);
  if (!space) throw new Error("SPACE_NOT_FOUND");
  if (!mapId) throw new Error("MAP_ID_REQUIRED");
  if (space.creatorId !== userId) throw new Error("FORBIDDEN");

  // Get all members before update to invalidate their caches
  const members = await findMembersBySpaceId(spaceId);
  const memberUserIds = members.map((m: any) => m.userId);

  await cacheDel("spaces:list")
  // Invalidate cache for all members (space name/map changed in their cache)
  await Promise.all(
    memberUserIds.map((uid: any) => cacheDel(`users:me:${uid}`))
  );

  await cacheDel(`spaces:user:${space.creatorId}`) // Creator's cached spaces updated
  await cacheDel(`spaces:slug:${space.slug}`) // Space slug cache updated

  const updated = await updateSpaceRepo(spaceId, {
    ...(name && { name: name.trim() }),
    ...(mapId && { mapId }),
  });

  return updated;
};

export const deleteSpaceService = async (
  spaceId: string,
  userId: string
) => {
  const space = await findSpaceById(spaceId);
  if (!space) throw new Error("SPACE_NOT_FOUND");

  if (space.creatorId.toString() != userId) throw new Error("FORBIDDEN");

  // Get all members before deletion to invalidate their caches
  const members = await findMembersBySpaceId(spaceId);
  const memberUserIds = members.map((m: any) => m.userId);

  await cacheDel("spaces:list")
  // Invalidate cache for all members (space removed from their cache)
  await Promise.all(
    memberUserIds.map((uid: any) => cacheDel(`users:me:${uid}`))
  );

  await cacheDel(`spaces:user:${userId}`) // Creator's cached spaces updated
  await cacheDel(`spaces:slug:${space.slug}`) // Space slug cache updated

  await deleteSpaceRepo(spaceId);
};

export const joinSpaceService = async (slug: string, userId: string) => {

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
    await cacheDel(`users:me:${userId}`); // User joined space
    const newMember = await createMember(space.id, userId);
    await approveInviteById(invite.id);
    return newMember;
  }

  throw new Error("WAITING_FOR_APPROVAL");
};

export const leaveSpaceService = async (spaceId: string, userId: string) => {
  const member = await findMember(spaceId, userId);
  if (!member) throw new Error("NOT_MEMBER");

  await cacheDel(`users:me:${userId}`); // User left space
  await removeMember(member.id);
};

export const toggleMemberService = async (
  slug: string,
  creatorId: string,
  userId: string
) => {
  const space = await findSpaceBySlug(slug);
  if (!space) throw new Error("SPACE_NOT_FOUND");
  if (space.creatorId !== creatorId) throw new Error("FORBIDDEN");
  const member = await findMember(space.id, userId);
  if (!member) throw new Error("NOT_MEMBER");
  const status = member.status === "active" ? "blocked" : "active";
  await cacheDel(`users:me:${userId}`); // Member status changed
  const result = await toogleMember(member.id, status);
  return result;
};

export const sendInvitationService = async (
  slug: string,
  emails: string[],
  inviterEmail: string,
  url: string,
  userId: string
) => {
  const space = await findSpaceBySlug(slug);
  if (!space) throw new Error("SPACE_NOT_FOUND");

  if (space.creatorId !== userId) throw new Error("ONLY SPACE OWNER CAN SEND INVITES");

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
  return findInvitesBySpaceId(space.id);
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
      spaceId: space.id,
      userId: userId,
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
    spaceId: space.id,
    userId: userId,
  };
};

export const getUserSpacesService = async (userId: string) => {
  const spaces = await cacheWrap(`spaces:user:${userId}`, 420000, () => getSpacesByUser(userId));
  return spaces;
};

export const findSpaceBySlugService = async (slug: string, userId: string) => {
  const space = await cacheWrap(`spaces:slug:${slug}`, 420000, () => findSpaceBySlug(slug));
  if (!space) throw new Error("SPACE_NOT_FOUND");
  const members = await findMemberBySpaceIdAndUserId(space.id, userId);
  if (!members) {
    throw new Error("FORBIDDEN");
  }
  return space;
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

  const invite = await createLinkInvite(space.id, user.email, userId);

  await publishSpaceEvent({
    type: "JOIN_REQUEST",
    spaceId: space.id,
    payload: {
      adminUserId: space.creatorId,
      requester: {
        createdAt: new Date(),
        id: invite.id,
        email: user.email,
        userId,
        spaceId: space.id,
        slug: space.slug,
        status: 'pending',
        type: 'link',
        userName: user.name,
        inviteId: invite.id,
      },
    },
  });

  return true;
};

export const removeInvitesService = async (userId: string, inviteId: string) => {
  const inivite = await findInviteById(inviteId);
  if (!inivite) throw new Error("INVITE_NOT_FOUND");
  const spaceId = inivite.spaceId;
  const email = inivite.email;
  const space = await findSpaceById(spaceId);
  if (!space) throw new Error("SPACE_NOT_FOUND");
  if (space.creatorId.toString() != userId) throw new Error("FORBIDDEN");
  const member = await findMemberBySpaceIdAndUserId(spaceId, inivite.userId || '');
  if (!member) {
    await deleteInviteById(inviteId, spaceId || '')
    return
  }
  if (inivite.userId) {
    await cacheDel(`users:me:${inivite.userId}`); // User removed from space
  }
  await prisma.$transaction([
    deleteInviteById(inviteId, spaceId || ''),
    removeMemberByEmailAndSpaceId(spaceId, email || ''),
  ]);
}

export const approveInviteService = async (inviteId: string, userId: string) => {
  const invite = await findInviteById(inviteId);
  if (!invite) throw new Error("INVITE_NOT_FOUND");
  const space = await findSpaceById(invite.spaceId);
  if (!space) throw new Error("SPACE_NOT_FOUND");
  if (space.creatorId.toString() !== userId) throw new Error("FORBIDDEN");
  if (invite.userId) {
    await cacheDel(`users:me:${invite.userId}`); // User approved and joined space
  }
  const [member, invites] = await prisma.$transaction([
    addMember(invite.spaceId, invite.userId!),
    approveInviteById(inviteId),
  ])

  await publishSpaceEvent({
    type: "JOIN_APPROVED",
    spaceId: space.id,
    payload: {
      userId: invite.userId,
      spaceSlug: space.slug,
      spaceName: space.name
    }
  });

  await inviteApprovalEmail(
    invite.email || "",
    space.name,
    `${process.env.CLIENT_URL || 'http://localhost:5173'}/lobby/${space.slug}`
  );
  return { member, invites };
};

export const bulkRemoveInvitesService = async (userId: string, slug: string, invitationIds: string[]) => {
  const space = await findSpaceBySlug(slug);
  if (!space) throw new Error("SPACE_NOT_FOUND");
  if (space.creatorId.toString() != userId) throw new Error("FORBIDDEN");

  // Get user IDs before deletion to invalidate their caches
  const userIds = await getUserIdsFromInvites(space.id, invitationIds);
  const userIdList = userIds.map((u: any) => u.userId).filter((id): id is string => id !== null);

  const emails = await getApprovedInvitesByIds(space.id, invitationIds);
  const emailList = emails.map((e) => e.email).filter((email: any): email is string => email !== null);
  // Invalidate cache for all removed users
  await Promise.all(
    userIdList.map((uid: any) => cacheDel(`users:me:${uid}`))
  );

  const [invites, members] = await prisma.$transaction([
    bulkDeleteInvitesByIds(space.id, invitationIds),
    bulkRemoveMembersByIds(space.id, invitationIds, emailList),
  ]
  );

  return { invites, members };
}

export const bulkApproveInvitesService = async (userId: string, slug: string, invitationIds: string[]) => {
  const space = await findSpaceBySlug(slug);
  if (!space) throw new Error("SPACE_NOT_FOUND");
  if (space.creatorId.toString() != userId) throw new Error("FORBIDDEN");
  const userIds = await getUserIdsFromInvites(space.id, invitationIds);
  const userIdList = userIds.map((u: any) => u.userId).filter((id: any): id is string => id !== null);
  const emailList = userIds.map((u: any) => u.email).filter((email: any): email is string => email !== null);
  const url = `${process.env.CLIENT_URL || 'http://localhost:5173'}/lobby/${space.slug}`;
  const spaceApprovedEmail = emailList.map((email: any) => inviteApprovalEmail(

    email,
    space.name,
    url
  ));
  // Invalidate cache for all approved users (they joined the space)
  await Promise.all(
    userIdList.map((uid: any) => cacheDel(`users:me:${uid}`))
  );

  const [invites, members] = await prisma.$transaction([
    bulkApproveInvitesByIds(space.id, invitationIds),
    bulkAddMembers(space.id, userIdList),
  ]);

  await Promise.allSettled(spaceApprovedEmail)
  return { invites, members };
}

export const getSpaceManageDetailsService = async (slug: string, userId: string) => {
  const space = await getSpaceManageDetailsRepo(slug);
  if (!space) throw new Error("SPACE_NOT_FOUND");
  if (space.creatorId.toString() != userId) throw new Error("FORBIDDEN");
  return space;
}