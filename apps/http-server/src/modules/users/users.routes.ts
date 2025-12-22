/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User profile APIs
 */

import { Router } from "express";
import { getUser, updateUserProfile } from "./users.controller.js";
import { userMiddleware } from "../../shared/middleware/auth.middleware.js";
import { imageUpload } from "../../shared/services/multer.service.js";

const router = Router();

/**
 * @swagger
 * /user/me:
 *   get:
 *     summary: Get current logged-in user
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: User profile fetched successfully
 *       401:
 *         description: Unauthorized
 */
router.get("/me", userMiddleware, getUser);

/**
 * @swagger
 * /user/me:
 *   patch:
 *     summary: Update user profile
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               avatarId:
 *                 type: string
 *               profile:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: User updated successfully
 *       400:
 *         description: Invalid input
 */
router.patch(
  "/me",
  userMiddleware,
  imageUpload.single("profile"),
  updateUserProfile
);

export default router;
