import { Controller, Post, Body, Get, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthBffService } from './auth-bff.service';
import { LoginSchema, RegisterSchema, AuthResponseSchema } from '@hic/shared-schemas';
import { Login, Register, AuthResponse, PublicUser } from '@hic/shared-dto';
import { ZodBody } from '../common/decorators/zod-body.decorator';

@ApiTags('auth-bff')
@Controller('auth')
export class AuthBffController {
  constructor(private readonly authBffService: AuthBffService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ 
    status: 201, 
    description: 'User registered successfully',
    schema: { $ref: '#/components/schemas/AuthResponse' }
  })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 409, description: 'User already exists' })
  async register(@ZodBody(RegisterSchema) registerDto: Register): Promise<AuthResponse> {
    return this.authBffService.register(registerDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({ 
    status: 200, 
    description: 'Login successful',
    schema: { $ref: '#/components/schemas/AuthResponse' }
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@ZodBody(LoginSchema) loginDto: Login): Promise<AuthResponse> {
    return this.authBffService.login(loginDto);
  }

  @Post('logout')
  @ApiOperation({ summary: 'Logout user' })
  @ApiResponse({ 
    status: 200, 
    description: 'Logout successful'
  })
  async logout(@Body() body: any = {}): Promise<{ message: string }> {
    return this.authBffService.logout();
  }

  @Get('profile')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ 
    status: 200, 
    description: 'User profile retrieved successfully',
    schema: { $ref: '#/components/schemas/PublicUser' }
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getProfile(@Request() req): Promise<PublicUser> {
    return this.authBffService.getProfile(req.user);
  }
}
