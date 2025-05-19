-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "projectRoles" TEXT[];

-- CreateTable
CREATE TABLE "ProjectRoles" (
    "id" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "skill_set" TEXT[],
    "description" TEXT NOT NULL,

    CONSTRAINT "ProjectRoles_pkey" PRIMARY KEY ("id")
);
