-- AlterTable
ALTER TABLE "Comment" ADD COLUMN     "approver_id" TEXT,
ADD COLUMN     "remover_id" TEXT;

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "approver_id" TEXT,
ADD COLUMN     "remover_id" TEXT;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_approver_id_fkey" FOREIGN KEY ("approver_id") REFERENCES "CommunityModerator"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_remover_id_fkey" FOREIGN KEY ("remover_id") REFERENCES "CommunityModerator"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_approver_id_fkey" FOREIGN KEY ("approver_id") REFERENCES "CommunityModerator"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_remover_id_fkey" FOREIGN KEY ("remover_id") REFERENCES "CommunityModerator"("id") ON DELETE SET NULL ON UPDATE CASCADE;
