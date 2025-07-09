/*
  Warnings:

  - A unique constraint covering the columns `[user_id,community_id]` on the table `UserCommunity` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "UserCommunity_user_id_community_id_idx";

-- CreateIndex
CREATE UNIQUE INDEX "UserCommunity_user_id_community_id_key" ON "UserCommunity"("user_id", "community_id");
