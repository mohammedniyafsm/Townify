/*
  Warnings:

  - Added the required column `down` to the `Avatar` table without a default value. This is not possible if the table is not empty.
  - Added the required column `left` to the `Avatar` table without a default value. This is not possible if the table is not empty.
  - Added the required column `right` to the `Avatar` table without a default value. This is not possible if the table is not empty.
  - Added the required column `up` to the `Avatar` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Avatar" ADD COLUMN     "down" TEXT NOT NULL,
ADD COLUMN     "left" TEXT NOT NULL,
ADD COLUMN     "right" TEXT NOT NULL,
ADD COLUMN     "up" TEXT NOT NULL;
