import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { Login, Register, AuthResponse, PublicUser } from '@hic/shared-dto';

@Injectable()
export class AuthBffService {
  private readonly authServiceUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.authServiceUrl = this.configService.get<string>('AUTH_SERVICE_URL') || 'http://localhost:3012/api/auth';
  }

  async register(registerDto: Register): Promise<AuthResponse> {
    try {
      const response = await firstValueFrom(
        this.httpService.post<AuthResponse>(
          `${this.authServiceUrl}/register`,
          registerDto,
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        )
      );
      return response.data;
    } catch (error) {
      if (error.response) {
        // Forward the error response from auth-service with proper status code
        const statusCode = error.response.status;
        const errorData = error.response.data;
        
        // Create a proper HTTP exception with the same status code
        const HttpException = require('@nestjs/common').HttpException;
        throw new HttpException(
          errorData || { message: 'Registration failed' },
          statusCode
        );
      }
      throw new Error('Failed to register user');
    }
  }

  async login(loginDto: Login): Promise<AuthResponse> {
    try {
      const response = await firstValueFrom(
        this.httpService.post<AuthResponse>(
          `${this.authServiceUrl}/login`,
          loginDto,
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        )
      );
      return response.data;
    } catch (error) {
      if (error.response) {
        // Forward the error response from auth-service with proper status code
        const statusCode = error.response.status;
        const errorData = error.response.data;
        
        // Create a proper HTTP exception with the same status code
        const HttpException = require('@nestjs/common').HttpException;
        throw new HttpException(
          errorData || { message: 'Authentication failed' },
          statusCode
        );
      }
      throw new Error('Failed to login user');
    }
  }

  async logout(): Promise<{ message: string }> {
    // Since we're using stateless JWT tokens, logout is handled on the client side
    // by removing the token from storage. This endpoint is mainly for consistency
    // and potential future server-side token blacklisting.
    return { message: 'Logout successful' };
  }

  async getProfile(user: any): Promise<PublicUser> {
    // This would typically validate the JWT token and return user info
    // For now, we'll return the user from the request
    return user;
  }
}
