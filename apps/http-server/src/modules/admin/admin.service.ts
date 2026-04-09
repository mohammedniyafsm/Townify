import { cacheDel } from "@repo/cache/dist/index.js"
import { getSpaces, getUsers, toggleUser } from "./admin.repository.js"
import { prisma } from "@repo/database"


export const getAdminDashboardService = async () => {
  const spaces = await getSpaces()
  const users = await getUsers()
  return { spaces, users }
}


export const toggleUserStatusService = async (userId: string) => {
  await cacheDel("users:list")
  await cacheDel(`users:me:${userId}`) // User's isActive status changed
  return await toggleUser(userId)
}

export const adminVerifyTokenService = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { avatar: true, space: true },
  });
  if (!user) throw new Error("USER_NOT_FOUND");
  if (!user.isActive) throw new Error("USER_BLOCKED");
  return user;
}