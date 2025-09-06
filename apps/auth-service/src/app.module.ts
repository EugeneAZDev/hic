import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TerminusModule } from '@nestjs/terminus';
import { join } from 'path';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { HealthModule } from './health/health.module';
import { QueueModule } from './queue/queue.module';
import { PrismaModule } from './prisma/prisma.module';
import { AppController } from './app.controller';

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
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const secret = configService.get<string>('JWT_SECRET');
        console.log('JWT Module: JWT_SECRET loaded:', secret ? 'YES' : 'NO');
        console.log('JWT Module: JWT_SECRET length:', secret?.length || 0);
        
        return {
          secret: secret || 'default-secret-change-in-production',
          signOptions: { expiresIn: '24h' },
        };
      },
      inject: [ConfigService],
    }),
    PrismaModule,
    QueueModule,
    AuthModule,
    UsersModule,
    HealthModule,
    TerminusModule,
  ],
  controllers: [AppController],
})
export class AppModule {}