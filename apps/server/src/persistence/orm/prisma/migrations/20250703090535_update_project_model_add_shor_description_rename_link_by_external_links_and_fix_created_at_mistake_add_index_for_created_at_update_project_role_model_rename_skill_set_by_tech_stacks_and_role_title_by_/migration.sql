/*
  Warnings:

  - You are about to drop the column `createAt` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `difficulty` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `github` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `link` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `roleTitle` on the `ProjectRole` table. All the data in the column will be lost.
  - Added the required column `shortDescription` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `ProjectRole` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "idx_difficulty_date";

-- DropIndex
DROP INDEX "idx_project_roles";

-- AlterTable
ALTER TABLE "Project" DROP COLUMN "createAt",
DROP COLUMN "difficulty",
DROP COLUMN "github",
DROP COLUMN "link",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "externalLinks" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "shortDescription" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ProjectRole" DROP COLUMN "roleTitle",
ADD COLUMN     "title" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "idx_project_date" ON "Project"("createdAt" DESC);

-- CreateIndex
CREATE INDEX "idx_project_roles" ON "ProjectRole"("projectId", "title");
