import { Router } from "express";
import { getToken } from "./livekit.controller.js";
import { userMiddleware } from "../../shared/middleware/auth.middleware.js";

const router: Router = Router();

router.post("/token", userMiddleware, getToken);

export default router;
