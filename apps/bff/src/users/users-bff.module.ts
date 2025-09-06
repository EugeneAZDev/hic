import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { UsersBffController } from './users-bff.controller';
import { UsersBffService } from './users-bff.service';

@Module({
  imports: [HttpModule],
  controllers: [UsersBffController],
  providers: [UsersBffService],
})
export class UsersBffModule {}
