import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthenticatedFastifyRequest } from '../interfaces/fastify-request.interface';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<AuthenticatedFastifyRequest>();
    return request.user;
  },
);
