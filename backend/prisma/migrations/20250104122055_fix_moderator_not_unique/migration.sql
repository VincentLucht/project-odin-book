/*
  Warnings:

  - A unique constraint covering the columns `[community_id,user_id]` on the table `CommunityModerator` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "CommunityModerator_community_id_user_id_idx";

-- CreateIndex
CREATE UNIQUE INDEX "CommunityModerator_community_id_user_id_key" ON "CommunityModerator"("community_id", "user_id");
