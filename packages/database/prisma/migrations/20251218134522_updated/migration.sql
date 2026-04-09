/*
  Warnings:

  - You are about to drop the column `spaceId` on the `SpaceMembers` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[slug]` on the table `Space` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slugId` to the `SpaceMembers` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "SpaceMembers" DROP CONSTRAINT "SpaceMembers_spaceId_fkey";

-- AlterTable
ALTER TABLE "SpaceMembers" DROP COLUMN "spaceId",
ADD COLUMN     "slugId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Space_slug_key" ON "Space"("slug");

-- AddForeignKey
ALTER TABLE "SpaceMembers" ADD CONSTRAINT "SpaceMembers_slugId_fkey" FOREIGN KEY ("slugId") REFERENCES "Space"("slug") ON DELETE RESTRICT ON UPDATE CASCADE;
