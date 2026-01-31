import { MemberStatus, prisma } from "@repo/database";
import type { Prisma } from "@repo/database";

export const createSpaceRepo = (data: {
  name: string;
  creatorId: string;
  mapId?: string;
}) => {
  return prisma.space.create({ data, include: { map: true } });
};

export const findSpaceById = (id: string) => {
  return prisma.space.findUnique({
    where: { id },
    include: { map: true },
  });
};

export const updateSpaceRepo = (id: string, data: any) => {
  return prisma.space.update({
    where: { id },
    data,
    include: {
      members: {
        include: {
          user: {
            select: { id: true, name: true, email: true, profile: true },
          },
        },
      },
      map: true,
      invites: true,
    },
  });
};

export const deleteSpaceRepo = (spaceId: string) => {
  return prisma.$transaction([
    prisma.spaceInvite.deleteMany({ where: { spaceId } }),
    prisma.spaceMembers.deleteMany({ where: { spaceId } }),
    prisma.space.delete({ where: { id: spaceId } }),
  ]);
};

export const getSpacesByUser = (userId: string) => {
  return prisma.space.findMany({
    where: { creatorId: userId },
    include: { map: true },
  });
};

export const addMember = (spaceId: string, userId: string) => {
  return prisma.spaceMembers.create({
    data: { spaceId, userId },
    include: {
      user: {
        select: { id: true, name: true, email: true, profile: true },
      }
    }
  });
};

export const findMember = (spaceId: string, userId: string) => {
  return prisma.spaceMembers.findFirst({
    where: { spaceId, userId },
  });
};

export const findUserById = (userId: string) => {
  return prisma.user.findUnique({
    where: {
      id: userId,
    },
  });
};

export const removeMember = (id: string) => {
  return prisma.spaceMembers.delete({ where: { id } });
};

export const toogleMember = (id: string, status: MemberStatus) => {
  return prisma.spaceMembers.update({
    where: { id },
    data: { status },
    include: {
      user: {
        select: { id: true, name: true, email: true, profile: true },
      }
    }
  });
};

export const findSpaceBySlug = (slug: string) => {
  return prisma.space.findUnique({
    where: { slug },
    include: {
      map: true,
    },
  });
};

export const getSpaceManageDetailsRepo = (slug: string) => {
  return prisma.space.findUnique({
    where: { slug },
    include: {
      map: true,
      members: {
        include: {
          user: {
            select: { id: true, name: true, email: true, profile: true },
          },
        },
      },
      invites: true,
    },
  });
}
export const createEmailInviteRepo = (spaceId: string, email: string) => {
  return prisma.spaceInvite.upsert({
    where: {
      spaceId_email: {
        spaceId,
        email,
      },
    },
    update: {},
    create: {
      spaceId,
      email,
      type: "email",
      status: "pending",
    },
  });
};

export const UserInvited = (email: string, spaceId: string) => {
  return prisma.spaceInvite.findFirst({
    where: {
      email,
      spaceId,
    },
  });
};

export const findMemberBySpaceIdAndUserId = (
  spaceId: string,
  userId: string
) => {
  return prisma.spaceMembers.findFirst({
    where: { spaceId, userId },
    include: {
      user: {
        select: { id: true, name: true, email: true, profile: true },
      },
    },
  });
};

export const createMember = (spaceId: string, userId: string) => {
  return prisma.spaceMembers.create({
    data: {
      spaceId,
      userId,
      status: "active",
    },
  });
};

export const findPendingInviteByEmail = (spaceId: string, email: string) => {
  return prisma.spaceInvite.findFirst({
    where: {
      spaceId,
      email,
      status: "pending",
    },
  });
};

export const approveInviteById = (inviteId: string) => {
  return prisma.spaceInvite.update({
    where: { id: inviteId },
    data: { status: "approved" },
  });
};

export const findInviteByEmail = (spaceId: string, email: string) => {
  return prisma.spaceInvite.findFirst({
    where: { spaceId, email },
  });
};

export const createLinkInvite = (spaceId: string, email: string, userId: string) => {
  return prisma.spaceInvite.upsert({
    where: {
      spaceId_email: {
        spaceId,
        email,
      },
    },
    update: {
      type: "link",
      status: "pending",
    },
    create: {
      spaceId,
      email,
      type: "link",
      status: "pending",
      userId
    },
  });
};

export const findInviteById = (inviteId: string) => {
  return prisma.spaceInvite.findUnique({
    where: { id: inviteId },
  });
}

export const findInvitesBySpaceId = (spaceId: string) => {
  return prisma.spaceInvite.findMany({
    where: { spaceId },
  });
}

export const deleteInviteById = (inviteId: string, spaceId: string) => {
  return prisma.spaceInvite.delete({
    where: { id: inviteId, spaceId },
  });
}
export const removeMemberByEmailAndSpaceId = (spaceId: string, email: string) => {
  return prisma.spaceMembers.deleteMany({
    where: {
      spaceId,
      user: {
        email
      },
    },
  });
}

export const findMembersBySpaceId = (spaceId: string) => {
  return prisma.spaceMembers.findMany({
    where: { spaceId },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          profile: true,
        },
      },
    },
  });
}


export const bulkApproveInvitesByIds = (spaceId: string, inviteIds: string[]) => {
  return prisma.spaceInvite.updateMany({
    where: { id: { in: inviteIds }, spaceId },
    data: { status: "approved" },
  });
}

export const getUserIdsFromInvites = (spaceId: string, inviteIds: string[]) => {
  return prisma.spaceInvite.findMany({
    where: {
      id: { in: inviteIds },
      spaceId
    },
    select: {
      userId: true,
      email: true
    },
  });
}

export const bulkAddMembers = (spaceId: string, userIds: string[]) => {
  const membersData: Prisma.SpaceMembersCreateManyInput[] = userIds.map((userId) => ({
    spaceId,
    userId,
    status: "active",
  }));

  return prisma.spaceMembers.createManyAndReturn({
    data: membersData,
    skipDuplicates: true,
    include: {
      user: {
        select: { id: true, name: true, email: true, profile: true },
      }
    }
  });
}

export const bulkDeleteInvitesByIds = (spaceId: string, inviteIds: string[]) => {
  return prisma.spaceInvite.deleteMany({
    where: { id: { in: inviteIds }, spaceId },
  });
}

export const getApprovedInvitesByIds = (spaceId: string, inviteIds: string[]) => {
  return prisma.spaceInvite.findMany({
    where: { spaceId, status: 'approved', id: { in: inviteIds } },
    select: { email: true }
  });
}

export const bulkRemoveMembersByIds = (spaceId: string, inviteIds: string[], emailList: string[]) => {
  return prisma.spaceMembers.deleteMany({
    where: {
      spaceId,
      user: {
        email: { in: emailList },
      },
    },
  });
}

export const findCreatorsByMapId = async (mapId: string) => {
  const spaces = await prisma.space.findMany({
    where: { mapId },
    select: { creatorId: true },
    distinct: ['creatorId']
  });
  return spaces.map((s: any) => s.creatorId);
};

export const findSlugsByMapId = async (mapId: string) => {
  const spaces = await prisma.space.findMany({
    where: { mapId },
    select: { slug: true }
  });
  return spaces.map((s: any) => s.slug);
}; 