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
import { adminMiddleware } from "src/shared/middleware/auth.middleware.js";

const router:Router = Router();

/**
 * @swagger
 * /avatars:
 *   post:
 *     summary: Upload a new avatar
 *     tags: [Avatars]
 */

const avatarUpload=()=>{
  return imageUpload.fields([
    {name: 'walkSheet', maxCount: 1},
   { name: 'idle', maxCount: 1}
  ])
}
router.post("/", adminMiddleware,avatarUpload(), uploadAvatar);

router.get("/", fetchAllAvatar);
router.get("/:id", fetchAvatar);
router.patch("/:id", adminMiddleware,avatarUpload(), updateAvatar);
router.delete("/:id", adminMiddleware,deleteAvatar);

export default router;
