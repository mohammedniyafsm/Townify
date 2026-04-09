import { Router } from "express";
import { getUser, updateUserProfile } from "./users.controller.js";
import { userMiddleware } from "../../shared/middleware/auth.middleware.js";
import { imageUpload } from "../../shared/services/multer.service.js";

const router:Router = Router();


router.get("/me", userMiddleware, getUser);
router.patch(
  "/me",
  userMiddleware,
  imageUpload.single("profile"),
  updateUserProfile
);

export default router;
