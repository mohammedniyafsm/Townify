import fs from "fs";
import { cacheWrap, cacheDel } from "@repo/cache";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../../shared/services/cloudinary.service.js";
import {
  createMapRepo,
  getAllMapsRepo,
  getMapByIdRepo,
  updateMapRepo,
  deleteMapRepo,
} from "./maps.repository.js";
import { findCreatorsByMapId, findSlugsByMapId } from "../spaces/spaces.repository.js";

const uploadThumbnail = (path: string) =>
  uploadToCloudinary(path, {
    folder: "Townify/thumbnail",
    resource_type: "image",
  });

const safeUnlink = (path?: string) => {
  if (path && fs.existsSync(path)) fs.unlinkSync(path);
};

export const uploadMapService = async (
  name: string,
  thumbnail: Express.Multer.File,
  mapJson: Express.Multer.File
) => {
  if (!name.trim()) throw new Error("INVALID_NAME");

  let parsedJson;
  try {
    parsedJson = JSON.parse(fs.readFileSync(mapJson.path, "utf-8"));
  } catch {
    safeUnlink(mapJson.path);
    safeUnlink(thumbnail.path);
    throw new Error("INVALID_JSON");
  }

  const uploadResult = await uploadThumbnail(thumbnail.path);
  safeUnlink(thumbnail.path);
  safeUnlink(mapJson.path);

  if (!uploadResult.success) throw new Error("UPLOAD_FAILED");

  await cacheDel("maps:list");

  return createMapRepo({
    name: name.trim(),
    thumbnail: uploadResult.result?.secure_url,
    thumbnailId: uploadResult.result?.public_id,
    configJson: parsedJson,
  });
};

export const fetchMapsService = async () => {
  const maps = await cacheWrap("maps:list", 43200, async () => getAllMapsRepo());
  return maps;
};

export const getMapService = async (id: string) => {
  const map = await cacheWrap(`maps:${id}`, 43200, async () => getMapByIdRepo(id));
  if (!map) throw new Error("MAP_NOT_FOUND");
  return map;
};

export const updateMapService = async (
  id: string,
  name?: string,
  thumbnail?: Express.Multer.File,
  mapJson?: Express.Multer.File
) => {
  const map = await cacheWrap(`maps:${id}`, 43200, async () => getMapByIdRepo(id));
  if (!map) throw new Error("MAP_NOT_FOUND");

  const data: any = {};

  if (name?.trim()) data.name = name.trim();

  if (thumbnail) {
    const uploadResult = await uploadThumbnail(thumbnail.path);
    safeUnlink(thumbnail.path);

    if (!uploadResult.success) throw new Error("UPLOAD_FAILED");

    if (map.thumbnailId) await deleteFromCloudinary(map.thumbnailId);

    data.thumbnail = uploadResult.result?.secure_url;
    data.thumbnailId = uploadResult.result?.public_id;
  }

  if (mapJson) {
    try {
      data.configJson = JSON.parse(
        fs.readFileSync(mapJson.path, "utf-8")
      );
    } catch {
      safeUnlink(mapJson.path);
      throw new Error("INVALID_JSON");
    }
    safeUnlink(mapJson.path);
  }

  if (!Object.keys(data).length) throw new Error("NO_UPDATES");

  await cacheDel("maps:list");
  await cacheDel(`maps:${id}`);

  // Map changed - invalidate all users who created spaces with this map
  const affectedCreators = await findCreatorsByMapId(id);
  await Promise.all(
    affectedCreators.map((creatorId : any) => cacheDel(`spaces:user:${creatorId}`))
  );

  // Invalidate all slug caches for spaces using this map
  const affectedSlugs = await findSlugsByMapId(id);
  await Promise.all(
    affectedSlugs.map((slug : any) => cacheDel(`spaces:slug:${slug}`))
  );

  return updateMapRepo(id, data);
};

export const deleteMapService = async (id: string) => {
  const map = await getMapByIdRepo(id);
  if (!map) throw new Error("MAP_NOT_FOUND");

  // Get affected creators before deletion
  const affectedCreators = await findCreatorsByMapId(id);
  const affectedSlugs = await findSlugsByMapId(id);

  if (map.thumbnailId) await deleteFromCloudinary(map.thumbnailId);
  await cacheDel("maps:list");
  await cacheDel(`maps:${id}`);

  // Invalidate all affected users' space caches
  await Promise.all(
    affectedCreators.map((creatorId : any) => cacheDel(`spaces:user:${creatorId}`))
  );

  // Invalidate all slug caches
  await Promise.all(
    affectedSlugs.map((slug : any) => cacheDel(`spaces:slug:${slug}`))
  );

  await deleteMapRepo(id);
};
