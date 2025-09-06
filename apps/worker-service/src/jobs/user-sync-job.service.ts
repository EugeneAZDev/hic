import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { QUEUES } from './queue.constants';
import { CreateUserJob, QueueStats } from '@hic/shared-dto';

@Injectable()
export class UserSyncJobService {
  constructor(
    @InjectQueue(QUEUES.USER_SYNC) private userSyncQueue: Queue,
  ) {}

  async addCreateUserJob(data: CreateUserJob, delay = 0): Promise<void> {
    await this.userSyncQueue.add('create-user', data, {
      delay,
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 2000,
      },
    });
  }

  async getQueueStats(): Promise<QueueStats> {
    const [waiting, active, completed, failed] = await Promise.all([
      this.userSyncQueue.getWaiting(),
      this.userSyncQueue.getActive(),
      this.userSyncQueue.getCompleted(),
      this.userSyncQueue.getFailed(),
    ]);

    return {
      waiting: waiting.length,
      active: active.length,
      completed: completed.length,
      failed: failed.length,
    };
  }

  async clearQueue(): Promise<void> {
    await this.userSyncQueue.empty();
  }

  async clearCompletedJobs(): Promise<void> {
    await this.userSyncQueue.clean(0, 'completed');
  }

  async clearFailedJobs(): Promise<void> {
    await this.userSyncQueue.clean(0, 'failed');
  }

  async pauseQueue(): Promise<void> {
    await this.userSyncQueue.pause();
  }

  async resumeQueue(): Promise<void> {
    await this.userSyncQueue.resume();
  }
}
