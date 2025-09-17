/*
  Warnings:

  - You are about to drop the column `description` on the `NFTItem` table. All the data in the column will be lost.
  - You are about to drop the column `imageCid` on the `NFTItem` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `NFTItem` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[metadataCid]` on the table `NFTItem` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."NFTItem" DROP COLUMN "description",
DROP COLUMN "imageCid",
DROP COLUMN "name";

-- CreateIndex
CREATE UNIQUE INDEX "NFTItem_metadataCid_key" ON "public"."NFTItem"("metadataCid");
