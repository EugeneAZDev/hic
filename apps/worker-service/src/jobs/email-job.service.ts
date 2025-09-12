import { Injectable } from "@nestjs/common";
import { InjectQueue } from "@nestjs/bull";
import { Queue } from "bull";
import { QUEUES } from "./queue.constants";
import {
  WelcomeEmailJob,
  PasswordResetEmailJob,
  CustomEmailJob,
  QueueStats,
} from "@hic/shared-dto";

@Injectable()
export class EmailJobService {
  constructor(@InjectQueue(QUEUES.EMAIL) private emailQueue: Queue) {}

  async addWelcomeEmailJob(data: WelcomeEmailJob, delay = 0): Promise<void> {
    await this.emailQueue.add("welcome-email", data, {
      delay,
      attempts: 3,
      backoff: {
        type: "exponential",
        delay: 2000,
      },
    });
  }

  async addPasswordResetEmailJob(
    data: PasswordResetEmailJob,
    delay = 0,
  ): Promise<void> {
    await this.emailQueue.add("password-reset-email", data, {
      delay,
      attempts: 3,
      backoff: {
        type: "exponential",
        delay: 2000,
      },
    });
  }

  async addCustomEmailJob(data: CustomEmailJob, delay = 0): Promise<void> {
    await this.emailQueue.add("custom-email", data, {
      delay,
      attempts: 3,
      backoff: {
        type: "exponential",
        delay: 2000,
      },
    });
  }

  async getQueueStats(): Promise<QueueStats> {
    const [waiting, active, completed, failed] = await Promise.all([
      this.emailQueue.getWaiting(),
      this.emailQueue.getActive(),
      this.emailQueue.getCompleted(),
      this.emailQueue.getFailed(),
    ]);

    return {
      waiting: waiting.length,
      active: active.length,
      completed: completed.length,
      failed: failed.length,
    };
  }

  async clearQueue(): Promise<void> {
    await this.emailQueue.empty();
  }

  async clearCompletedJobs(): Promise<void> {
    await this.emailQueue.clean(0, "completed");
  }

  async clearFailedJobs(): Promise<void> {
    await this.emailQueue.clean(0, "failed");
  }

  async pauseQueue(): Promise<void> {
    await this.emailQueue.pause();
  }

  async resumeQueue(): Promise<void> {
    await this.emailQueue.resume();
  }
}
