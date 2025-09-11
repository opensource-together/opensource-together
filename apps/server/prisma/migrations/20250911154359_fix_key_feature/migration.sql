-- DropForeignKey
ALTER TABLE "ProjectRoleApplication" DROP CONSTRAINT "ProjectRoleApplication_keyFeatureId_fkey";

-- CreateTable
CREATE TABLE "_KeyFeatureToProjectRoleApplication" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_KeyFeatureToProjectRoleApplication_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_KeyFeatureToProjectRoleApplication_B_index" ON "_KeyFeatureToProjectRoleApplication"("B");

-- AddForeignKey
ALTER TABLE "_KeyFeatureToProjectRoleApplication" ADD CONSTRAINT "_KeyFeatureToProjectRoleApplication_A_fkey" FOREIGN KEY ("A") REFERENCES "KeyFeature"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_KeyFeatureToProjectRoleApplication" ADD CONSTRAINT "_KeyFeatureToProjectRoleApplication_B_fkey" FOREIGN KEY ("B") REFERENCES "ProjectRoleApplication"("id") ON DELETE CASCADE ON UPDATE CASCADE;
