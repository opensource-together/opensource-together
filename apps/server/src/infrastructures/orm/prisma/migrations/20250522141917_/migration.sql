/*
  Warnings:

  - You are about to drop the column `isFilled` on the `ProjectRole` table. All the data in the column will be lost.
  - You are about to drop the column `projectId` on the `ProjectRole` table. All the data in the column will be lost.
  - You are about to drop the column `roleTitle` on the `ProjectRole` table. All the data in the column will be lost.
  - You are about to drop the column `skillSet` on the `ProjectRole` table. All the data in the column will be lost.
  - You are about to drop the column `teamMembersId` on the `ProjectRole` table. All the data in the column will be lost.
  - You are about to drop the column `projectId` on the `teamMember` table. All the data in the column will be lost.
  - You are about to drop the column `projectRolesId` on the `teamMember` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `teamMember` table. All the data in the column will be lost.
  - Added the required column `is_filled` to the `ProjectRole` table without a default value. This is not possible if the table is not empty.
  - Added the required column `project_id` to the `ProjectRole` table without a default value. This is not possible if the table is not empty.
  - Added the required column `role_title` to the `ProjectRole` table without a default value. This is not possible if the table is not empty.
  - Added the required column `project_id` to the `teamMember` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `teamMember` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ProjectRole" DROP CONSTRAINT "ProjectRole_projectId_fkey";

-- DropForeignKey
ALTER TABLE "teamMember" DROP CONSTRAINT "teamMember_projectId_fkey";

-- AlterTable
ALTER TABLE "ProjectRole" DROP COLUMN "isFilled",
DROP COLUMN "projectId",
DROP COLUMN "roleTitle",
DROP COLUMN "skillSet",
DROP COLUMN "teamMembersId",
ADD COLUMN     "is_filled" BOOLEAN NOT NULL,
ADD COLUMN     "project_id" TEXT NOT NULL,
ADD COLUMN     "role_title" TEXT NOT NULL,
ADD COLUMN     "skill_set" TEXT[],
ADD COLUMN     "team_members_id" TEXT[];

-- AlterTable
ALTER TABLE "teamMember" DROP COLUMN "projectId",
DROP COLUMN "projectRolesId",
DROP COLUMN "userId",
ADD COLUMN     "project_id" TEXT NOT NULL,
ADD COLUMN     "project_roles_id" TEXT[],
ADD COLUMN     "user_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "teamMember" ADD CONSTRAINT "teamMember_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectRole" ADD CONSTRAINT "ProjectRole_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
