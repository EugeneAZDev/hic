import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersServiceStub } from './users.service';

@Module({
  controllers: [UsersController],
  providers: [UsersServiceStub],
  exports: [UsersServiceStub],
})
export class UsersModule {}
