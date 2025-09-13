import { Injectable, Logger } from "@nestjs/common";
import { InjectQueue } from "@nestjs/bull";
import { Queue } from "bull";
import {
  WelcomeEmailJob,
  PasswordResetEmailJob,
  CreateUserJob,
} from "@hic/shared-dto";

@Injectable()
export class QueueClientService {
  private readonly logger = new Logger(QueueClientService.name);

  constructor(
    @InjectQueue("email-queue") private emailQueue: Queue,
    @InjectQueue("user-sync-queue") private userSyncQueue: Queue,
  ) {}

  async sendWelcomeEmail(data: WelcomeEmailJob): Promise<void> {
    try {
      await this.emailQueue.add("welcome-email", data, {
        attempts: 3,
        backoff: {
          type: "exponential",
          delay: 2000,
        },
      });
      this.logger.log(`Welcome email job queued for ${data.email}`);
    } catch (error) {
      this.logger.error(
        `Failed to queue welcome email for ${data.email}:`,
        error,
      );
      throw error;
    }
  }

  async sendPasswordResetEmail(data: PasswordResetEmailJob): Promise<void> {
    try {
      await this.emailQueue.add("password-reset-email", data, {
        attempts: 3,
        backoff: {
          type: "exponential",
          delay: 2000,
        },
      });
      this.logger.log(`Password reset email job queued for ${data.email}`);
    } catch (error) {
      this.logger.error(
        `Failed to queue password reset email for ${data.email}:`,
        error,
      );
      throw error;
    }
  }

  async sendCreateUserJob(data: CreateUserJob): Promise<void> {
    try {
      await this.userSyncQueue.add("create-user", data, {
        attempts: 3,
        backoff: {
          type: "exponential",
          delay: 2000,
        },
      });
      this.logger.log(`Create user job queued for ${data.email}`);
    } catch (error) {
      this.logger.error(
        `Failed to queue create user job for ${data.email}:`,
        error,
      );
      throw error;
    }
  }
}
