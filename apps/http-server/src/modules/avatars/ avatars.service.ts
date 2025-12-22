import { cacheWrap, cacheDel } from "@repo/cache";
import {
  createAvatarRepo,
  getAllAvatarsRepo,
  getAvatarByIdRepo,
  updateAvatarRepo,
  deleteAvatarRepo,
} from "./avatars.repository.js";
import { uploadToCloudinary } from "../../shared/services/cloudinary.service.js";

const avatarUpload = (path: string) =>
  uploadToCloudinary(path, { folder: "Townify/Avatar" });

export const uploadAvatarService = async (
  name: string,
  walkSheet: Express.Multer.File
) => {
  if (!name.trim()) throw new Error("INVALID_NAME");
  if (!walkSheet) throw new Error("MISSING_WALKSHEET");

  const uploadResult = await avatarUpload(walkSheet.path);
  if (!uploadResult.success) throw new Error("UPLOAD_FAILED");

  await cacheDel("avatars:list");

  return createAvatarRepo({
    name: name.trim(),
    walkSheet: uploadResult.result?.secure_url || "",
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
  walkSheet?: Express.Multer.File
) => {
  const avatar = await getAvatarByIdRepo(id);
  if (!avatar) throw new Error("AVATAR_NOT_FOUND");

  const data: any = {};
  if (name?.trim()) data.name = name.trim();

  if (walkSheet) {
    const uploadResult = await avatarUpload(walkSheet.path);
    if (!uploadResult.success) throw new Error("UPLOAD_FAILED");
    data.walkSheet = uploadResult.result?.secure_url;
  }

  if (!Object.keys(data).length) throw new Error("NO_UPDATES");

  await cacheDel("avatars:list");
  await cacheDel(`avatars:${id}`);

  return updateAvatarRepo(id, data);
};

export const deleteAvatarService = async (id: string) => {
  const avatar = await getAvatarByIdRepo(id);
  if (!avatar) throw new Error("AVATAR_NOT_FOUND");

  await cacheDel("avatars:list");
  await cacheDel(`avatars:${id}`);

  await deleteAvatarRepo(id);
};
