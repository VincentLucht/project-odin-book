-- DropForeignKey
ALTER TABLE "CommentModeration" DROP CONSTRAINT "CommentModeration_comment_id_fkey";

-- AddForeignKey
ALTER TABLE "CommentModeration" ADD CONSTRAINT "CommentModeration_comment_id_fkey" FOREIGN KEY ("comment_id") REFERENCES "Comment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
