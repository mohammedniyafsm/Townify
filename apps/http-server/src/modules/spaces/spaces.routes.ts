/**
 * @swagger
 * tags:
 *   name: Spaces
 *   description: Space management APIs
 */

import { Router } from "express";
import { userMiddleware } from "../../shared/middleware/auth.middleware.js";
import {
  createSpace,
  updateSpace,
  deleteSpace,
  joinSpace,
  leaveSpace,
  blockUser,
  sendInvitation,
  getUserSpaces,
  findSpaceBySlug,
} from "./spaces.controller.js";

const router:Router = Router();

/**
 * @swagger
 * /spaces:
 *   post:
 *     summary: Create a new space
 *     tags: [Spaces]
 */
router.post("/", userMiddleware, createSpace);

router.get("/user", userMiddleware, getUserSpaces);
router.get("/:slug", userMiddleware, findSpaceBySlug);
router.post("/join/:slug", userMiddleware, joinSpace);
router.post("/leave/:slug", userMiddleware, leaveSpace);
router.post("/block/:slug/:userIdToBlock", userMiddleware, blockUser);
router.post("/email-invitation", userMiddleware, sendInvitation);
router.patch("/:id", userMiddleware, updateSpace);
router.delete("/:id", userMiddleware, deleteSpace);

export default router;
