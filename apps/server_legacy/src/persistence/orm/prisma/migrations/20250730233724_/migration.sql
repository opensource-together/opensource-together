/*
  Warnings:

  - You are about to drop the column `commitsThisYear` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `contributedRepos` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `totalStars` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "commitsThisYear",
DROP COLUMN "contributedRepos",
DROP COLUMN "totalStars";

-- CreateTable
CREATE TABLE "GitHubStats" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "totalStars" INTEGER NOT NULL DEFAULT 0,
    "contributedRepos" INTEGER NOT NULL DEFAULT 0,
    "commitsThisYear" INTEGER NOT NULL DEFAULT 0,
    "contributionGraph" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GitHubStats_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GitHubStats_userId_key" ON "GitHubStats"("userId");

-- AddForeignKey
ALTER TABLE "GitHubStats" ADD CONSTRAINT "GitHubStats_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
