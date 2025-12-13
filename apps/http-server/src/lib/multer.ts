import type { Request } from 'express';
import multer from 'multer';
import fs from 'fs'
import path from 'path'
// import dotenv from 'dotenv';
// dotenv.config();

const uploadDir = path.resolve(process.cwd(), "uploads");

const storage = multer.diskStorage({
  destination(req, file, cb) {
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },

  filename(req, file, cb) {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

function fileFilter(req:Request ,file:Express.Multer.File, cb:multer.FileFilterCallback) {
  const allowedType = (process.env.ALLOWED_IMAGE_TYPES||'').split(",").filter(Boolean);
  if (allowedType.includes(file.mimetype)) {
    cb(null, true);
  } else {
     cb(new Error(`File type ${file.mimetype} not allowed. Allowed types: ${allowedType.join(', ')}`));
  }
}

const imageUpload=multer({
    storage,
    fileFilter
})


export{imageUpload}