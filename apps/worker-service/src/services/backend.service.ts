import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { CreateUserJob } from '@hic/shared-dto';

@Injectable()
export class BackendService {
  private readonly logger = new Logger(BackendService.name);
  private readonly backendUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.backendUrl = this.configService.get<string>('BACKEND_URL') || 'http://localhost:3011';
  }

  async createUser(userData: CreateUserJob): Promise<void> {
    try {
      const response = await firstValueFrom(
        this.httpService.post(
          `${this.backendUrl}/api/users`,
          {
            id: userData.id,
            name: userData.name,
            email: userData.email,
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        )
      );

      if (response.status !== 201) {
        throw new Error(`Backend returned status ${response.status}`);
      }

      this.logger.log(`User ${userData.email} created successfully in backend`);
    } catch (error) {
      this.logger.error(`Failed to create user ${userData.email} in backend:`, error);
      throw error;
    }
  }
}
