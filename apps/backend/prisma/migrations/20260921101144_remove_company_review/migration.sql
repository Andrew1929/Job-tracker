/*
  Warnings:

  - You are about to drop the column `industry` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `logoUrl` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `size` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the `CompanyReview` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CompanyReview" DROP CONSTRAINT "CompanyReview_companyId_fkey";

-- DropForeignKey
ALTER TABLE "CompanyReview" DROP CONSTRAINT "CompanyReview_userId_fkey";

-- AlterTable
ALTER TABLE "Company" DROP COLUMN "industry",
DROP COLUMN "logoUrl",
DROP COLUMN "size";

-- DropTable
DROP TABLE "CompanyReview";
