import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
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
    PrismaModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}