import { Module } from "@nestjs/common";
import { BullModule } from "@nestjs/bull";
import { EmailProcessor } from "./email.processor";
import { UserSyncProcessor } from "./user-sync.processor";
import { QUEUES } from "../jobs/queue.constants";
import { ServicesModule } from "../services/services.module";

@Module({
  imports: [
    BullModule.registerQueue(
      { name: QUEUES.EMAIL },
      { name: QUEUES.USER_SYNC },
    ),
    ServicesModule,
  ],
  providers: [EmailProcessor, UserSyncProcessor],
})
export class ProcessorsModule {}
