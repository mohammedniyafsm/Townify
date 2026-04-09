/*
  Warnings:

  - You are about to drop the column `isActive` on the `SpaceMembers` table. All the data in the column will be lost.
  - You are about to drop the column `slugId` on the `SpaceMembers` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[spaceId,userId]` on the table `SpaceMembers` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `spaceId` to the `SpaceMembers` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "MemberStatus" AS ENUM ('active', 'blocked');

-- CreateEnum
CREATE TYPE "InviteType" AS ENUM ('email', 'link');

-- CreateEnum
CREATE TYPE "InviteStatus" AS ENUM ('pending', 'approved', 'rejected');

-- DropForeignKey
ALTER TABLE "SpaceMembers" DROP CONSTRAINT "SpaceMembers_slugId_fkey";

-- AlterTable
-- ALTER TABLE "Space" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "SpaceMembers" DROP COLUMN "isActive",
DROP COLUMN "slugId",
ADD COLUMN     "spaceId" TEXT NOT NULL,
ADD COLUMN     "status" "MemberStatus" NOT NULL DEFAULT 'active';

-- CreateTable
CREATE TABLE "SpaceInvite" (
    "id" TEXT NOT NULL,
    "spaceId" TEXT NOT NULL,
    "email" TEXT,
    "userId" TEXT,
    "type" "InviteType" NOT NULL,
    "status" "InviteStatus" NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SpaceInvite_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SpaceInvite_spaceId_email_key" ON "SpaceInvite"("spaceId", "email");

-- CreateIndex
CREATE UNIQUE INDEX "SpaceMembers_spaceId_userId_key" ON "SpaceMembers"("spaceId", "userId");

-- AddForeignKey
ALTER TABLE "SpaceMembers" ADD CONSTRAINT "SpaceMembers_spaceId_fkey" FOREIGN KEY ("spaceId") REFERENCES "Space"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpaceInvite" ADD CONSTRAINT "SpaceInvite_spaceId_fkey" FOREIGN KEY ("spaceId") REFERENCES "Space"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
