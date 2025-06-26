/*
  Warnings:

  - You are about to drop the column `projectRoles` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the `ProjectRoles` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProjectTeamMember` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `difficulty` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `github` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Difficulty" AS ENUM ('EASY', 'MEDIUM', 'HARD');

-- DropForeignKey
ALTER TABLE "ProjectTeamMember" DROP CONSTRAINT "ProjectTeamMember_project_id_fkey";

-- AlterTable
ALTER TABLE "Project" DROP COLUMN "projectRoles",
ADD COLUMN     "difficulty" "Difficulty" NOT NULL,
ADD COLUMN     "github" TEXT NOT NULL;

-- DropTable
DROP TABLE "ProjectRoles";

-- DropTable
DROP TABLE "ProjectTeamMember";

-- CreateTable
CREATE TABLE "teamMember" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "projectRolesId" TEXT[],
    "jointedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "teamMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectRole" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "teamMembersId" TEXT[],
    "roleTitle" TEXT NOT NULL,
    "skillSet" TEXT[],
    "description" TEXT NOT NULL,
    "isFilled" BOOLEAN NOT NULL,

    CONSTRAINT "ProjectRole_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ProjectRoleToteamMember" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ProjectRoleToteamMember_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_ProjectRoleToteamMember_B_index" ON "_ProjectRoleToteamMember"("B");

-- AddForeignKey
ALTER TABLE "teamMember" ADD CONSTRAINT "teamMember_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectRole" ADD CONSTRAINT "ProjectRole_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProjectRoleToteamMember" ADD CONSTRAINT "_ProjectRoleToteamMember_A_fkey" FOREIGN KEY ("A") REFERENCES "ProjectRole"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProjectRoleToteamMember" ADD CONSTRAINT "_ProjectRoleToteamMember_B_fkey" FOREIGN KEY ("B") REFERENCES "teamMember"("id") ON DELETE CASCADE ON UPDATE CASCADE;
