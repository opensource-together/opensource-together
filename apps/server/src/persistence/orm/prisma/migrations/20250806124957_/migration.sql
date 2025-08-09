-- AddForeignKey
ALTER TABLE "teamMember" ADD CONSTRAINT "teamMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
