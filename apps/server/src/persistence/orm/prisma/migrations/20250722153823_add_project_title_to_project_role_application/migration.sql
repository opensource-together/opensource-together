/*
  Warnings:

  - Added the required column `projectTitle` to the `ProjectRoleApplication` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ProjectRoleApplication" ADD COLUMN     "projectTitle" TEXT NOT NULL;
