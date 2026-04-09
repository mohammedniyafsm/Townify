import { prisma } from "@repo/database";

export const createMapRepo = (data: any) => {
  return prisma.map.create({ data });
};

export const getAllMapsRepo = () => {
  return prisma.map.findMany();
};

export const getMapByIdRepo = (id: string) => {
  return prisma.map.findUnique({ where: { id } });
};

export const updateMapRepo = (id: string, data: any) => {
  return prisma.map.update({ where: { id }, data });
};

export const deleteMapRepo = (id: string) => {
  return prisma.map.delete({ where: { id } });
};
