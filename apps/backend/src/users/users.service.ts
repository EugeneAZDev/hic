import { Injectable } from '@nestjs/common';
import { CreateUser, UpdateUser, UserFromSchema } from '@hic/shared-dto';
import { PrismaService } from '../prisma/prisma.service';

// Abstract service class for NestJS injection
export abstract class UsersService {
  abstract create(data: CreateUser): Promise<UserFromSchema>;
  abstract findAll(): Promise<UserFromSchema[]>;
  abstract findOne(id: string): Promise<UserFromSchema>;
  abstract update(id: string, data: UpdateUser): Promise<UserFromSchema>;
  abstract remove(id: string): Promise<void>;
}

@Injectable()
export class UsersServiceStub extends UsersService {
  constructor(private prisma: PrismaService) {
    super();
  }

  async create(data: CreateUser): Promise<UserFromSchema> {
    // Use the same ID from UserAuth table to maintain consistency
    const userId = (data as any).id;
    if (!userId) {
      throw new Error('User ID is required and must match UserAuth ID');
    }

    const user = await this.prisma.user.create({
      data: {
        id: userId, // Use the same ID as in UserAuth table
        email: data.email,
        firstName: data.name.split(' ')[0] || data.name,
        lastName: data.name.split(' ').slice(1).join(' ') || null,
      },
    });

    return {
      id: user.id,
      name: data.name,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
  
  async findAll(): Promise<UserFromSchema[]> {
    const users = await this.prisma.user.findMany();
    return users.map(user => ({
      id: user.id,
      name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }));
  }
  
  async findOne(id: string): Promise<UserFromSchema> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new Error('User not found');
    }

    return {
      id: user.id,
      name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
  
  async update(id: string, data: UpdateUser): Promise<UserFromSchema> {
    const nameParts = data.name?.split(' ') || [];
    const firstName = nameParts[0] || null;
    const lastName = nameParts.slice(1).join(' ') || null;

    const user = await this.prisma.user.update({
      where: { id },
      data: {
        email: data.email,
        firstName,
        lastName,
      },
    });

    return {
      id: user.id,
      name: data.name || `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
  
  async remove(id: string): Promise<void> {
    await this.prisma.user.delete({
      where: { id },
    });
  }
}
