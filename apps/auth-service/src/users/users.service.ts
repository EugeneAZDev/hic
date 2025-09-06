import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUser, UpdateUser, PublicUser } from '@hic/shared-dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUser & { password: string }): Promise<PublicUser> {
    const refreshTokenFamily = (global as any).crypto?.randomUUID?.() ?? require('crypto').randomUUID();
    const refreshTokenExp = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    const created = await this.prisma.userAuth.create({
      data: {
        email: createUserDto.email,
        passwordHash: createUserDto.password,
        refreshTokenFamily,
        refreshTokenExp,
      },
      select: {
        id: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return {
      id: created.id,
      name: created.email.split('@')[0],
      email: created.email,
      createdAt: created.createdAt,
      updatedAt: created.updatedAt,
    } as PublicUser;
  }

  async findAll(): Promise<PublicUser[]> {
    const users = await this.prisma.userAuth.findMany({
      select: {
        id: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return users.map((user) => ({
      id: user.id,
      name: user.email.split('@')[0],
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    } as PublicUser));
  }

  async findById(id: string): Promise<PublicUser | null> {
    const user = await this.prisma.userAuth.findUnique({
      where: { id },
      select: { id: true, email: true, createdAt: true, updatedAt: true },
    });
    if (!user) return null;
    return {
      id: user.id,
      name: user.email.split('@')[0],
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    } as PublicUser;
  }

  async findByEmail(email: string): Promise<PublicUser | null> {
    const user = await this.prisma.userAuth.findUnique({
      where: { email },
      select: { id: true, email: true, createdAt: true, updatedAt: true },
    });
    if (!user) return null;
    return {
      id: user.id,
      name: user.email.split('@')[0],
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    } as PublicUser;
  }

  // For authentication: fetch user with passwordHash
  async findAuthUserByEmailForLogin(email: string): Promise<{ id: string; email: string; passwordHash: string | null } | null> {
    return this.prisma.userAuth.findUnique({
      where: { email },
      select: { id: true, email: true, passwordHash: true },
    });
  }

  async update(id: string, updateUserDto: UpdateUser): Promise<PublicUser> {
    const existing = await this.prisma.userAuth.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException('User not found');
    }

    const updated = await this.prisma.userAuth.update({
      where: { id },
      data: {
        email: updateUserDto.email ?? undefined,
      },
      select: {
        id: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return {
      id: updated.id,
      name: updated.email.split('@')[0],
      email: updated.email,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
    } as PublicUser;
  }

  async updatePassword(id: string, hashedPassword: string): Promise<void> {
    await this.prisma.userAuth.update({
      where: { id },
      data: { passwordHash: hashedPassword },
    });
  }

  async remove(id: string): Promise<void> {
    const user = await this.prisma.userAuth.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.prisma.userAuth.delete({ where: { id } });
  }
}