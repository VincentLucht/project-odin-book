-- DropForeignKey
ALTER TABLE "PostAssignedFlair" DROP CONSTRAINT "PostAssignedFlair_community_flair_id_fkey";

-- DropForeignKey
ALTER TABLE "UserAssignedFlair" DROP CONSTRAINT "UserAssignedFlair_community_flair_id_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "deleted_at" TIMESTAMP(3);

-- AddForeignKey
ALTER TABLE "UserAssignedFlair" ADD CONSTRAINT "UserAssignedFlair_community_flair_id_fkey" FOREIGN KEY ("community_flair_id") REFERENCES "CommunityFlair"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostAssignedFlair" ADD CONSTRAINT "PostAssignedFlair_community_flair_id_fkey" FOREIGN KEY ("community_flair_id") REFERENCES "CommunityFlair"("id") ON DELETE CASCADE ON UPDATE CASCADE;
