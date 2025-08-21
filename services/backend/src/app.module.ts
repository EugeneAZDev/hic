import { Module } from '@nestjs/common';
import { HelloController } from './hello/hello.controller';
import { AppController } from './app.controller';

@Module({
  imports: [],
  controllers: [AppController, HelloController],
  providers: [],
})
export class AppModule {}