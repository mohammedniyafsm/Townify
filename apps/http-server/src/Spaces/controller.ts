import { prisma } from "@repo/database"
import type { Request, Response } from "express"


const createSpace=async(req:Request,res:Response)=>{
    try {
        const userId=req.user?.userId
        const {name,mapId}=req.body
        if(!name||name.trim().length===0)
        {
            return res.status(400).json({message:"Space name is required"})
        }
        const space=await prisma.space.create({
            data:{
                name,
                creatorId:userId||'',
                mapId
            }
        })
        const spaceMember=await prisma.spaceMembers.create({
            data:{
                slugId:space.slug,
                userId:userId||""
            }
        })
        res.status(200).json({message:"Space created successfully",space,spaceMember})
    } catch (error) {
        res.status(500).json({message:"Internal server error"})
    }
}

const updateSpace=async(req:Request,res:Response)=>{
    try {
        const {id}=req.params
        const {name,mapId}=req.body
        const updatedData:{name?:string,mapId?:string}={}
        if(name&&name.trim().length>0)
        {
            updatedData.name=name.trim()
        }
        if(mapId&&mapId.trim().length>0)
        {
            updatedData.mapId=mapId.trim()
        }
        const existingSpace=await prisma.space.findUnique({
            where:{
                id:id||""   
            }
        })
        if(!existingSpace)
        {
            return res.status(404).json({message:"Space not found"})
        }
        const updateSpace=await prisma.space.update({
            where:{
                id:id||""
            },
            data:updatedData,
            include:{
                spaceMembers:true
            }
        })
        res.status(200).json({message:"Space updated successfully",space:updateSpace})
    } catch (error) {
        res.status(500).json({message:"Internal server error"})
    }
}

const deleteSpace=async(req:Request,res:Response)=>{
    try {
        const userId = req.user?.userId
        const {id} = req.params

        if (!id) return res.status(400).json({ message: "Space ID is required" })

        const space = await prisma.space.findUnique({ where: { id: id || "" } })
        if (!space) return res.status(404).json({ message: "Space not found" })

        if (space.creatorId !== userId) {
            return res.status(403).json({ message: "Forbidden: only the creator can delete this space" })
        }

        await prisma.$transaction([
            prisma.spaceMembers.deleteMany({ where: { slugId:space.slug } }),
            prisma.space.delete({ where: { id } })
        ])

        return res.status(200).json({ message: "Space deleted successfully" })
    } catch (error) {
        console.error("Error deleting space:", error)
        return res.status(500).json({ message: "Internal server error" })
    }
}

const getSpace=async(req:Request,res:Response)=>{
    try {
        const {id}=req.params
        if(!id)
        {
            return res.status(400).json({message:"Space ID is required"})
        }
        const space=await prisma.space.findUnique({
            where:{
                id:id||""
            },
            include:{
                spaceMembers:true
            }
        })
        if(!space)
        {
            return res.status(404).json({message:"Space not found"})
        }
        res.status(200).json({message:"Space fetched successfully",space})
    } catch (error) {
        res.status(500).json({message:"Internal server error"})
    }
}


const getSpaceByUser=async(req:Request,res:Response)=>{
    try {
        const userId=req.user?.userId
        const space=await prisma.space.findMany({
            where:{
                creatorId:userId||""
            },
            include:{
                spaceMembers:true,
                map:true
            }
        })
        res.status(200).json({message:"Space fetched successfully",space})
    } catch (error) {
        res.status(500).json({message:"Internal server error"})
    }
}


const joinSpace=async(req:Request,res:Response)=>{
    try {
    const userId=req.user?.userId
    const {slug}=req.params
    const space=await prisma.space.findUnique({
        where:{
            slug:slug||""   
        }
    })
    if(!space)
    {
        return res.status(404).json({message:"Space not found"})
    }
    const existingMember=await prisma.spaceMembers.findFirst({
        where:{
            slugId:slug||"",    
            userId:userId||""
        }
    })
    if(existingMember)
    {
        return res.status(400).json({message:"User already a member of the space"})
    }
    const spaceMembers=await prisma.spaceMembers.create({
        data:{
            slugId:slug||'',
            userId:userId||''
        }
    })
    res.status(200).json({message:"Joined space successfully",spaceMembers})
    } catch (error) {
        res.status(500).json({message:"Internal server error"})
    }
}


const leaveSpace=async(req:Request,res:Response)=>{
    try{
        const userId=req.user?.userId
        const {slug}=req.params
        const space=await prisma.space.findUnique({
            where:{
                slug:slug||""   
            }
        })      
        if(!space)
        {
            return res.status(404).json({message:"Space not found"})
        }
        const existingMember=await prisma.spaceMembers.findFirst({
            where:{
                slugId:slug||"",        
                userId:userId||""           
            }   
        })
        if(!existingMember)
        {
            return res.status(400).json({message:"User is not a member of the space"})
        }
        await prisma.spaceMembers.delete({
            where:{
                id:existingMember.id    
            }       
        })
        res.status(200).json({message:"Left space successfully"})
    }catch(error){
        res.status(500).json({message:"Internal server error"})
    }
}

const blockUserInSpace=async(req:Request,res:Response)=>{
    try {
        const {slug,userIdToBlock}=req.params
        const userId=req.user?.userId
        const space=await prisma.space.findUnique({
            where:{
                slug:slug||""   
            }       
        })
        if(!space)
        {
            return res.status(404).json({message:"Space not found"})
        }
        if(space.creatorId!==userId)
        {
            return res.status(403).json({message:"Only the creator can block users in this space"})
        }
                const member = await prisma.spaceMembers.findFirst({
                    where: { slugId:slug||"", userId: userIdToBlock || "" }
                })

                if (!member) {
                    return res.status(404).json({ message: "User is not a member of this space" })
                }

                const blockedMember = await prisma.spaceMembers.update({
                    where: { id: member.id },
                    data: { isActive: false }
                })

                res.status(200).json({ message: "User blocked successfully in the space", blockedMember })
    } catch (error) {
        res.status(500).json({message:"Internal server error"})
    }
}

export {createSpace,getSpace,updateSpace,joinSpace,deleteSpace,leaveSpace,blockUserInSpace,getSpaceByUser}
