/*
  Warnings:

  - You are about to drop the column `externalLinks` on the `Project` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Project" DROP COLUMN "externalLinks";

-- CreateTable
CREATE TABLE "ProjectExternalLink" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "url" TEXT NOT NULL,

    CONSTRAINT "ProjectExternalLink_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ProjectExternalLink" ADD CONSTRAINT "ProjectExternalLink_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
