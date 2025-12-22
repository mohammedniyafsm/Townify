import express, { Router } from "express";
import { uploadAvatar, fetchAllAvatar, deleteAvatar, updateAvatar, fetchAvatar } from "./controller.js";
import { imageUpload } from "src/lib/multer.js";

const router: Router = express.Router()

router.post('/',imageUpload.single('walkSheet'),uploadAvatar)
router.get('/',fetchAllAvatar)
router.delete('/:id',deleteAvatar)
router.patch('/:id',imageUpload.single('walkSheet'),updateAvatar)
router.get('/:id',fetchAvatar)


export default router