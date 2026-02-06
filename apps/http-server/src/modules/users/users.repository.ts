import { prisma } from "@repo/database";

export const getUserById = (id: string) => {
    return prisma.user.findUnique({
        where: { id },
        include: {
            avatar: true,
            space: true,
        },
        omit: {
            password: true,
        }
    });
};

export const updateUser = (id: string, data: any) => {
    return prisma.user.update({
        where: { id },
        data,
        include: {
            avatar: true,
            space: true,
        },
    });
};
