/*
  Warnings:

  - You are about to drop the column `keyFeatures` on the `ProjectRoleApplication` table. All the data in the column will be lost.
  - Added the required column `keyFeatureId` to the `ProjectRoleApplication` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ProjectRoleApplication" DROP COLUMN "keyFeatures",
ADD COLUMN     "keyFeatureId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "KeyFeature" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "feature" TEXT NOT NULL,

    CONSTRAINT "KeyFeature_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "KeyFeature_projectId_feature_key" ON "KeyFeature"("projectId", "feature");

-- AddForeignKey
ALTER TABLE "ProjectRoleApplication" ADD CONSTRAINT "ProjectRoleApplication_keyFeatureId_fkey" FOREIGN KEY ("keyFeatureId") REFERENCES "KeyFeature"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KeyFeature" ADD CONSTRAINT "KeyFeature_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
