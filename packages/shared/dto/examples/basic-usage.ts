import { 
  UserSchema, 
  UserFromSchema, 
  PaginationSchema, 
  Pagination,
  z 
} from '../src';

// Example 1: Using inferred types
const userData: UserFromSchema = {
  id: "123e4567-e89b-12d3-a456-426614174000",
  name: "John Doe",
  email: "john@example.com"
};

// Example 2: Runtime validation
const validateUser = (data: unknown) => {
  const result = UserSchema.safeParse(data);
  
  if (result.success) {
    // TypeScript knows this is UserFromSchema
    console.log("Valid user:", result.data.name);
    return result.data;
  } else {
    console.log("Validation errors:", result.error.errors);
    return null;
  }
};

// Example 3: Creating custom schemas
const CustomUserSchema = UserSchema.extend({
  age: z.number().positive().optional(),
  roles: z.array(z.string()).default([])
});

type CustomUser = z.infer<typeof CustomUserSchema>;

// Example 4: Using pagination
const pagination: Pagination = {
  page: 1,
  limit: 20
};

// Example 5: Generic validation function
function validateData<T>(schema: z.ZodSchema<T>, data: unknown): T | null {
  const result = schema.safeParse(data);
  return result.success ? result.data : null;
}

// Usage
const validatedUser = validateData(UserSchema, userData);
const validatedPagination = validateData(PaginationSchema, pagination);

export {
  validateUser,
  validateData,
  CustomUserSchema,
  CustomUser
};
