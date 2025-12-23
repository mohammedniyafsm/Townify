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
    include: { spaceMembers: true, map: true },
  });
};

export const updateSpaceRepo = (id: string, data: any) => {
  return prisma.space.update({
    where: { id },
    data,
    include: { spaceMembers: true },
  });
};

export const deleteSpaceRepo = (id: string, slug: string) => {
  return prisma.$transaction([
    prisma.spaceMembers.deleteMany({ where: { slugId: slug } }),
    prisma.space.delete({ where: { id } }),
  ]);
};

export const getSpacesByUser = (userId: string) => {
  return prisma.space.findMany({
    where: { creatorId: userId },
    include: { spaceMembers: true, map: true },
  });
};

export const addMember = (slug: string, userId: string) => {
  return prisma.spaceMembers.create({
    data: { slugId: slug, userId },
  });
};

export const findMember = (slug: string, userId: string) => {
  return prisma.spaceMembers.findFirst({
    where: { slugId: slug, userId },
  });
};

export const removeMember = (id: string) => {
  return prisma.spaceMembers.delete({ where: { id } });
};

export const blockMember = (id: string) => {
  return prisma.spaceMembers.update({
    where: { id },
    data: { isActive: false },
  });
};

export const findSpaceBySlug = (slug: string) => {
  return prisma.space.findUnique({ where: { slug } });
};