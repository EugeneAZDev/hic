import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  health() {
    return { status: 'ok', message: 'Backend is running!' };
  }

  @Get('hello')
  hello() {
    return { message: 'Hello from Nest.js!' };
  }
}