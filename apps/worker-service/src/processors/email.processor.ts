import {
  Processor,
  Process,
  OnQueueActive,
  OnQueueCompleted,
  OnQueueFailed,
} from "@nestjs/bull";
import { Logger } from "@nestjs/common";
import { Job } from "bull";
import { EmailService } from "../services/email.service";
import { JobHistoryService } from "../services/job-history.service";
import { QUEUES } from "../jobs/queue.constants";
import {
  WelcomeEmailJob,
  PasswordResetEmailJob,
  CustomEmailJob,
} from "@hic/shared-dto";

@Processor(QUEUES.EMAIL)
export class EmailProcessor {
  private readonly logger = new Logger(EmailProcessor.name);

  constructor(
    private emailService: EmailService,
    private jobHistoryService: JobHistoryService,
  ) {}

  @Process("welcome-email")
  async handleWelcomeEmail(job: Job<WelcomeEmailJob>) {
    this.logger.log(
      `Processing welcome email for ${job.data.email} (Job ID: ${job.id})`,
    );

    try {
      await this.emailService.sendWelcomeEmail(job.data.email, job.data.name);
      this.logger.log(
        `Welcome email processed successfully for ${job.data.email} (Job ID: ${job.id})`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to send welcome email to ${job.data.email} (Job ID: ${job.id}):`,
        error,
      );

      // Don't throw error for authorization issues in development
      if (error.response?.status === 401) {
        this.logger.warn(
          "Welcome email sending failed due to authorization. This is likely due to IP restrictions in Sendinblue.",
        );
        this.logger.warn(
          "Email will be skipped but user registration will continue.",
        );
        return; // Don't throw, just log and continue
      }

      throw error;
    }
  }

  @Process("password-reset-email")
  async handlePasswordResetEmail(job: Job<PasswordResetEmailJob>) {
    this.logger.log(`Processing password reset email for ${job.data.email}`);

    try {
      await this.emailService.sendPasswordResetEmail(
        job.data.email,
        job.data.resetToken,
        job.data.frontendUrl,
      );
      this.logger.log(
        `Password reset email sent successfully to ${job.data.email}`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to send password reset email to ${job.data.email}:`,
        error,
      );
      throw error;
    }
  }

  @Process("custom-email")
  async handleCustomEmail(job: Job<CustomEmailJob>) {
    this.logger.log(`Processing custom email for ${job.data.to}`);

    try {
      await this.emailService.sendEmail(job.data);
      this.logger.log(`Custom email sent successfully to ${job.data.to}`);
    } catch (error) {
      this.logger.error(
        `Failed to send custom email to ${job.data.to}:`,
        error,
      );
      throw error;
    }
  }

  @OnQueueActive()
  async onActive(job: Job) {
    this.logger.log(`Job ${job.id} of type ${job.name} is now active`);
    if (job.data.historyId) {
      await this.jobHistoryService.updateJobRecord(job.data.historyId, {
        status: "ACTIVE",
        attempts: job.attemptsMade + 1,
        startedAt: new Date(),
      });
    }
  }

  @OnQueueCompleted()
  async onCompleted(job: Job, result: any) {
    this.logger.log(`Job ${job.id} of type ${job.name} completed successfully`);
    if (job.data.historyId) {
      await this.jobHistoryService.updateJobRecord(job.data.historyId, {
        status: "COMPLETED",
        result,
        completedAt: new Date(),
      });
    }
  }

  @OnQueueFailed()
  async onFailed(job: Job, err: Error) {
    this.logger.error(`Job ${job.id} of type ${job.name} failed:`, err);
    if (job.data.historyId) {
      await this.jobHistoryService.updateJobRecord(job.data.historyId, {
        status: "FAILED",
        error: err.message,
        attempts: job.attemptsMade,
      });
    }
  }
}
