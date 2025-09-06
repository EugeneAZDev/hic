import { z } from 'zod';
import { generateSchema } from '@anatine/zod-openapi';

export function zodToSwagger(schema: z.ZodTypeAny): any {
  return generateSchema(schema);
}
