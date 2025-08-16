/*
  Warnings:

  - You are about to drop the column `username` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Made the column `name` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
-- DROP INDEX "User_username_key";

-- -- AlterTable
-- ALTER TABLE "User" DROP COLUMN "username",
-- ALTER COLUMN "name" SET NOT NULL;

-- -- CreateIndex
-- CREATE UNIQUE INDEX "User_name_key" ON "User"("name");
