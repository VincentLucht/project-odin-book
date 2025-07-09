/*
  Warnings:

  - Made the column `color` on table `CommunityFlair` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "CommunityFlair" ALTER COLUMN "color" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_poster_id_fkey" FOREIGN KEY ("poster_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
