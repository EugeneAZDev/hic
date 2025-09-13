import { Process, Processor } from "@nestjs/bull";
import { Logger } from "@nestjs/common";
import { Job } from "bull";
import { CreateUserJob } from "@hic/shared-dto";
import { BackendService } from "../services/backend.service";

@Processor("user-sync-queue")
export class UserSyncProcessor {
  private readonly logger = new Logger(UserSyncProcessor.name);

  constructor(private readonly backendService: BackendService) {}

  @Process("create-user")
  async handleCreateUser(job: Job<CreateUserJob>) {
    this.logger.log(`Processing create user job for ${job.data.email}`);

    try {
      await this.backendService.createUser(job.data);
      this.logger.log(`Successfully created user ${job.data.email} in backend`);
    } catch (error) {
      this.logger.error(
        `Failed to create user ${job.data.email} in backend:`,
        error,
      );
      throw error; // This will trigger retry logic
    }
  }
}
