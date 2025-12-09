import type { Request } from 'express';
import multer from 'multer';
// import dotenv from 'dotenv';
// dotenv.config();

const storage=multer.diskStorage({
    destination:function(req,file,cb)
    {
        cb(null,'./uploads/')
    },
    filename:function(req,file,cb)
    {
        cb(null,file.originalname+'_'+Date.now())
    }
})

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