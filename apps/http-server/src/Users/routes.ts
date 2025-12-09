import express,{ Router, type Request, type Response} from "express"
import { googleLogin, login, logOut, resendOtp, Signup, updateUserProfile, verifyOTP } from "./controller.js";
import { userMiddleware } from "./middleware.js";
import { imageUpload } from "src/lib/multer.js";

const router:Router =express.Router()

router.post('/login',login)
router.post('/signup',Signup)
router.patch('/user',userMiddleware,imageUpload.single('profile'),updateUserProfile)
router.get('/googlelogin',googleLogin)
router.post('/verify-otp',verifyOTP)
router.post('/resend-otp',resendOtp)
router.post('/logout',userMiddleware,logOut)

export default router; 