/*
  Warnings:

  - Added the required column `opened_at` to the `Notification` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "opened_at" TIMESTAMP(3) NOT NULL;
