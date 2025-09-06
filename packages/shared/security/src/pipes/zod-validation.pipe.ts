import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { ZodSchema, ZodError } from 'zod';

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  transform(value: unknown, metadata: ArgumentMetadata) {
    try {
      // Use .parse() for strict validation
      return this.schema.parse(value);
    } catch (error) {
      if (error instanceof ZodError) {
        // Format Zod errors for better UX
        const messages = error.errors.map(err => {
          const field = err.path.join('.');
          return `${field}: ${err.message}`;
        }).join(', ');
        throw new BadRequestException(`Validation failed: ${messages}`);
      }
      throw new BadRequestException('Validation failed');
    }
  }
}
