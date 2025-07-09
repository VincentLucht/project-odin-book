/*
  Warnings:

  - You are about to drop the `NotificationChat` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "NotificationChat" DROP CONSTRAINT "NotificationChat_user_id_fkey";

-- AlterTable
ALTER TABLE "UserChats" ADD COLUMN     "last_read_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- DropTable
DROP TABLE "NotificationChat";
