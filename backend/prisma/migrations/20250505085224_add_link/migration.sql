/*
  Warnings:

  - You are about to drop the column `notification_item_id` on the `Notification` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Notification" DROP COLUMN "notification_item_id",
ADD COLUMN     "link" TEXT;
