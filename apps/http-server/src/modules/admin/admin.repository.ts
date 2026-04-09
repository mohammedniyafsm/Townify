import { cacheWrap } from "@repo/cache/dist/index.js";
import { prisma } from "@repo/database";

export const getSpaces = async () => {
  return await cacheWrap("spaces:list", 42000, async () => {
    return prisma.space.findMany();
  });
};

export const getUsers = async () => {
  return await cacheWrap("users:list", 42000, async () => {
    return prisma.user.findMany({
      where: { role: "user" },
      select: {
        password: false,
        id: true,
        name: true,
        email: true,
        isActive: true,
        createdAt: true,
        profile: true,
        role: true,
        avatarId: true,
      },
    });
  });
};

export const toggleUser = async (userId: string) => {  
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error("User not found");

  const newStatus = !user.isActive;
  return prisma.user.update({
    where: { id: userId },
    data: { isActive: newStatus },
     select: {
        password: false,
        id: true,
        name: true,
        email: true,
        isActive: true,
        createdAt: true,
        profile: true,
        role: true,
        avatarId: true,
      },
  });
};
