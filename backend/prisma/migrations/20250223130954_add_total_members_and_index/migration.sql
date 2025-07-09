-- AlterTable
ALTER TABLE "Community" ADD COLUMN     "total_members" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE INDEX "Community_name_idx" ON "Community"("name");
