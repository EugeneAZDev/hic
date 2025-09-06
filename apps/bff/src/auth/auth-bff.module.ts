import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AuthBffController } from './auth-bff.controller';
import { AuthBffService } from './auth-bff.service';

@Module({
  imports: [HttpModule],
  controllers: [AuthBffController],
  providers: [AuthBffService],
})
export class AuthBffModule {}
