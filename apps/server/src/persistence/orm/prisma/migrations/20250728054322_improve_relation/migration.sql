/*
  Warnings:

  - You are about to drop the column `selectedKeyFeatures` on the `ProjectRoleApplication` table. All the data in the column will be lost.
  - You are about to drop the column `selectedProjectGoals` on the `ProjectRoleApplication` table. All the data in the column will be lost.
  - You are about to drop the `_KeyFeatureToProjectRoleApplication` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ProjectGoalToProjectRoleApplication` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_KeyFeatureToProjectRoleApplication" DROP CONSTRAINT "_KeyFeatureToProjectRoleApplication_A_fkey";

-- DropForeignKey
ALTER TABLE "_KeyFeatureToProjectRoleApplication" DROP CONSTRAINT "_KeyFeatureToProjectRoleApplication_B_fkey";

-- DropForeignKey
ALTER TABLE "_ProjectGoalToProjectRoleApplication" DROP CONSTRAINT "_ProjectGoalToProjectRoleApplication_A_fkey";

-- DropForeignKey
ALTER TABLE "_ProjectGoalToProjectRoleApplication" DROP CONSTRAINT "_ProjectGoalToProjectRoleApplication_B_fkey";

-- AlterTable
ALTER TABLE "ProjectRoleApplication" DROP COLUMN "selectedKeyFeatures",
DROP COLUMN "selectedProjectGoals";

-- DropTable
DROP TABLE "_KeyFeatureToProjectRoleApplication";

-- DropTable
DROP TABLE "_ProjectGoalToProjectRoleApplication";

-- CreateTable
CREATE TABLE "_ProjectRoleApplicationKeyFeature" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ProjectRoleApplicationKeyFeature_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_ProjectRoleApplicationProjectGoal" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ProjectRoleApplicationProjectGoal_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_ProjectRoleApplicationKeyFeature_B_index" ON "_ProjectRoleApplicationKeyFeature"("B");

-- CreateIndex
CREATE INDEX "_ProjectRoleApplicationProjectGoal_B_index" ON "_ProjectRoleApplicationProjectGoal"("B");

-- AddForeignKey
ALTER TABLE "_ProjectRoleApplicationKeyFeature" ADD CONSTRAINT "_ProjectRoleApplicationKeyFeature_A_fkey" FOREIGN KEY ("A") REFERENCES "KeyFeature"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProjectRoleApplicationKeyFeature" ADD CONSTRAINT "_ProjectRoleApplicationKeyFeature_B_fkey" FOREIGN KEY ("B") REFERENCES "ProjectRoleApplication"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProjectRoleApplicationProjectGoal" ADD CONSTRAINT "_ProjectRoleApplicationProjectGoal_A_fkey" FOREIGN KEY ("A") REFERENCES "ProjectGoal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProjectRoleApplicationProjectGoal" ADD CONSTRAINT "_ProjectRoleApplicationProjectGoal_B_fkey" FOREIGN KEY ("B") REFERENCES "ProjectRoleApplication"("id") ON DELETE CASCADE ON UPDATE CASCADE;
