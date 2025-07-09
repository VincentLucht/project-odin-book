/*
  Warnings:

  - You are about to drop the column `sender_id` on the `Notification` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_sender_id_fkey";

-- DropIndex
DROP INDEX "Notification_sender_id_receiver_id_idx";

-- AlterTable
ALTER TABLE "Notification" DROP COLUMN "sender_id",
ADD COLUMN     "sender_community_id" TEXT,
ADD COLUMN     "sender_user_id" TEXT;

-- CreateIndex
CREATE INDEX "Notification_sender_user_id_receiver_id_idx" ON "Notification"("sender_user_id", "receiver_id");

-- CreateIndex
CREATE INDEX "Notification_sender_community_id_receiver_id_idx" ON "Notification"("sender_community_id", "receiver_id");

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_sender_user_id_fkey" FOREIGN KEY ("sender_user_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_sender_community_id_fkey" FOREIGN KEY ("sender_community_id") REFERENCES "Community"("id") ON DELETE SET NULL ON UPDATE CASCADE;
