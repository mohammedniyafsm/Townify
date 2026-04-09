import { prisma } from "@repo/database";

export const createAvatarRepo = (data: {
  name: string;
  walkSheet: string;
  idle:string;
}) => {
  return prisma.avatar.create({ data });
};

export const getAllAvatarsRepo = () => {
  return prisma.avatar.findMany();
};

export const getAvatarByIdRepo = (id: string) => {
  return prisma.avatar.findUnique({ where: { id } });
};

export const updateAvatarRepo = (id: string, data: any) => {
  return prisma.avatar.update({
    where: { id },
    data,
  });
};

export const deleteAvatarRepo = (id: string) => {
  return prisma.avatar.delete({
    where: { id },
  });
};