-- CreateTable
CREATE TABLE "_KeyFeatureToProjectRoleApplication" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_KeyFeatureToProjectRoleApplication_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_ProjectGoalToProjectRoleApplication" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ProjectGoalToProjectRoleApplication_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_KeyFeatureToProjectRoleApplication_B_index" ON "_KeyFeatureToProjectRoleApplication"("B");

-- CreateIndex
CREATE INDEX "_ProjectGoalToProjectRoleApplication_B_index" ON "_ProjectGoalToProjectRoleApplication"("B");

-- AddForeignKey
ALTER TABLE "_KeyFeatureToProjectRoleApplication" ADD CONSTRAINT "_KeyFeatureToProjectRoleApplication_A_fkey" FOREIGN KEY ("A") REFERENCES "KeyFeature"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_KeyFeatureToProjectRoleApplication" ADD CONSTRAINT "_KeyFeatureToProjectRoleApplication_B_fkey" FOREIGN KEY ("B") REFERENCES "ProjectRoleApplication"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProjectGoalToProjectRoleApplication" ADD CONSTRAINT "_ProjectGoalToProjectRoleApplication_A_fkey" FOREIGN KEY ("A") REFERENCES "ProjectGoal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProjectGoalToProjectRoleApplication" ADD CONSTRAINT "_ProjectGoalToProjectRoleApplication_B_fkey" FOREIGN KEY ("B") REFERENCES "ProjectRoleApplication"("id") ON DELETE CASCADE ON UPDATE CASCADE;
