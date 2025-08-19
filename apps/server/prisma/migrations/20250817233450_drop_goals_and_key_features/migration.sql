/*
  Warnings:

  - You are about to drop the `KeyFeature` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProjectGoal` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ProjectRoleApplicationKeyFeature` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ProjectRoleApplicationProjectGoal` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "KeyFeature" DROP CONSTRAINT "KeyFeature_projectId_fkey";

-- DropForeignKey
ALTER TABLE "ProjectGoal" DROP CONSTRAINT "ProjectGoal_projectId_fkey";

-- DropForeignKey
ALTER TABLE "_ProjectRoleApplicationKeyFeature" DROP CONSTRAINT "_ProjectRoleApplicationKeyFeature_A_fkey";

-- DropForeignKey
ALTER TABLE "_ProjectRoleApplicationKeyFeature" DROP CONSTRAINT "_ProjectRoleApplicationKeyFeature_B_fkey";

-- DropForeignKey
ALTER TABLE "_ProjectRoleApplicationProjectGoal" DROP CONSTRAINT "_ProjectRoleApplicationProjectGoal_A_fkey";

-- DropForeignKey
ALTER TABLE "_ProjectRoleApplicationProjectGoal" DROP CONSTRAINT "_ProjectRoleApplicationProjectGoal_B_fkey";

-- DropTable
DROP TABLE "KeyFeature";

-- DropTable
DROP TABLE "ProjectGoal";

-- DropTable
DROP TABLE "_ProjectRoleApplicationKeyFeature";

-- DropTable
DROP TABLE "_ProjectRoleApplicationProjectGoal";
