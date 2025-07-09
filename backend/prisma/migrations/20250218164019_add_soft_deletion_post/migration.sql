-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_poster_id_fkey";

-- AlterTable
ALTER TABLE "Post" ALTER COLUMN "poster_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_poster_id_fkey" FOREIGN KEY ("poster_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
