/**
 * @swagger
 * tags:
 *   name: Avatars
 *   description: Avatar management APIs
 */

import { Router } from "express";
import {
  uploadAvatar,
  fetchAllAvatar,
  fetchAvatar,
  updateAvatar,
  deleteAvatar,
} from "./avatars.controller.js";
import { imageUpload } from "../../shared/services/multer.service.js";

const router = Router();

/**
 * @swagger
 * /avatars:
 *   post:
 *     summary: Upload a new avatar
 *     tags: [Avatars]
 */
router.post("/", imageUpload.single("walkSheet"), uploadAvatar);

router.get("/", fetchAllAvatar);
router.get("/:id", fetchAvatar);
router.patch("/:id", imageUpload.single("walkSheet"), updateAvatar);
router.delete("/:id", deleteAvatar);

export default router;
