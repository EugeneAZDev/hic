import { Controller, Get } from '@nestjs/common';
import { User } from '@shared/types';

@Controller('users')
export class UsersController {
  @Get()
  getUsers(): User[] {
    // Here will be logic to get users from database
    // For now returning test data
    return [
      {
        id: '1',
        name: 'Иван Иванов',
        email: 'ivan@example.com'
      },
      {
        id: '2',
        name: 'Мария Петрова',
        email: 'maria@example.com'
      },
      {
        id: '3',
        name: 'Алексей Сидоров',
        email: 'alex@example.com'
      }
    ];
  }
}
