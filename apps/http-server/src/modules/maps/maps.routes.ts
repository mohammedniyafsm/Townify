/**
 * @swagger
 * tags:
 *   name: Maps
 *   description: Map management APIs
 */

import { Router } from "express";
import {
  uploadMap,
  fetchMaps,
  getMap,
  updateMap,
  deleteMap,
} from "./maps.controller.js";
import { mapUpload } from "../../shared/services/multer.service.js";

const router:Router = Router();

const mapMulter = mapUpload.fields([
  { name: "thumbnail", maxCount: 1 },
  { name: "mapJson", maxCount: 1 },
]);

/**
 * @swagger
 * /maps:
 *   post:
 *     summary: Upload a new map
 *     tags: [Maps]
 */
router.post("/", mapMulter, uploadMap);

router.get("/", fetchMaps);
router.get("/:id", getMap);
router.patch("/:id", mapMulter, updateMap);
router.delete("/:id", deleteMap);

export default router;
