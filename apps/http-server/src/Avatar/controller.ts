import { cacheWrap,cacheDel } from "@repo/cache";
import { prisma } from "@repo/database";
import type { Request, Response } from "express";
import { uploadToCloudinary } from "src/lib/cloudinary.js";


function avatarUpload(path:string){
    return uploadToCloudinary(path,{folder:"Townify/Avatar"})
}


const uploadAvatar=async(req:Request,res:Response)=>{
    try {
        const {name}=req.body;
        const walkSheet=req.file;
        
        if (!walkSheet) {
            return res.status(400).json({ message: "WalkSheet image is required" });
        }

        if (!name || name.trim().length === 0) {
            return res.status(400).json({ message: "Avatar name is required" });
        }

        const uploadResult = await avatarUpload(walkSheet.path);

        if (!uploadResult.success) {
            return res.status(500).json({ message: "Failed to upload walkSheet image" });
        }

        await cacheDel('avatars:list');
        const avatar=await prisma.avatar.create({
            data:{
                name: name.trim(),
                walkSheet: uploadResult.result?.secure_url || ""
            }
        })
        res.status(200).json({message:"Avatar uploaded successfully",avatar})
    } catch (error) {
       res.status(500).json({ message: "Internal server error" });
    }
}

const fetchAllAvatar=async(req:Request,res:Response)=>{
    try {
        const avatar=await cacheWrap('avatars:list',43200,()=>{
            return prisma.avatar.findMany()
        })
        res.status(200).json({message:"Avatars fetched successfully",avatar})
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}

const fetchAvatar=async(req:Request,res:Response)=>{
    try {
        const {id}=req.params
         if(!id)
        {
            return res.status(400).json({message:"Avatar ID is required"})
        }
        const avatar= await cacheWrap(`avatars:${id}`,400,()=>{
            return prisma.avatar.findUnique({
            where:{
                id:id||""
            }
        })
        })
        if(!avatar)
        {
            res.status(404).json({message:"Avatar not found"})
        }
        res.status(200).json({message:"Avatars fetched successfully",avatar})
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}

const deleteAvatar=async(req:Request,res:Response)=>{
    try {
        const {id}=req.params
        if(!id)
        {
            return res.status(400).json({message:"Avatar ID is required"})
        }
        const avatar= await cacheWrap(`avatars:${id}`,400,()=>{
            return prisma.avatar.findUnique({
            where:{
                id:id||""
            }
        })})
        if(!avatar)
        {
            return res.status(404).json({message:"Avatar not found"})
        }
        await cacheDel(`avatars:${id}`)
        await cacheDel('avatars:list')
        await prisma.avatar.delete({
            where:{
                id:id||''
            }
        })
        res.status(200).json({message:"Avatar deleted successfully"})
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}

const updateAvatar=async(req:Request,res:Response)=>{
    try {
        const {id}=req.params;
        if (!id) {
            return res.status(400).json({ message: "Avatar ID is required" });
        }
        const {name}=req.body;
        const walkSheet=req.file;

        const updateData: any = {};
        if (name && name.trim().length > 0) {
            updateData.name = name.trim();
        }

        if (walkSheet) {
            const uploadResult = await avatarUpload(walkSheet.path);
            if (!uploadResult.success) {
                return res.status(500).json({ message: "Failed to upload walkSheet image" });
            }
            updateData.walkSheet = uploadResult.result?.secure_url || "";
        }

        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ message: "No valid update data provided" });
        }

        await cacheDel('avatars:list');
        await cacheDel(`avatars:${id}`);
        const avatar = await prisma.avatar.update({
            where: { id },
            data: updateData
        });
        res.status(200).json({message:"Avatar updated successfully", avatar});
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}

export {uploadAvatar, fetchAllAvatar, deleteAvatar, updateAvatar,fetchAvatar}