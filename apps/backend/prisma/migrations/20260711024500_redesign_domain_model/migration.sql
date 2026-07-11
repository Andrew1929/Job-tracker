-- CreateEnum
CREATE TYPE "JobPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- CreateEnum
CREATE TYPE "JobSource" AS ENUM ('JOB_BOARD', 'COMPANY_WEBSITE', 'REFERRAL', 'RECRUITER', 'SOCIAL', 'EVENT', 'OTHER');

-- CreateEnum
CREATE TYPE "RemoteType" AS ENUM ('ONSITE', 'HYBRID', 'REMOTE');

-- CreateEnum
CREATE TYPE "EmploymentType" AS ENUM ('FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP', 'TEMPORARY');

-- CreateEnum
CREATE TYPE "CompanySize" AS ENUM ('STARTUP', 'SMALL', 'MEDIUM', 'LARGE', 'ENTERPRISE');

-- CreateEnum
CREATE TYPE "InterviewType" AS ENUM ('PHONE_SCREEN', 'TECHNICAL', 'BEHAVIORAL', 'SYSTEM_DESIGN', 'ONSITE', 'HR', 'FINAL', 'OTHER');

-- CreateEnum
CREATE TYPE "InterviewResult" AS ENUM ('PENDING', 'PASSED', 'FAILED');

-- AlterEnum
BEGIN;
CREATE TYPE "JobActivityType_new" AS ENUM ('STATUS_CHANGE', 'NOTE', 'INTERVIEW', 'COMMUNICATION', 'REMINDER', 'CUSTOM');
ALTER TABLE "JobActivity" ALTER COLUMN "type" TYPE "JobActivityType_new" USING ("type"::text::"JobActivityType_new");
ALTER TYPE "JobActivityType" RENAME TO "JobActivityType_old";
ALTER TYPE "JobActivityType_new" RENAME TO "JobActivityType";
DROP TYPE "public"."JobActivityType_old";
COMMIT;

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "JobStatus" ADD VALUE 'SCREENING';
ALTER TYPE "JobStatus" ADD VALUE 'ACCEPTED';

-- DropForeignKey
ALTER TABLE "UserStats" DROP CONSTRAINT "UserStats_userId_fkey";

-- DropIndex
DROP INDEX "Job_status_idx";

-- AlterTable
ALTER TABLE "Company" DROP COLUMN "description",
ADD COLUMN     "industry" TEXT,
ADD COLUMN     "location" TEXT,
ADD COLUMN     "logoUrl" TEXT,
ADD COLUMN     "size" "CompanySize";

-- AlterTable
ALTER TABLE "Interview" DROP COLUMN "notes",
DROP COLUMN "title",
ADD COLUMN     "completedAt" TIMESTAMP(3),
ADD COLUMN     "difficulty" INTEGER,
ADD COLUMN     "durationMinutes" INTEGER,
ADD COLUMN     "feedback" TEXT,
ADD COLUMN     "interviewers" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "prepNotes" TEXT,
ADD COLUMN     "rating" INTEGER,
ADD COLUMN     "remoteType" "RemoteType",
ADD COLUMN     "result" "InterviewResult" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "type" "InterviewType" NOT NULL;

-- AlterTable
ALTER TABLE "Job" ADD COLUMN     "archivedAt" TIMESTAMP(3),
ADD COLUMN     "closedAt" TIMESTAMP(3),
ADD COLUMN     "employmentType" "EmploymentType",
ADD COLUMN     "location" TEXT,
ADD COLUMN     "nextActionDate" TIMESTAMP(3),
ADD COLUMN     "priority" "JobPriority" NOT NULL DEFAULT 'MEDIUM',
ADD COLUMN     "remoteType" "RemoteType",
ADD COLUMN     "salaryCurrency" TEXT,
ADD COLUMN     "salaryMax" INTEGER,
ADD COLUMN     "salaryMin" INTEGER,
ADD COLUMN     "source" "JobSource";

-- AlterTable
ALTER TABLE "JobActivity" ADD COLUMN     "fromStatus" "JobStatus",
ADD COLUMN     "toStatus" "JobStatus";

-- AlterTable
ALTER TABLE "Note" DROP COLUMN "title",
ALTER COLUMN "jobId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "readAt" TIMESTAMP(3);

-- DropTable
DROP TABLE "UserStats";

-- CreateTable
CREATE TABLE "CompanyReview" (
    "id" TEXT NOT NULL,
    "rating" INTEGER,
    "processRating" INTEGER,
    "review" TEXT,
    "userId" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CompanyReview_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CompanyReview_companyId_idx" ON "CompanyReview"("companyId");

-- CreateIndex
CREATE UNIQUE INDEX "CompanyReview_userId_companyId_key" ON "CompanyReview"("userId", "companyId");

-- CreateIndex
CREATE INDEX "Interview_jobId_status_idx" ON "Interview"("jobId", "status");

-- CreateIndex
CREATE INDEX "Job_userId_status_idx" ON "Job"("userId", "status");

-- CreateIndex
CREATE INDEX "Job_nextActionDate_idx" ON "Job"("nextActionDate");

-- CreateIndex
CREATE INDEX "JobActivity_jobId_type_idx" ON "JobActivity"("jobId", "type");

-- AddForeignKey
ALTER TABLE "CompanyReview" ADD CONSTRAINT "CompanyReview_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompanyReview" ADD CONSTRAINT "CompanyReview_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;
