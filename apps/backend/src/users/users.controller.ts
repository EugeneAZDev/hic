import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { 
  CreateUserSchema, 
  UpdateUserSchema, 
  UserSchema,
  SyncUserSchema
} from '@hic/shared-schemas';
import { 
  CreateUser,
  UpdateUser,
  UserFromSchema 
} from '@hic/shared-dto';
import { ZodBody } from '../common/decorators/zod-body.decorator';
import { UsersServiceStub } from './users.service';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersServiceStub) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiBody({ schema: { $ref: '#/components/schemas/CreateUser' } })
  @ApiResponse({ 
    status: 201, 
    description: 'User created successfully',
    schema: { $ref: '#/components/schemas/User' }
  })
  @ApiResponse({ status: 400, description: 'Validation error' })
  async create(@ZodBody(SyncUserSchema) createUserDto: any): Promise<UserFromSchema> {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ 
    status: 200, 
    description: 'List of users',
    schema: { 
      type: 'array',
      items: { $ref: '#/components/schemas/User' }
    }
  })
  async findAll(): Promise<UserFromSchema[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'User found',
    schema: { $ref: '#/components/schemas/User' }
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<UserFromSchema> {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update user' })
  @ApiBody({ schema: { $ref: '#/components/schemas/UpdateUser' } })
  @ApiResponse({ 
    status: 200, 
    description: 'User updated successfully',
    schema: { $ref: '#/components/schemas/User' }
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @ZodBody(UpdateUserSchema) updateUserDto: UpdateUser
  ): Promise<UserFromSchema> {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete user' })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.usersService.remove(id);
  }
}
