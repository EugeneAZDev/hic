import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UsersBffService } from './users-bff.service';
import { UserFromSchema } from '@hic/shared-dto';

@ApiTags('users-bff')
@Controller('users')
export class UsersBffController {
  constructor(private readonly usersBffService: UsersBffService) {}

  @Get()
  @ApiOperation({ summary: 'Get all users from backend' })
  @ApiResponse({ 
    status: 200, 
    description: 'List of users from backend',
    schema: { 
      type: 'array',
      items: { $ref: '#/components/schemas/User' }
    }
  })
  async findAll(): Promise<UserFromSchema[]> {
    return this.usersBffService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID from backend' })
  @ApiResponse({ 
    status: 200, 
    description: 'User found in backend',
    schema: { $ref: '#/components/schemas/User' }
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<UserFromSchema> {
    return this.usersBffService.findOne(id);
  }
}
