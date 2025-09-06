import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BullModule } from '@nestjs/bull';
import { TerminusModule } from '@nestjs/terminus';
import { JobsModule } from './jobs/jobs.module';
import { ServicesModule } from './services/services.module';
import { ProcessorsModule } from './processors/processors.module';
import { ApiModule } from './api/api.module';
import { PrismaModule } from './prisma/prisma.module';
import { HealthController } from './health.controller';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [
        join(__dirname, '../../..', '.env-files', '.env.local'),
        join(__dirname, '../../..', '.env-files', '.env.dev'),
        '.env.local',
        '.env.dev',
        '.env',
      ],
    }),
    BullModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        redis: {
          host: configService.get<string>('REDIS_HOST', 'localhost'),
          port: configService.get<number>('REDIS_PORT', 6379),
          password: configService.get<string>('REDIS_PASSWORD'),
          db: configService.get<number>('REDIS_DB', 0),
        },
        defaultJobOptions: {
          removeOnComplete: 10,
          removeOnFail: 5,
          attempts: 3,
          backoff: {
            type: 'exponential',
            delay: 2000,
          },
        },
        settings: {
          stalledInterval: 30 * 1000, // 30 seconds
          maxStalledCount: 1,
        },
      }),
      inject: [ConfigService],
    }),
    TerminusModule,
    PrismaModule,
    JobsModule,
    ServicesModule,
    ProcessorsModule,
    ApiModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}