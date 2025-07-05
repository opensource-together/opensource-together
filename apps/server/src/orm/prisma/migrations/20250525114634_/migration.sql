/*
  Warnings:

  - You are about to drop the column `skillSet` on the `ProjectRole` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ProjectRole" DROP COLUMN "skillSet";

-- CreateTable
CREATE TABLE "_ProjectRoleToTechStack" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ProjectRoleToTechStack_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_ProjectRoleToTechStack_B_index" ON "_ProjectRoleToTechStack"("B");

-- AddForeignKey
ALTER TABLE "_ProjectRoleToTechStack" ADD CONSTRAINT "_ProjectRoleToTechStack_A_fkey" FOREIGN KEY ("A") REFERENCES "ProjectRole"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProjectRoleToTechStack" ADD CONSTRAINT "_ProjectRoleToTechStack_B_fkey" FOREIGN KEY ("B") REFERENCES "TechStack"("id") ON DELETE CASCADE ON UPDATE CASCADE;
