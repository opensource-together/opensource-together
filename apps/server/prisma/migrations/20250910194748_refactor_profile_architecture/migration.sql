/*
  Warnings:

  - You are about to drop the column `company` on the `profile` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `profile` table. All the data in the column will be lost.
  - You are about to drop the column `techStackId` on the `user` table. All the data in the column will be lost.

*/
-- AlterEnum
ALTER TYPE "SocialLinkType" ADD VALUE 'DISCORD';

-- DropForeignKey
ALTER TABLE "user" DROP CONSTRAINT "user_techStackId_fkey";

-- AlterTable
ALTER TABLE "profile" DROP COLUMN "company",
DROP COLUMN "location";

-- AlterTable
ALTER TABLE "user" DROP COLUMN "techStackId";

-- CreateTable
CREATE TABLE "_ProfileToTechStack" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ProfileToTechStack_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_ProfileToTechStack_B_index" ON "_ProfileToTechStack"("B");

-- AddForeignKey
ALTER TABLE "_ProfileToTechStack" ADD CONSTRAINT "_ProfileToTechStack_A_fkey" FOREIGN KEY ("A") REFERENCES "profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProfileToTechStack" ADD CONSTRAINT "_ProfileToTechStack_B_fkey" FOREIGN KEY ("B") REFERENCES "TechStack"("id") ON DELETE CASCADE ON UPDATE CASCADE;
