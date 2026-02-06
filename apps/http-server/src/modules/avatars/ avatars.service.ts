import { cacheWrap, cacheDel, deleteAllUsersCache } from "@repo/cache";
import {
  createAvatarRepo,
  getAllAvatarsRepo,
  getAvatarByIdRepo,
  updateAvatarRepo,
  deleteAvatarRepo,
} from "./avatars.repository.js";
import { uploadToCloudinary } from "../../shared/services/cloudinary.service.js";
import fs from 'fs'

const avatarUpload = (path: string) =>
  uploadToCloudinary(path, { folder: "Townify/Avatar" });

export const uploadAvatarService = async (
  name: string,
  walkSheet?: Express.Multer.File,
  idle?: Express.Multer.File
) => {
  if (!name.trim()) throw new Error("INVALID_NAME");
  if (!walkSheet) throw new Error("MISSING_WALKSHEET");
  if (!idle) throw new Error("MISSING_IDLE");

  const [walkSheetURL, idleURL] = await Promise.all([
    avatarUpload(walkSheet.path),
    avatarUpload(idle.path)
  ]);
  if (!idleURL.success || !walkSheetURL.success) throw new Error("UPLOAD_FAILED");

  if (fs.existsSync(idle.path)) fs.unlinkSync(idle.path)
  if (fs.existsSync(walkSheet.path)) fs.unlinkSync(walkSheet.path)
  await cacheDel("avatars:list");
  await deleteAllUsersCache(); // Avatar affects all users with this avatar

  return createAvatarRepo({
    name: name.trim(),
    walkSheet: walkSheetURL.result?.secure_url || "",
    idle: idleURL.result?.secure_url || "",
  });
};

export const fetchAllAvatarsService = async () => {
  return cacheWrap("avatars:list", 43200, getAllAvatarsRepo);
};

export const fetchAvatarService = async (id: string) => {
  const avatar = await cacheWrap(`avatars:${id}`, 400, () =>
    getAvatarByIdRepo(id)
  );
  if (!avatar) throw new Error("AVATAR_NOT_FOUND");
  return avatar;
};

export const updateAvatarService = async (
  id: string,
  name?: string,
  walkSheet?: Express.Multer.File,
  idle?: Express.Multer.File
) => {
  const avatar = await getAvatarByIdRepo(id);
  if (!avatar) throw new Error("AVATAR_NOT_FOUND");

  const data: any = {};
  if (name?.trim()) data.name = name.trim();
  if (idle) {
    const uploadResult = await avatarUpload(idle.path);
    if (!uploadResult.success) throw new Error("UPLOAD_FAILED");
    data.idle = uploadResult.result?.secure_url;
    if (fs.existsSync(idle.path)) fs.unlinkSync(idle.path)
  }

  if (walkSheet) {
    const uploadResult = await avatarUpload(walkSheet.path);
    if (!uploadResult.success) throw new Error("UPLOAD_FAILED");
    data.walkSheet = uploadResult.result?.secure_url;
    if (fs.existsSync(walkSheet.path)) fs.unlinkSync(walkSheet.path)
  }

  if (!Object.keys(data).length) throw new Error("NO_UPDATES");

  await cacheDel("avatars:list");
  await cacheDel(`avatars:${id}`);
  await deleteAllUsersCache(); // Avatar update affects all users with this avatar

  return updateAvatarRepo(id, data);
};

export const deleteAvatarService = async (id: string) => {
  const avatar = await getAvatarByIdRepo(id);
  if (!avatar) throw new Error("AVATAR_NOT_FOUND");

  await cacheDel("avatars:list");
  await cacheDel(`avatars:${id}`);
  await deleteAllUsersCache(); // Avatar deletion affects all users with this avatar

  await deleteAvatarRepo(id);
};
