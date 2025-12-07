import express,{ Router, type Request, type Response} from "express"
import { googleLogin, login, Signup, verifyOTP } from "./controller.js";
import { userMiddleware } from "./middleware.js";

const router:Router =express.Router()

router.post('/login',login)
router.post('/signup',Signup)
router.get('/googlelogin',googleLogin)
router.post('/verify-otp',verifyOTP)

export default router; 