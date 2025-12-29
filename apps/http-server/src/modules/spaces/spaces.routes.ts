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
  sendInvitation,
  getUserSpaces,
  findSpaceBySlug,
  requestAccessToSpace,
  checkSpaceAccess,
  removeInvites,
  approveRequestAccess,
  toggleMember,
  bulkRemoveInvites,
  bulkApproveInvites,
  getSpaceManageDetails,
} from "./spaces.controller.js";

const router:Router = Router();

/**
 * @swagger
 * /spaces:
 *   post:
 *     summary: Create a new space
 *     tags: [Spaces]
 */



// ---------- READ / ACCESS ----------
router.get("/user", userMiddleware, getUserSpaces);
router.get("/access/:slug", userMiddleware, checkSpaceAccess);

// ---------- JOIN FLOW ----------
router.post("/join/:slug", userMiddleware, joinSpace);
router.post("/request-access/:slug", userMiddleware, requestAccessToSpace);
router.post("/leave/:slug", userMiddleware, leaveSpace);

// ---------- OWNER ACTIONS ----------
router.patch("/toogle/:slug/:userId", userMiddleware, toggleMember);
router.post("/email-invitation", userMiddleware, sendInvitation);
router.delete("/invites/:id", userMiddleware, removeInvites);
router.patch("/approve-invite/:inviteId",userMiddleware,approveRequestAccess);
router.delete('/bulk-remove/:slug',userMiddleware, bulkRemoveInvites);
router.patch('/bulk-approve/:slug',userMiddleware, bulkApproveInvites);
// ---------- SPACE MANAGEMENT ----------
router.patch("/:id", userMiddleware, updateSpace);
router.delete("/:id", userMiddleware, deleteSpace);
router.post("/", userMiddleware, createSpace);



// ---------- ALWAYS LAST ----------
router.get("/:slug", userMiddleware, findSpaceBySlug);
router.get('/creator/:slug',userMiddleware, getSpaceManageDetails);



export default router;
