import { Router } from "express";
import {
  uploadAvatar,
  fetchAllAvatar,
  fetchAvatar,
  updateAvatar,
  deleteAvatar,
} from "./avatars.controller.js";
import { imageUpload } from "../../shared/services/multer.service.js";
import { adminMiddleware } from "../../shared/middleware/auth.middleware.js";

const router:Router = Router();


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
