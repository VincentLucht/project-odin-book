-- AlterTable
ALTER TABLE "Report" ADD COLUMN     "moderator_id" TEXT;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_moderator_id_fkey" FOREIGN KEY ("moderator_id") REFERENCES "CommunityModerator"("id") ON DELETE SET NULL ON UPDATE CASCADE;
