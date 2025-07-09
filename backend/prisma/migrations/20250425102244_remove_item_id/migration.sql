/*
  Warnings:

  - You are about to drop the column `item_id` on the `Report` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[post_id,comment_id,item_type,reporter_id]` on the table `Report` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Report_item_id_item_type_idx";

-- DropIndex
DROP INDEX "Report_item_id_item_type_reporter_id_key";

-- AlterTable
ALTER TABLE "Report" DROP COLUMN "item_id";

-- CreateIndex
CREATE INDEX "Report_post_id_comment_id_item_type_idx" ON "Report"("post_id", "comment_id", "item_type");

-- CreateIndex
CREATE UNIQUE INDEX "Report_post_id_comment_id_item_type_reporter_id_key" ON "Report"("post_id", "comment_id", "item_type", "reporter_id");
