/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `account` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "user" ADD COLUMN     "githubLogin" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "account_userId_key" ON "account"("userId");
