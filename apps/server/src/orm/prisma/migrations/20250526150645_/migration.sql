/*
  Warnings:

  - You are about to drop the column `jointedAt` on the `teamMember` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "teamMember" DROP COLUMN "jointedAt",
ADD COLUMN     "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
