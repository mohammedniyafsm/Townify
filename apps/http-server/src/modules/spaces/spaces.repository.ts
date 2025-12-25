import { prisma } from "@repo/database";


export const createSpaceRepo = (data: {
  name: string;
  creatorId: string;
  mapId?: string;
}) => {
  return prisma.space.create({ data });
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
    include: { members: true },
  });
};

export const deleteSpaceRepo = ( spaceId: string,id: string,) => {
  return prisma.$transaction([
    prisma.spaceInvite.deleteMany({ where : { spaceId } }),
    prisma.spaceMembers.deleteMany({ where: { spaceId  } }),
    prisma.space.delete({ where: { id : spaceId } })
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
  });
};

export const findMember = (spaceId: string, userId: string) => {
  return prisma.spaceMembers.findFirst({
    where: { spaceId , userId },
  });
};

export const findUserById = (userId : string)=>{
  return prisma.user.findUnique({
    where : {
      id : userId
    }
  })
}

export const removeMember = (id: string) => {
  return prisma.spaceMembers.delete({ where: { id } });
};

export const blockMember = (id: string) => {
  return prisma.spaceMembers.update({
    where: { id },
    data: { status: "blocked" },
  });
};

export const findSpaceBySlug = (slug: string) => {
  return prisma.space.findUnique({
    where: { slug },
    include: {
      map: true
    }
  });
};

export const createEmailInviteRepo = (
  spaceId: string,
  email: string
) => {
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

export const UserInvited = (email:string,spaceId :string)=>{
  return prisma.spaceInvite.findFirst({
    where : {
      email,
      spaceId
    } 
  })
}

export const findMemberBySpaceIdAndUserId = (
  spaceId: string,
  userId: string
) => {
  return prisma.spaceMembers.findFirst({
    where: { spaceId, userId },
  });
};

export const createMember = (
  spaceId: string,
  userId: string
) => {
  return prisma.spaceMembers.create({
    data: {
      spaceId,
      userId,
      status: "active",
    },
  });
};

export const findPendingInviteByEmail = (
  spaceId: string,
  email: string
) => {
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

export const findInviteByEmail = (
  spaceId: string,
  email: string
) => {
  return prisma.spaceInvite.findFirst({
    where: { spaceId, email },
  });
};

export const createLinkInvite = (
  spaceId: string,
  email: string
) => {
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
    },
  });
};
