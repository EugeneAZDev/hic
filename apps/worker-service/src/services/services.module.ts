import { Module } from "@nestjs/common";
import { HttpModule } from "@nestjs/axios";
import { EmailService } from "./email.service";
import { BackendService } from "./backend.service";
import { JobHistoryService } from "./job-history.service";

@Module({
  imports: [HttpModule],
  providers: [EmailService, BackendService, JobHistoryService],
  exports: [EmailService, BackendService, JobHistoryService],
})
export class ServicesModule {}
