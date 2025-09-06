import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class PasswordHasher {
  private readonly saltRounds = parseInt(process.env.BCRYPT_ROUNDS || '12');

  async hash(password: string): Promise<string> {
    return bcrypt.hash(password, this.saltRounds);
  }

  async compare(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  async verify(password: string, hash: string): Promise<boolean> {
    return this.compare(password, hash);
  }
}
