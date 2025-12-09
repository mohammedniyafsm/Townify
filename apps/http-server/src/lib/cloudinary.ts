import fs from 'fs'
import {v2 as cloudinary} from 'cloudinary'

const cloud_name= process.env.CLOUD_NAME as string
const api_key= process.env.CLOUD_API as string
const api_secret= process.env.CLOUD_SECRET as string
cloudinary.config({
  cloud_name:cloud_name,
  api_key: api_key,
  api_secret: api_secret,
});

const uploadToCloudinary = async (filePath:string, option = {}) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      ...option,
    });
    fs.unlinkSync(filePath);
    return { success: true, result };
  } catch (error) {
    fs.unlinkSync(filePath);
    return { success: false, error };
  }
};

const deleteFromCloudinary=async(public_id:string,option={})=>{
  try {
    const result=await cloudinary.uploader.destroy(public_id,option)
    return {result,success:true}
  } catch (error) {
    return {error,success:false}
  }
}


export {uploadToCloudinary,deleteFromCloudinary};