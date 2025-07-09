/*
  Warnings:

  - A unique constraint covering the columns `[user_id,community_id]` on the table `BannedUser` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "BannedUser_user_id_community_id_idx";

-- AlterTable
ALTER TABLE "BannedUser" ALTER COLUMN "banned_at" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "BannedUser_user_id_community_id_key" ON "BannedUser"("user_id", "community_id");
