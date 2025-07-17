/*
  Warnings:

  - You are about to drop the column `githubAccessToken` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `githubUserId` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "githubAccessToken",
DROP COLUMN "githubUserId";

-- CreateTable
CREATE TABLE "UserGitHubCredentials" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "githubAccessToken" TEXT,
    "githubUserId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserGitHubCredentials_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserGitHubCredentials_userId_key" ON "UserGitHubCredentials"("userId");

-- AddForeignKey
ALTER TABLE "UserGitHubCredentials" ADD CONSTRAINT "UserGitHubCredentials_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
