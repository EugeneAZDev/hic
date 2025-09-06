-- CreateEnum
CREATE TYPE "JobStatus" AS ENUM ('PENDING', 'ACTIVE', 'COMPLETED', 'FAILED', 'DELAYED', 'STALLED');

-- CreateTable
CREATE TABLE "JobHistory" (
    "id" UUID NOT NULL,
    "queueName" TEXT NOT NULL,
    "jobType" TEXT NOT NULL,
    "jobData" JSONB NOT NULL,
    "status" "JobStatus" NOT NULL DEFAULT 'PENDING',
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "maxAttempts" INTEGER NOT NULL DEFAULT 3,
    "error" TEXT,
    "result" JSONB,
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "JobHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "JobHistory_queueName_idx" ON "JobHistory"("queueName");

-- CreateIndex
CREATE INDEX "JobHistory_jobType_idx" ON "JobHistory"("jobType");

-- CreateIndex
CREATE INDEX "JobHistory_status_idx" ON "JobHistory"("status");
