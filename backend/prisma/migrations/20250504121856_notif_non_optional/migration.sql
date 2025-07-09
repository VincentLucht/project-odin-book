/*
  Warnings:

  - Made the column `message` on table `Notification` required. This step will fail if there are existing NULL values in that column.
  - Made the column `notification_item_id` on table `Notification` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Notification" ALTER COLUMN "message" SET NOT NULL,
ALTER COLUMN "notification_item_id" SET NOT NULL;
