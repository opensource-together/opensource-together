/*
  Warnings:

  - Added the required column `type` to the `TechStack` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TechStackType" AS ENUM ('LANGUAGE', 'TECH');

-- AlterTable
ALTER TABLE "TechStack" ADD COLUMN     "type" "TechStackType" NOT NULL;
