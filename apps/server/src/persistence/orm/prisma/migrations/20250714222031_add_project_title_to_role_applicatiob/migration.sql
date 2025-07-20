/*
  Warnings:

  - Added the required column `projectRoleTitle` to the `ProjectRoleApplication` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ProjectRoleApplication" ADD COLUMN     "projectRoleTitle" TEXT NOT NULL;
