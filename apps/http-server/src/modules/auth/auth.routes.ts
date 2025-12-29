/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication APIs
 */

import { Router } from "express";
import {
  login,
  signup,
  verifyOTP,
  googleLogin,
  logout,
  resendOtp,
  verifyToken,
} from "./auth.controller.js";
import { userMiddleware } from "src/shared/middleware/auth.middleware.js";

const router:Router = Router();

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login using email & password (OTP based)
 *     tags: [Auth]
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: OTP sent successfully
 *       401:
 *         description: Invalid credentials
 */
router.post("/login", login);

/**
 * @swagger
 * /auth/signup:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password, name]
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Missing required fields
 *       409:
 *         description: User already exists
 */
router.post("/signup", signup);

/**
 * @swagger
 * /auth/verify-otp:
 *   post:
 *     summary: Verify OTP and login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, otp]
 *             properties:
 *               email:
 *                 type: string
 *               otp:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Invalid OTP or params
 *       404:
 *         description: User not found
 */
router.post("/verify-otp", verifyOTP);

/**
 * @swagger
 * /auth/resend-otp:
 *   post:
 *     summary: Resend OTP
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       202:
 *         description: OTP resent
 *       400:
 *         description: Email required
 *       429:
 *         description: Too early to resend
 */
router.post("/resend-otp", resendOtp);

/**
 * @swagger
 * /auth/googlelogin:
 *   get:
 *     summary: Google OAuth login
 *     tags: [Auth]
 *     parameters:
 *       - in: query
 *         name: code
 *         schema:
 *           type: string
 *         required: true
 *         description: Google auth code
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Code required
 *       500:
 *         description: Login failed
 */
router.get("/googlelogin", googleLogin);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout user
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Logged out successfully
 */
router.post("/logout",userMiddleware, logout);

router.get('/verify-token',userMiddleware,verifyToken)



export default router;
