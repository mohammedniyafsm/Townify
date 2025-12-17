import { cacheWrap, cacheDel } from "@repo/cache";
import { prisma } from "@repo/database";
import type { Request, Response } from "express";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "src/lib/cloudinary.js";
import fs from "fs";

function thumbnailUpload(path: string) {
  return uploadToCloudinary(path, {
    folder: "Townify/thumbnail",
    resource_type: "image",
  });
}

const uploadMap = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const thumbnail = files?.thumbnail?.[0];
    const mapJson = files?.mapJson?.[0];

    if (!name || name.trim().length === 0) {
      return res.status(400).json({ message: "Map name is required" });
    }

    if (!thumbnail) {
      return res.status(400).json({ message: "Thumbnail image is required" });
    }

    if (!mapJson) {
      return res.status(400).json({ message: "Map JSON file is required" });
    }

    let parsedJson;
    try {
      const jsonContent = fs.readFileSync(mapJson.path, "utf-8");
      parsedJson = JSON.parse(jsonContent);
      fs.existsSync(mapJson.path) && fs.unlinkSync(mapJson.path);
    } catch (error) {
      if (fs.existsSync(mapJson.path)) fs.unlinkSync(mapJson.path);
      if (fs.existsSync(thumbnail.path)) fs.unlinkSync(thumbnail.path);
      return res.status(400).json({ message: "Invalid JSON file format" });
    }
    const thumbnailResult = await thumbnailUpload(thumbnail.path);

    fs.existsSync(thumbnail.path) && fs.unlinkSync(thumbnail.path);
    if (!thumbnailResult.success) {
      return res
        .status(500)
        .json({ message: "Failed to upload thumbnail image" });
    }

    await cacheDel("maps:list");

    const map = await prisma.map.create({
      data: {
        thumbnail: thumbnailResult.result?.secure_url || "",
        thumbnailId: thumbnailResult.result?.public_id || "",
        name: name.trim(),
        configJson: parsedJson,
      },
    });

    res.status(200).json({ message: "Map uploaded successfully", map });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const fetchMaps = async (req: Request, res: Response) => {
  try {
    const maps = await cacheWrap("maps:list", 43200, async () => {
      return await prisma.map.findMany();
    });

    res.status(200).json({ message: "Maps fetched successfully", maps });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getMap = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Map ID is required" });
    }
    const map = await cacheWrap(`maps:${id}`, 43200, async () => {
      return await prisma.map.findUnique({
        where: {
          id,
        },
      });
    });

    if (!map) {
      return res.status(404).json({ message: "Map not found" });
    }

    res.status(200).json({ message: "Map fetched successfully", map });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateMap = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const thumbnail = files?.thumbnail?.[0];
    const mapJson = files?.mapJson?.[0];

    if (!id) {
      return res.status(400).json({ message: "Map ID is required" });
    }

    const existingMap = await prisma.map.findUnique({
      where: {
        id,
      },
    });

    if (!existingMap) {
      return res.status(404).json({ message: "Map not found" });
    }

    const updateData: any = {};

    if (name && name.trim().length > 0) {
      updateData.name = name.trim();
    }

    if (thumbnail) {
      console.log(thumbnail);
      console.log(fs.existsSync(thumbnail.path));
      if (!fs.existsSync(thumbnail.path)) {
        throw new Error("File does not exist before upload");
      }

      const thumbnailResult = await thumbnailUpload(thumbnail.path);
      console.log(thumbnailResult);
      fs.existsSync(thumbnail.path) && fs.unlinkSync(thumbnail.path);

      if (!thumbnailResult.success) {
        return res
          .status(500)
          .json({ message: "Failed to upload thumbnail image" });
      }

      if (existingMap.thumbnailId) {
        await deleteFromCloudinary(existingMap.thumbnailId);
      }

      updateData.thumbnail = thumbnailResult.result?.secure_url || "";
      updateData.thumbnailId = thumbnailResult.result?.public_id || "";
    }

    if (mapJson) {
      let parsedJson;
      try {
        const jsonContent = fs.readFileSync(mapJson.path, "utf-8");
        parsedJson = JSON.parse(jsonContent);
        if (fs.existsSync(mapJson.path)) fs.unlinkSync(mapJson.path);
      } catch (error) {
        if (fs.existsSync(mapJson.path)) fs.unlinkSync(mapJson.path);
        return res.status(400).json({ message: "Invalid JSON file format" });
      }
      updateData.configJson = parsedJson;
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: "No valid update data provided" });
    }

    await cacheDel("maps:list");
    await cacheDel(`maps:${id}`);

    const updatedMap = await prisma.map.update({
      where: {
        id,
      },
      data: updateData,
    });

    res
      .status(200)
      .json({ message: "Map updated successfully", map: updatedMap });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const deleteMap = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Map ID is required" });
    }

    const existingMap = await prisma.map.findUnique({
      where: {
        id,
      },
    });
    if (!existingMap) {
      return res.status(404).json({ message: "Map not found" });
    }

    if (existingMap.thumbnailId) {
      await deleteFromCloudinary(existingMap.thumbnailId);
    }

    await cacheDel("maps:list");
    await cacheDel(`maps:${id}`);

    await prisma.map.delete({
      where: {
        id,
      },
    });

    res.status(200).json({ message: "Map deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export { uploadMap, updateMap, deleteMap, fetchMaps, getMap };
