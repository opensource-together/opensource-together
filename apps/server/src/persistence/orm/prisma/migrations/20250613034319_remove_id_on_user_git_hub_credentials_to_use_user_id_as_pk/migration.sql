/*
  Warnings:

  - The primary key for the `UserGitHubCredentials` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `UserGitHubCredentials` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "UserGitHubCredentials" DROP CONSTRAINT "UserGitHubCredentials_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "UserGitHubCredentials_pkey" PRIMARY KEY ("userId");
