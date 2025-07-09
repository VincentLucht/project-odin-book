-- AlterTable
ALTER TABLE "ModMail" ADD COLUMN     "has_replied" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "is_archived" BOOLEAN NOT NULL DEFAULT false;
