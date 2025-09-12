import {
  createParamDecorator,
  ExecutionContext,
  BadRequestException,
} from "@nestjs/common";
import { ZodSchema } from "zod";

export const ZodBody = (schema: ZodSchema) =>
  createParamDecorator((data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const body = request.body;

    try {
      return schema.parse(body);
    } catch (error) {
      throw new BadRequestException("Validation failed", {
        cause: error,
        description: "Request body validation failed",
      });
    }
  })();
