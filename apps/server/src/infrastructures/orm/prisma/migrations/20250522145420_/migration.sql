/*
  Warnings:

  - You are about to drop the column `is_filled` on the `ProjectRole` table. All the data in the column will be lost.
  - You are about to drop the column `project_id` on the `ProjectRole` table. All the data in the column will be lost.
  - You are about to drop the column `role_title` on the `ProjectRole` table. All the data in the column will be lost.
  - You are about to drop the column `skill_set` on the `ProjectRole` table. All the data in the column will be lost.
  - You are about to drop the column `team_members_id` on the `ProjectRole` table. All the data in the column will be lost.
  - You are about to drop the column `project_id` on the `teamMember` table. All the data in the column will be lost.
  - You are about to drop the column `project_roles_id` on the `teamMember` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `teamMember` table. All the data in the column will be lost.
  - Added the required column `isFilled` to the `ProjectRole` table without a default value. This is not possible if the table is not empty.
  - Added the required column `projectId` to the `ProjectRole` table without a default value. This is not possible if the table is not empty.
  - Added the required column `roleTitle` to the `ProjectRole` table without a default value. This is not possible if the table is not empty.
  - Added the required column `projectId` to the `teamMember` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `teamMember` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ProjectRole" DROP CONSTRAINT "ProjectRole_project_id_fkey";

-- DropForeignKey
ALTER TABLE "teamMember" DROP CONSTRAINT "teamMember_project_id_fkey";

-- AlterTable
ALTER TABLE "ProjectRole" DROP COLUMN "is_filled",
DROP COLUMN "project_id",
DROP COLUMN "role_title",
DROP COLUMN "skill_set",
DROP COLUMN "team_members_id",
ADD COLUMN     "isFilled" BOOLEAN NOT NULL,
ADD COLUMN     "projectId" TEXT NOT NULL,
ADD COLUMN     "roleTitle" TEXT NOT NULL,
ADD COLUMN     "skillSet" TEXT[],
ADD COLUMN     "teamMembersId" TEXT[];

-- AlterTable
ALTER TABLE "teamMember" DROP COLUMN "project_id",
DROP COLUMN "project_roles_id",
DROP COLUMN "user_id",
ADD COLUMN     "projectId" TEXT NOT NULL,
ADD COLUMN     "projectRolesId" TEXT[],
ADD COLUMN     "userId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "teamMember" ADD CONSTRAINT "teamMember_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectRole" ADD CONSTRAINT "ProjectRole_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
