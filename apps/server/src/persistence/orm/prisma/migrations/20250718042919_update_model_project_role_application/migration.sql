/*
  Warnings:

  - You are about to drop the column `userId` on the `ProjectRoleApplication` table. All the data in the column will be lost.
  - Added the required column `profileId` to the `ProjectRoleApplication` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ProjectRoleApplication" DROP CONSTRAINT "ProjectRoleApplication_userId_fkey";

-- AlterTable
ALTER TABLE "ProjectRoleApplication" DROP COLUMN "userId",
ADD COLUMN     "profileId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "ProjectRoleApplication" ADD CONSTRAINT "ProjectRoleApplication_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("userId") ON DELETE CASCADE ON UPDATE CASCADE;
