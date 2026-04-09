
import { Router } from "express";
import {
  uploadMap,
  fetchMaps,
  getMap,
  updateMap,
  deleteMap,
} from "./maps.controller.js";
import { mapUpload } from "../../shared/services/multer.service.js";
import { adminMiddleware, userMiddleware } from "../../shared/middleware/auth.middleware.js";

const router:Router = Router();

const mapMulter = mapUpload.fields([
  { name: "thumbnail", maxCount: 1 },
  { name: "mapJson", maxCount: 1 },
]);


router.post("/",adminMiddleware, mapMulter, uploadMap);

router.get("/",userMiddleware, fetchMaps);
router.get("/:id", userMiddleware, getMap);
router.patch("/:id", adminMiddleware, mapMulter, updateMap);
router.delete("/:id", adminMiddleware, deleteMap);

export default router;
