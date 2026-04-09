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
import { userMiddleware } from "../../shared/middleware/auth.middleware.js";

const router:Router = Router();

router.post("/login", login);
router.post("/signup", signup);
router.post("/verify-otp", verifyOTP);
router.post("/resend-otp", resendOtp);
router.get("/googlelogin", googleLogin);
router.post("/logout",userMiddleware, logout);

router.get('/verify-token',userMiddleware,verifyToken)



export default router;
