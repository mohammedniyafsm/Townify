import { type Request, type Response } from "express";
import {
  uploadMapService,
  fetchMapsService,
  getMapService,
  updateMapService,
  deleteMapService,
} from "./ maps.service.js";

export const uploadMap = async (req: Request, res: Response) => {
  try {
    const files = req.files as any;
    const map = await uploadMapService(
      req.body.name,
      files.thumbnail?.[0],
      files.mapJson?.[0]
    );
    res.status(201).json({ map });
  } catch (e: any) {
    res.status(400).json({ message: e.message });
  }
};

export const fetchMaps = async (_: Request, res: Response) => {
  const maps = await fetchMapsService();
  res.json({ maps });
};

export const getMap = async (req: Request, res: Response) => {
  try {
    const map = await getMapService(req.params.id as string);
    res.json({ map });
  } catch {
    res.status(404).json({ message: "Map not found" });
  }
};

export const updateMap = async (req: Request, res: Response) => {
  try {
    const files = req.files as any;
    const map = await updateMapService(
      req.params.id as string,
      req.body.name,
      files.thumbnail?.[0],
      files.mapJson?.[0]
    );
    res.json({ map });
  } catch (e: any) {
    res.status(400).json({ message: e.message });
  }
};

export const deleteMap = async (req: Request, res: Response) => {
  try {
    await deleteMapService(req.params.id as string);
    res.json({ message: "Map deleted" });
  } catch {
    res.status(404).json({ message: "Map not found" });
  }
};
