-- DropForeignKey
ALTER TABLE "CommentModeration" DROP CONSTRAINT "CommentModeration_moderator_id_fkey";

-- DropForeignKey
ALTER TABLE "PostModeration" DROP CONSTRAINT "PostModeration_moderator_id_fkey";

-- CreateIndex
CREATE INDEX "Report_community_id_created_at_idx" ON "Report"("community_id", "created_at");

-- AddForeignKey
ALTER TABLE "PostModeration" ADD CONSTRAINT "PostModeration_moderator_id_fkey" FOREIGN KEY ("moderator_id") REFERENCES "CommunityModerator"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentModeration" ADD CONSTRAINT "CommentModeration_moderator_id_fkey" FOREIGN KEY ("moderator_id") REFERENCES "CommunityModerator"("id") ON DELETE CASCADE ON UPDATE CASCADE;
