-- DropForeignKey
ALTER TABLE "CommentVote" DROP CONSTRAINT "CommentVote_comment_id_fkey";

-- AddForeignKey
ALTER TABLE "CommentVote" ADD CONSTRAINT "CommentVote_comment_id_fkey" FOREIGN KEY ("comment_id") REFERENCES "Comment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
