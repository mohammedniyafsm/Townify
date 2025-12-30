import { cacheDel } from "@repo/cache/dist/index.js";
import { uploadToCloudinary } from "../../shared/services/cloudinary.service.js";
import { getUserById, updateUser } from "./users.repository.js";
import fs from 'fs'

export const getUserService = async (userId: string) => {
    const user = await getUserById(userId);
    if (!user) throw new Error("USER_NOT_FOUND");
    return user;
};

interface UpdateUserInput {
    userId: string;
    name?: string | undefined;
    avatarId?: string | undefined;
    file?: Express.Multer.File | undefined;
}

export const updateUserProfileService = async ({
    userId,
    name,
    avatarId,
    file,
}: UpdateUserInput) => {
    if (name !== undefined && name.trim().length < 1) {
        throw new Error("INVALID_NAME");
    }

    const existingUser = await getUserById(userId);
    if (!existingUser) throw new Error("USER_NOT_FOUND");

    const data: any = {};

    if (name) data.name = name.trim();
    if (avatarId) data.avatarId = avatarId;

    if (file) {
        const { success, result } = await uploadToCloudinary(file.path, {
            folder: "townify/users",
        });
        if(fs.existsSync(file.path)) fs.unlinkSync(file.path)
        if (!success) throw new Error("UPLOAD_FAILED");

        data.profile = result?.secure_url;
    }
    await cacheDel("users:list")
    return updateUser(userId, data);
};
