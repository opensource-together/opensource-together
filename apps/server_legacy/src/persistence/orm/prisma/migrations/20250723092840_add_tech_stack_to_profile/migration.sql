-- AlterTable
ALTER TABLE "TechStack" ADD COLUMN     "profileId" TEXT;

-- AddForeignKey
ALTER TABLE "TechStack" ADD CONSTRAINT "TechStack_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("userId") ON DELETE CASCADE ON UPDATE CASCADE;
