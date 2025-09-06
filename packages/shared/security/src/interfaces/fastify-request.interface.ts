import { FastifyRequest } from 'fastify';
import { JwtPayload } from './jwt-payload.interface';

export interface AuthenticatedFastifyRequest extends FastifyRequest {
  user: JwtPayload;
}
