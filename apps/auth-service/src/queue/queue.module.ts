import { Module } from "@nestjs/common";
import { BullModule } from "@nestjs/bull";
import { ConfigService } from "@nestjs/config";
import { QueueClientService } from "./queue-client.service";

@Module({
  imports: [
    BullModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        redis: {
          host: configService.get<string>("REDIS_HOST", "localhost"),
          port: configService.get<number>("REDIS_PORT", 6379),
          password: configService.get<string>("REDIS_PASSWORD"),
          db: configService.get<number>("REDIS_DB", 0),
        },
      }),
      inject: [ConfigService],
    }),
    BullModule.registerQueue(
      { name: "email-queue" },
      { name: "user-sync-queue" },
    ),
  ],
  providers: [QueueClientService],
  exports: [QueueClientService],
})
export class QueueModule {}
