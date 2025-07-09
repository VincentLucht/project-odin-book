-- CreateEnum
CREATE TYPE "ReportedTypes" AS ENUM ('POST', 'COMMENT');

-- CreateEnum
CREATE TYPE "ReportedStatus" AS ENUM ('PENDING', 'REVIEWED', 'DISMISSED');

-- AlterTable
ALTER TABLE "Comment" ADD COLUMN     "times_reported" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "times_reported" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "ModMail" (
    "id" TEXT NOT NULL,
    "subject" VARCHAR(200) NOT NULL,
    "message" VARCHAR(1000) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sender_id" TEXT NOT NULL,
    "community_id" TEXT NOT NULL,

    CONSTRAINT "ModMail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reported" (
    "id" TEXT NOT NULL,
    "item_id" TEXT NOT NULL,
    "item_type" "ReportedTypes" NOT NULL,
    "reporter_id" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "ReportedStatus" NOT NULL,
    "post_id" TEXT,
    "comment_id" TEXT,

    CONSTRAINT "Reported_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Reported_item_id_item_type_idx" ON "Reported"("item_id", "item_type");

-- CreateIndex
CREATE UNIQUE INDEX "Reported_item_id_item_type_reporter_id_key" ON "Reported"("item_id", "item_type", "reporter_id");

-- AddForeignKey
ALTER TABLE "ModMail" ADD CONSTRAINT "ModMail_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ModMail" ADD CONSTRAINT "ModMail_community_id_fkey" FOREIGN KEY ("community_id") REFERENCES "Community"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reported" ADD CONSTRAINT "Reported_reporter_id_fkey" FOREIGN KEY ("reporter_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reported" ADD CONSTRAINT "Reported_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "Post"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reported" ADD CONSTRAINT "Reported_comment_id_fkey" FOREIGN KEY ("comment_id") REFERENCES "Comment"("id") ON DELETE SET NULL ON UPDATE CASCADE;
