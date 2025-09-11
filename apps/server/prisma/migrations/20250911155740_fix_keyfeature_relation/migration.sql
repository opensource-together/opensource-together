/*
  Warnings:

  - You are about to drop the `_keyFeatures` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_keyFeatures" DROP CONSTRAINT "_keyFeatures_A_fkey";

-- DropForeignKey
ALTER TABLE "_keyFeatures" DROP CONSTRAINT "_keyFeatures_B_fkey";

-- DropTable
DROP TABLE "_keyFeatures";

-- AddForeignKey
ALTER TABLE "ProjectRoleApplication" ADD CONSTRAINT "ProjectRoleApplication_keyFeatureId_fkey" FOREIGN KEY ("keyFeatureId") REFERENCES "KeyFeature"("id") ON DELETE CASCADE ON UPDATE CASCADE;
