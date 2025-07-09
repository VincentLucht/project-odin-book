/*
  Warnings:

  - A unique constraint covering the columns `[reporter_id,post_id]` on the table `Report` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[reporter_id,comment_id]` on the table `Report` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Report_post_id_comment_id_item_type_idx";

-- DropIndex
DROP INDEX "Report_post_id_comment_id_item_type_reporter_id_key";

-- CreateIndex
CREATE INDEX "Report_post_id_idx" ON "Report"("post_id");

-- CreateIndex
CREATE INDEX "Report_comment_id_idx" ON "Report"("comment_id");

-- CreateIndex
CREATE UNIQUE INDEX "Report_reporter_id_post_id_key" ON "Report"("reporter_id", "post_id");

-- CreateIndex
CREATE UNIQUE INDEX "Report_reporter_id_comment_id_key" ON "Report"("reporter_id", "comment_id");
