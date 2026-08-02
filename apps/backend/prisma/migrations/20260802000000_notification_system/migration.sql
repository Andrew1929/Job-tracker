-- CreateEnum
CREATE TYPE "NotificationPriority" AS ENUM ('LOW', 'NORMAL', 'HIGH', 'URGENT');

-- CreateEnum
CREATE TYPE "NotificationEntityType" AS ENUM ('JOB', 'INTERVIEW');

-- AlterEnum
-- Legacy values JOB_UPDATE / CUSTOM are remapped to SYSTEM so existing rows
-- survive the enum replace. Direct text casts would fail on those values.
BEGIN;
CREATE TYPE "NotificationType_new" AS ENUM ('NEXT_ACTION_REMINDER', 'NEXT_ACTION_OVERDUE', 'INTERVIEW_REMINDER', 'INTERVIEW_FOLLOW_UP', 'APPLICATION_STALE', 'SYSTEM');
ALTER TABLE "Notification" ALTER COLUMN "type" TYPE "NotificationType_new" USING (
  CASE "type"::text
    WHEN 'INTERVIEW_REMINDER' THEN 'INTERVIEW_REMINDER'::"NotificationType_new"
    WHEN 'SYSTEM' THEN 'SYSTEM'::"NotificationType_new"
    WHEN 'JOB_UPDATE' THEN 'SYSTEM'::"NotificationType_new"
    WHEN 'CUSTOM' THEN 'SYSTEM'::"NotificationType_new"
    ELSE 'SYSTEM'::"NotificationType_new"
  END
);
ALTER TYPE "NotificationType" RENAME TO "NotificationType_old";
ALTER TYPE "NotificationType_new" RENAME TO "NotificationType";
DROP TYPE "public"."NotificationType_old";
COMMIT;

-- DropIndex
DROP INDEX "Notification_createdAt_idx";

-- DropIndex
DROP INDEX "Notification_read_idx";

-- DropIndex
DROP INDEX "Notification_userId_idx";

-- AlterTable
ALTER TABLE "Notification" DROP COLUMN "data",
ADD COLUMN     "actionUrl" TEXT,
ADD COLUMN     "dedupeKey" TEXT,
ADD COLUMN     "expiresAt" TIMESTAMP(3),
ADD COLUMN     "metadata" JSONB,
ADD COLUMN     "priority" "NotificationPriority" NOT NULL DEFAULT 'NORMAL',
ADD COLUMN     "relatedEntityId" TEXT,
ADD COLUMN     "relatedEntityType" "NotificationEntityType",
ADD COLUMN     "scheduledAt" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "NotificationPreferences" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "inAppEnabled" BOOLEAN NOT NULL DEFAULT true,
    "nextActionRemindersEnabled" BOOLEAN NOT NULL DEFAULT true,
    "interviewRemindersEnabled" BOOLEAN NOT NULL DEFAULT true,
    "interviewFollowUpsEnabled" BOOLEAN NOT NULL DEFAULT true,
    "staleApplicationRemindersEnabled" BOOLEAN NOT NULL DEFAULT true,
    "timezone" TEXT NOT NULL DEFAULT 'UTC',
    "nextActionReminderLeadMinutes" INTEGER NOT NULL DEFAULT 1440,
    "interviewReminderLeadMinutes" INTEGER[] DEFAULT ARRAY[1440, 120]::INTEGER[],
    "interviewFollowUpDelayMinutes" INTEGER NOT NULL DEFAULT 1440,
    "staleApplicationThresholdDays" INTEGER NOT NULL DEFAULT 7,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NotificationPreferences_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "NotificationPreferences_userId_key" ON "NotificationPreferences"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Notification_dedupeKey_key" ON "Notification"("dedupeKey");

-- CreateIndex
CREATE INDEX "Notification_userId_read_createdAt_idx" ON "Notification"("userId", "read", "createdAt");

-- CreateIndex
CREATE INDEX "Notification_userId_createdAt_idx" ON "Notification"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "Notification_scheduledAt_idx" ON "Notification"("scheduledAt");

-- CreateIndex
CREATE INDEX "Notification_relatedEntityType_relatedEntityId_idx" ON "Notification"("relatedEntityType", "relatedEntityId");

-- AddForeignKey
ALTER TABLE "NotificationPreferences" ADD CONSTRAINT "NotificationPreferences_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
