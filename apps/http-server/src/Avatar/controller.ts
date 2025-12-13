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
        const up=(req.files as { [fieldname: string]: Express.Multer.File[] })?.up?.[0]
        const down=(req.files as { [fieldname: string]: Express.Multer.File[] })?.down?.[0]
        const left=(req.files as { [fieldname: string]: Express.Multer.File[] })?.left?.[0]
        const right=(req.files as { [fieldname: string]: Express.Multer.File[] })?.right?.[0]
        const idle=(req.files as { [fieldname: string]: Express.Multer.File[] })?.idle?.[0]
        if (!up || !down || !left || !right||!idle) {
            return res.status(400).json({ message: "All five avatar images (up, down, left, right,idle) are required" });
        }
        const [upUrl,downUrl,leftUrl,rightUrl,idleUrl]=await Promise.all([
            avatarUpload(up.path),
            avatarUpload(down.path),
            avatarUpload(left.path),
            avatarUpload(right.path),
            avatarUpload(idle.path)
        ])

        if (!upUrl.success || !downUrl.success || !leftUrl.success || !rightUrl.success) {
            return res.status(500).json({ message: "Failed to upload one or more avatar images" });
        }
        await cacheDel('avatars:list')
        const avatar=await prisma.avatar.create({
            data:{
                name:name,
                up:upUrl.result?.secure_url || "",
                down:downUrl.result?.secure_url || "",
                left:leftUrl.result?.secure_url || "",
                right:rightUrl.result?.secure_url || "",
                idle:idleUrl.result?.secure_url||""
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
        const up=(req.files as { [fieldname: string]: Express.Multer.File[] })?.up?.[0]
        const down=(req.files as { [fieldname: string]: Express.Multer.File[] })?.down?.[0]
        const left=(req.files as { [fieldname: string]: Express.Multer.File[] })?.left?.[0]
        const right=(req.files as { [fieldname: string]: Express.Multer.File[] })?.right?.[0]
        const idle=(req.files as { [fieldname: string]: Express.Multer.File[] })?.idle?.[0]
        const updateData: any = {};
        if (name) updateData.name = name;

        const uploads = [];
        if (up) uploads.push(avatarUpload(up.path).then(result => ({ key: 'up', ...result })));
        if (down) uploads.push(avatarUpload(down.path).then(result => ({ key: 'down', ...result })));
        if (left) uploads.push(avatarUpload(left.path).then(result => ({ key: 'left', ...result })));
        if (right) uploads.push(avatarUpload(right.path).then(result => ({ key: 'right', ...result })));
        if (idle) uploads.push(avatarUpload(idle.path).then(result => ({ key: 'idle', ...result })));

        const results = await Promise.all(uploads);
        for (const result of results) {
            if (!result.success) {
                return res.status(500).json({ message: `Failed to upload ${result.key} image` });
            }
            updateData[result.key] = result.result?.secure_url || "";
        }

        await cacheDel('avatars:list')
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