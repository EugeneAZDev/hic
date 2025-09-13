import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { JobStatus } from "../../../../packages/prisma/generated/main";

export interface JobHistoryCreate {
  queueName: string;
  jobType: string;
  jobData: any;
  maxAttempts?: number;
}

export interface JobHistoryUpdate {
  status?: JobStatus;
  attempts?: number;
  error?: string;
  result?: any;
  startedAt?: Date;
  completedAt?: Date;
}

@Injectable()
export class JobHistoryService {
  private readonly logger = new Logger(JobHistoryService.name);

  constructor(private prisma: PrismaService) {}

  async createJobRecord(data: JobHistoryCreate): Promise<string> {
    try {
      const jobRecord = await this.prisma.jobHistory.create({
        data: {
          queueName: data.queueName,
          jobType: data.jobType,
          jobData: data.jobData,
          maxAttempts: data.maxAttempts || 3,
        },
      });
      return jobRecord.id;
    } catch (error) {
      this.logger.error("Failed to create job history record:", error);
      throw error;
    }
  }

  async updateJobRecord(id: string, data: JobHistoryUpdate): Promise<void> {
    try {
      await this.prisma.jobHistory.update({
        where: { id },
        data,
      });
    } catch (error) {
      this.logger.error(`Failed to update job history record ${id}:`, error);
      throw error;
    }
  }

  async getJobHistory(
    queueName?: string,
    jobType?: string,
    status?: JobStatus,
    limit = 50,
    offset = 0,
  ) {
    try {
      const where: any = {};
      if (queueName) where.queueName = queueName;
      if (jobType) where.jobType = jobType;
      if (status) where.status = status;

      return await this.prisma.jobHistory.findMany({
        where,
        orderBy: { createdAt: "desc" },
        take: limit,
        skip: offset,
      });
    } catch (error) {
      this.logger.error("Failed to get job history:", error);
      throw error;
    }
  }

  async getJobStats(queueName?: string) {
    try {
      const where: any = {};
      if (queueName) where.queueName = queueName;

      const stats = await this.prisma.jobHistory.groupBy({
        by: ["status"],
        where,
        _count: {
          status: true,
        },
      });

      const result: Record<string, number> = {
        PENDING: 0,
        ACTIVE: 0,
        COMPLETED: 0,
        FAILED: 0,
        DELAYED: 0,
        STALLED: 0,
      };

      stats.forEach((stat) => {
        result[stat.status] = stat._count.status;
      });

      return result;
    } catch (error) {
      this.logger.error("Failed to get job stats:", error);
      throw error;
    }
  }
}
