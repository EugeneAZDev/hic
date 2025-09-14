import { Module } from "@nestjs/common";
import { BullModule } from "@nestjs/bull";
import { EmailJobService } from "./email-job.service";
import { UserSyncJobService } from "./user-sync-job.service";
import { QUEUES } from "./queue.constants";

@Module({
  imports: [
    BullModule.registerQueue(
      { name: QUEUES.EMAIL },
      { name: QUEUES.USER_SYNC },
    ),
  ],
  providers: [EmailJobService, UserSyncJobService],
  exports: [EmailJobService, UserSyncJobService],
})
export class JobsModule {}
