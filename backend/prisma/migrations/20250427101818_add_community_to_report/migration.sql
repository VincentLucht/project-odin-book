/*
  Warnings:

  - Added the required column `community_id` to the `Report` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Report" ADD COLUMN     "community_id" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "Report_community_id_idx" ON "Report"("community_id");

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_community_id_fkey" FOREIGN KEY ("community_id") REFERENCES "Community"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
