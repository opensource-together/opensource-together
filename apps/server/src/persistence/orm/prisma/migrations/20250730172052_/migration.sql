-- AlterTable
ALTER TABLE "User" ADD COLUMN     "commitsThisYear" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "contributedRepos" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "totalStars" INTEGER NOT NULL DEFAULT 0;
