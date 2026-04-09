import type { Request } from 'express';
import multer from 'multer';
import fs from 'fs'
import path from 'path'
import crypto from "crypto";

const uploadDir = path.resolve(process.cwd(), "uploads");

const storage = multer.diskStorage({
  destination(req, file, cb) {
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },

  filename(req, file, cb) {
     const ext = path.extname(file.originalname);
     const uniqueName = `${crypto.randomUUID()}${ext}`;
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

function mapFileFilter(req:Request ,file:Express.Multer.File, cb:multer.FileFilterCallback) {
  const allowedImageTypes = (process.env.ALLOWED_IMAGE_TYPES||'').split(",").filter(Boolean);
  const allowedJsonTypes = ['application/json', 'text/plain']; // text/plain for .json files
  
  if (file.fieldname === 'thumbnail') {
    if (allowedImageTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`Thumbnail must be an image. Allowed types: ${allowedImageTypes.join(', ')}`));
    }
  }
  // Check if field is mapJson - must be JSON
  else if (file.fieldname === 'mapJson') {
    if (allowedJsonTypes.includes(file.mimetype) || file.originalname.endsWith('.json')) {
      cb(null, true);
    } else {
      cb(new Error(`Map file must be a JSON file`));
    }
  }
  else {
    cb(new Error(`Unexpected field: ${file.fieldname}`));
  }
}

const imageUpload=multer({
    storage,
    fileFilter
})

const mapUpload=multer({
    storage,
    fileFilter: mapFileFilter,
    limits: { fileSize: 70 * 1024 * 1024 } // 70MB limit
})


export{imageUpload, mapUpload}