/*
  Warnings:

  - You are about to drop the column `down` on the `Avatar` table. All the data in the column will be lost.
  - You are about to drop the column `idle` on the `Avatar` table. All the data in the column will be lost.
  - You are about to drop the column `left` on the `Avatar` table. All the data in the column will be lost.
  - You are about to drop the column `right` on the `Avatar` table. All the data in the column will be lost.
  - You are about to drop the column `up` on the `Avatar` table. All the data in the column will be lost.
  - Added the required column `walkSheet` to the `Avatar` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Avatar" DROP COLUMN "down",
DROP COLUMN "idle",
DROP COLUMN "left",
DROP COLUMN "right",
DROP COLUMN "up",
ADD COLUMN     "walkSheet" TEXT NOT NULL;
