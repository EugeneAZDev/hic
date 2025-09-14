import { Controller, Get, Post, Body, Query, Delete } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from "@nestjs/swagger";
import { ZodValidationPipe } from "nestjs-zod";
import { createZodDto } from "nestjs-zod/dto";
import { EmailJobService } from "../jobs/email-job.service";
import { UserSyncJobService } from "../jobs/user-sync-job.service";
import { JobHistoryService } from "../services/job-history.service";
import {
  WelcomeEmailJobSchema,
  PasswordResetEmailJobSchema,
  CustomEmailJobSchema,
  QueueStatsSchema,
} from "@hic/shared-schemas";
import { z } from "zod";

// Create DTOs from Zod schemas for Swagger
class WelcomeEmailJobDto extends createZodDto(WelcomeEmailJobSchema) {}
class PasswordResetEmailJobDto extends createZodDto(
  PasswordResetEmailJobSchema,
) {}
class CustomEmailJobDto extends createZodDto(CustomEmailJobSchema) {}
class QueueStatsDto extends createZodDto(QueueStatsSchema) {}

// Explicit type annotations to fix TypeScript inference issues
type WelcomeEmailJobDtoType = z.infer<typeof WelcomeEmailJobSchema>;
type PasswordResetEmailJobDtoType = z.infer<typeof PasswordResetEmailJobSchema>;
type CustomEmailJobDtoType = z.infer<typeof CustomEmailJobSchema>;
type QueueStatsDtoType = z.infer<typeof QueueStatsSchema>;

@ApiTags("Queue Management")
@Controller("api/queue")
export class QueueController {
  constructor(
    private readonly emailJobService: EmailJobService,
    private readonly userSyncJobService: UserSyncJobService,
    private readonly jobHistoryService: JobHistoryService,
  ) {}

  @Get("stats")
  @ApiOperation({ summary: "Get queue statistics" })
  @ApiResponse({
    status: 200,
    description: "Queue statistics retrieved successfully",
    type: QueueStatsDto,
  })
  async getStats(): Promise<QueueStatsDtoType> {
    return await this.emailJobService.getQueueStats();
  }

  @Post("email/welcome")
  @ApiOperation({ summary: "Queue welcome email job" })
  @ApiResponse({
    status: 201,
    description: "Welcome email job queued successfully",
    type: WelcomeEmailJobDto,
  })
  @ApiResponse({ status: 400, description: "Invalid request data" })
  async queueWelcomeEmail(
    @Body(new ZodValidationPipe(WelcomeEmailJobSchema))
    data: WelcomeEmailJobDtoType,
  ) {
    await this.emailJobService.addWelcomeEmailJob(data);
    return { message: "Welcome email job queued successfully" };
  }

  @Post("email/password-reset")
  @ApiOperation({ summary: "Queue password reset email job" })
  @ApiResponse({
    status: 201,
    description: "Password reset email job queued successfully",
    type: PasswordResetEmailJobDto,
  })
  @ApiResponse({ status: 400, description: "Invalid request data" })
  async queuePasswordResetEmail(
    @Body(new ZodValidationPipe(PasswordResetEmailJobSchema))
    data: PasswordResetEmailJobDtoType,
  ) {
    await this.emailJobService.addPasswordResetEmailJob(data);
    return { message: "Password reset email job queued successfully" };
  }

  @Post("email/custom")
  @ApiOperation({ summary: "Queue custom email job" })
  @ApiResponse({
    status: 201,
    description: "Custom email job queued successfully",
    type: CustomEmailJobDto,
  })
  @ApiResponse({ status: 400, description: "Invalid request data" })
  async queueCustomEmail(
    @Body(new ZodValidationPipe(CustomEmailJobSchema))
    data: CustomEmailJobDtoType,
  ) {
    await this.emailJobService.addCustomEmailJob(data);
    return { message: "Custom email job queued successfully" };
  }

  @Get("history")
  @ApiOperation({ summary: "Get job history" })
  @ApiQuery({
    name: "queueName",
    required: false,
    description: "Filter by queue name",
  })
  @ApiQuery({
    name: "jobType",
    required: false,
    description: "Filter by job type",
  })
  @ApiQuery({
    name: "status",
    required: false,
    description: "Filter by status",
  })
  @ApiQuery({
    name: "limit",
    required: false,
    description: "Limit results",
    type: Number,
  })
  @ApiQuery({
    name: "offset",
    required: false,
    description: "Offset results",
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: "Job history retrieved successfully",
  })
  async getJobHistory(
    @Query("queueName") queueName?: string,
    @Query("jobType") jobType?: string,
    @Query("status") status?: string,
    @Query("limit") limit?: string,
    @Query("offset") offset?: string,
  ) {
    return await this.jobHistoryService.getJobHistory(
      queueName,
      jobType,
      status as any,
      limit ? parseInt(limit) : 50,
      offset ? parseInt(offset) : 0,
    );
  }

  @Get("history/stats")
  @ApiOperation({ summary: "Get job statistics" })
  @ApiQuery({
    name: "queueName",
    required: false,
    description: "Filter by queue name",
  })
  @ApiResponse({
    status: 200,
    description: "Job statistics retrieved successfully",
  })
  async getJobStats(@Query("queueName") queueName?: string) {
    return await this.jobHistoryService.getJobStats(queueName);
  }

  // Queue Management Endpoints
  @Delete("email/clear")
  @ApiOperation({ summary: "Clear all email queue jobs" })
  @ApiResponse({ status: 200, description: "Email queue cleared successfully" })
  async clearEmailQueue() {
    await this.emailJobService.clearQueue();
    return { message: "Email queue cleared successfully" };
  }

  @Delete("email/clear/completed")
  @ApiOperation({ summary: "Clear completed email jobs" })
  @ApiResponse({
    status: 200,
    description: "Completed email jobs cleared successfully",
  })
  async clearCompletedEmailJobs() {
    await this.emailJobService.clearCompletedJobs();
    return { message: "Completed email jobs cleared successfully" };
  }

  @Delete("email/clear/failed")
  @ApiOperation({ summary: "Clear failed email jobs" })
  @ApiResponse({
    status: 200,
    description: "Failed email jobs cleared successfully",
  })
  async clearFailedEmailJobs() {
    await this.emailJobService.clearFailedJobs();
    return { message: "Failed email jobs cleared successfully" };
  }

  @Post("email/pause")
  @ApiOperation({ summary: "Pause email queue" })
  @ApiResponse({ status: 200, description: "Email queue paused successfully" })
  async pauseEmailQueue() {
    await this.emailJobService.pauseQueue();
    return { message: "Email queue paused successfully" };
  }

  @Post("email/resume")
  @ApiOperation({ summary: "Resume email queue" })
  @ApiResponse({ status: 200, description: "Email queue resumed successfully" })
  async resumeEmailQueue() {
    await this.emailJobService.resumeQueue();
    return { message: "Email queue resumed successfully" };
  }

  @Delete("user-sync/clear")
  @ApiOperation({ summary: "Clear all user sync queue jobs" })
  @ApiResponse({
    status: 200,
    description: "User sync queue cleared successfully",
  })
  async clearUserSyncQueue() {
    await this.userSyncJobService.clearQueue();
    return { message: "User sync queue cleared successfully" };
  }

  @Delete("user-sync/clear/completed")
  @ApiOperation({ summary: "Clear completed user sync jobs" })
  @ApiResponse({
    status: 200,
    description: "Completed user sync jobs cleared successfully",
  })
  async clearCompletedUserSyncJobs() {
    await this.userSyncJobService.clearCompletedJobs();
    return { message: "Completed user sync jobs cleared successfully" };
  }

  @Delete("user-sync/clear/failed")
  @ApiOperation({ summary: "Clear failed user sync jobs" })
  @ApiResponse({
    status: 200,
    description: "Failed user sync jobs cleared successfully",
  })
  async clearFailedUserSyncJobs() {
    await this.userSyncJobService.clearFailedJobs();
    return { message: "Failed user sync jobs cleared successfully" };
  }

  @Post("user-sync/pause")
  @ApiOperation({ summary: "Pause user sync queue" })
  @ApiResponse({
    status: 200,
    description: "User sync queue paused successfully",
  })
  async pauseUserSyncQueue() {
    await this.userSyncJobService.pauseQueue();
    return { message: "User sync queue paused successfully" };
  }

  @Post("user-sync/resume")
  @ApiOperation({ summary: "Resume user sync queue" })
  @ApiResponse({
    status: 200,
    description: "User sync queue resumed successfully",
  })
  async resumeUserSyncQueue() {
    await this.userSyncJobService.resumeQueue();
    return { message: "User sync queue resumed successfully" };
  }

  @Delete("clear-all")
  @ApiOperation({ summary: "Clear all queues" })
  @ApiResponse({ status: 200, description: "All queues cleared successfully" })
  async clearAllQueues() {
    await Promise.all([
      this.emailJobService.clearQueue(),
      this.userSyncJobService.clearQueue(),
    ]);
    return { message: "All queues cleared successfully" };
  }
}
