/*
  Warnings:

  - Added the required column `thumbnailId` to the `Map` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Map" ADD COLUMN     "thumbnailId" TEXT NOT NULL;
