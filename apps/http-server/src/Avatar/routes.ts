import express, { Router } from "express";
import { uploadAvatar, fetchAllAvatar, deleteAvatar, updateAvatar, fetchAvatar } from "./controller.js";
import { imageUpload } from "src/lib/multer.js";

const router: Router = express.Router()

const avatarUpload=imageUpload.fields([
    {name:"up",maxCount:1},
    {name:"down",maxCount:1},
    {name:"left",maxCount:1},
    {name:"right",maxCount:1},
    {name:'idle',maxCount:1}
])

router.post('/',avatarUpload,uploadAvatar)
router.get('/',fetchAllAvatar)
router.delete('/:id',deleteAvatar)
router.patch('/:id',avatarUpload,updateAvatar)
router.get('/:id',fetchAvatar)


export default router