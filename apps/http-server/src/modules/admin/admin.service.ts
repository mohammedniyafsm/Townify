import { cacheDel } from "@repo/cache/dist/index.js"
import { getSpaces, getUsers, toggleUser } from "./admin.repository.js"


export const getAdminDashboardService = async () => {
  const spaces=await getSpaces()
  const users=await getUsers()
  return {spaces,users}
}


export const toggleUserStatusService=async(userId:string)=>{
    await cacheDel("users:list")
    return await toggleUser(userId)
}