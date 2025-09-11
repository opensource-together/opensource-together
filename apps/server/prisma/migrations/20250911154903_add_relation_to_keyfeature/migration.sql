/*
  Warnings:

  - You are about to drop the `_KeyFeatureToProjectRoleApplication` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_KeyFeatureToProjectRoleApplication" DROP CONSTRAINT "_KeyFeatureToProjectRoleApplication_A_fkey";

-- DropForeignKey
ALTER TABLE "_KeyFeatureToProjectRoleApplication" DROP CONSTRAINT "_KeyFeatureToProjectRoleApplication_B_fkey";

-- DropTable
DROP TABLE "_KeyFeatureToProjectRoleApplication";

-- CreateTable
CREATE TABLE "_keyFeatures" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_keyFeatures_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_keyFeatures_B_index" ON "_keyFeatures"("B");

-- AddForeignKey
ALTER TABLE "_keyFeatures" ADD CONSTRAINT "_keyFeatures_A_fkey" FOREIGN KEY ("A") REFERENCES "KeyFeature"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_keyFeatures" ADD CONSTRAINT "_keyFeatures_B_fkey" FOREIGN KEY ("B") REFERENCES "ProjectRoleApplication"("id") ON DELETE CASCADE ON UPDATE CASCADE;
