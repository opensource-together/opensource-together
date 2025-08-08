-- DropIndex
DROP INDEX "Notification_senderId_createdAt_idx";

-- CreateIndex
CREATE INDEX "idx_receiver_unread_notifications" ON "Notification"("receiverId", "readAt", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "idx_sender_notifications" ON "Notification"("senderId", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "idx_notification_type" ON "Notification"("type", "createdAt" DESC);

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
