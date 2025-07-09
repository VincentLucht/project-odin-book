/*
  Warnings:

  - You are about to drop the column `banner_url` on the `Community` table. All the data in the column will be lost.
  - You are about to drop the column `profile_picture_url_desktop` on the `Community` table. All the data in the column will be lost.
  - You are about to drop the column `profile_picture_url_mobile` on the `Community` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Community" DROP COLUMN "banner_url",
DROP COLUMN "profile_picture_url_desktop",
DROP COLUMN "profile_picture_url_mobile",
ADD COLUMN     "banner_url_desktop" TEXT,
ADD COLUMN     "banner_url_mobile" TEXT,
ADD COLUMN     "profile_picture_url" TEXT;
