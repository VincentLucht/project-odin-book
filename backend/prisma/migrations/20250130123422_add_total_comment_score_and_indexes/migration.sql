-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "total_comment_score" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE INDEX "Comment_total_vote_score_idx" ON "Comment"("total_vote_score");

-- CreateIndex
CREATE INDEX "Comment_created_at_id_idx" ON "Comment"("created_at", "id");

-- CreateIndex
CREATE INDEX "Comment_user_id_created_at_idx" ON "Comment"("user_id", "created_at");

-- CreateIndex
CREATE INDEX "Comment_user_id_total_vote_score_idx" ON "Comment"("user_id", "total_vote_score");

-- CreateIndex
CREATE INDEX "Post_pinned_at_idx" ON "Post"("pinned_at");

-- CreateIndex
CREATE INDEX "Post_total_vote_score_idx" ON "Post"("total_vote_score");

-- CreateIndex
CREATE INDEX "Post_community_id_created_at_idx" ON "Post"("community_id", "created_at");

-- CreateIndex
CREATE INDEX "Post_community_id_total_vote_score_idx" ON "Post"("community_id", "total_vote_score");

-- CreateIndex
CREATE INDEX "Post_poster_id_created_at_idx" ON "Post"("poster_id", "created_at");
