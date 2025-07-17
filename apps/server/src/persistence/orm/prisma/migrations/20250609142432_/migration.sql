-- CreateIndex
CREATE INDEX "idx_difficulty_date" ON "Project"("difficulty", "createAt" DESC);

-- CreateIndex
CREATE INDEX "idx_title_search" ON "Project"("title");

-- CreateIndex
CREATE INDEX "idx_project_roles" ON "ProjectRole"("projectId", "roleTitle");
