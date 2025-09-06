# Shared DTO Package

This package provides common DTOs (Data Transfer Objects) and validation schemas for the HIC project.

## Features

- **Zod schemas** for runtime data validation
- **Automatic typing** through `z.infer`
- **Centralized schemas** for consistency
- **TypeScript support** with full type safety

## Installation

```bash
pnpm install
```

## Build

```bash
pnpm run build
```

## Usage

### Import types and schemas

```typescript
import { 
  User, 
  UserFromSchema, 
  UserSchema,
  z 
} from '@hic/shared-dto';
```

### Using types

```typescript
// Types are automatically generated from schemas
const user: UserFromSchema = {
  id: "123e4567-e89b-12d3-a456-426614174000",
  name: "John Doe",
  email: "john@example.com"
};

// Legacy interface still available for backward compatibility
const legacyUser: User = {
  id: "123e4567-e89b-12d3-a456-426614174000",
  name: "John Doe",
  email: "john@example.com"
};
```

### Runtime validation

```typescript
// Validate data
const result = UserSchema.safeParse(incomingData);

if (result.success) {
  // Data is valid, result.data has type UserFromSchema
  const user = result.data;
  console.log(user.name);
} else {
  // Validation errors
  console.log(result.error.errors);
}
```

### Creating custom schemas

```typescript
import { z } from 'zod';

const CustomSchema = z.object({
  title: z.string().min(1),
  count: z.number().positive(),
});

// Automatically generates type
type CustomType = z.infer<typeof CustomSchema>;
```

## Available schemas

### User
- `UserSchema` - complete user schema
- `UserFromSchema` - type inferred from UserSchema

### Common
- `PaginationSchema` - pagination with validation
- `ApiResponseSchema<T>` - generic API response

## Benefits of this approach

1. **DRY principle**: One schema = validation + types
2. **Type Safety**: Automatic typing from schemas
3. **Runtime validation**: Data validation during execution
4. **Consistency**: Centralized schemas for the entire project
5. **Refactoring**: Schema changes automatically update types

## Migration from existing interfaces

For backward compatibility, the existing `User` interface is preserved. It's recommended to gradually migrate to new types:

```typescript
// Old way
import { User } from '@hic/shared-dto';

// New way
import { UserFromSchema } from '@hic/shared-dto';
```

## Examples

See `examples/basic-usage.ts` for practical usage examples.
