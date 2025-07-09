/*
  Warnings:

  - You are about to drop the `Reported` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Reported" DROP CONSTRAINT "Reported_comment_id_fkey";

-- DropForeignKey
ALTER TABLE "Reported" DROP CONSTRAINT "Reported_post_id_fkey";

-- DropForeignKey
ALTER TABLE "Reported" DROP CONSTRAINT "Reported_reporter_id_fkey";

-- DropTable
DROP TABLE "Reported";

-- CreateTable
CREATE TABLE "Report" (
    "id" TEXT NOT NULL,
    "item_id" TEXT NOT NULL,
    "item_type" "ReportedTypes" NOT NULL,
    "reporter_id" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "ReportedStatus" NOT NULL,
    "post_id" TEXT,
    "comment_id" TEXT,

    CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Report_item_id_item_type_idx" ON "Report"("item_id", "item_type");

-- CreateIndex
CREATE UNIQUE INDEX "Report_item_id_item_type_reporter_id_key" ON "Report"("item_id", "item_type", "reporter_id");

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_reporter_id_fkey" FOREIGN KEY ("reporter_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "Post"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_comment_id_fkey" FOREIGN KEY ("comment_id") REFERENCES "Comment"("id") ON DELETE SET NULL ON UPDATE CASCADE;
