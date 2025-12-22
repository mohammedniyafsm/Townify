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
  return cacheWrap("maps:list", 43200, getAllMapsRepo);
};

export const getMapService = async (id: string) => {
  const map = await cacheWrap(`maps:${id}`, 43200, () =>
    getMapByIdRepo(id)
  );
  if (!map) throw new Error("MAP_NOT_FOUND");
  return map;
};

export const updateMapService = async (
  id: string,
  name?: string,
  thumbnail?: Express.Multer.File,
  mapJson?: Express.Multer.File
) => {
  const map = await getMapByIdRepo(id);
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

  return updateMapRepo(id, data);
};

export const deleteMapService = async (id: string) => {
  const map = await getMapByIdRepo(id);
  if (!map) throw new Error("MAP_NOT_FOUND");

  if (map.thumbnailId) await deleteFromCloudinary(map.thumbnailId);

  await cacheDel("maps:list");
  await cacheDel(`maps:${id}`);

  await deleteMapRepo(id);
};
