import { z } from 'zod';

// User schema based on existing User interface
export const UserSchema = z.object({
  id: z.string().uuid('ID must be a valid UUID'),
  name: z.string().min(1, 'Name cannot be empty').max(100, 'Name is too long'),
  email: z.string().email('Invalid email address'),
  password: z.string().optional(), // Only for internal use, never expose in API
  createdAt: z.union([z.string(), z.date()]).optional().transform(val => {
    if (typeof val === 'string') return new Date(val);
    return val;
  }),
  updatedAt: z.union([z.string(), z.date()]).optional().transform(val => {
    if (typeof val === 'string') return new Date(val);
    return val;
  }),
}).strict();

// Public user schema (without password)
export const PublicUserSchema = UserSchema.omit({ password: true });

// Array of users schema
export const UsersArraySchema = PublicUserSchema.array();

// User creation schema (without id)
export const CreateUserSchema = z.object({
  id: z.string().uuid('ID must be a valid UUID').optional(), // Optional for backward compatibility
  name: z.string().min(1, 'Name cannot be empty').max(100, 'Name is too long'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, 
      'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character'),
}).passthrough();

// User update schema (all fields optional)
export const UpdateUserSchema = z.object({
  name: z.string().min(1, 'Name cannot be empty').max(100, 'Name is too long').optional(),
  email: z.string().email('Invalid email address').optional(),
}).strict();

// Password change schema
export const ChangePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, 
      'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character'),
}).passthrough();

// Auth schemas
export const LoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
}).passthrough();

export const RegisterSchema = z.object({
  name: z.string().min(1, 'Name cannot be empty').max(100, 'Name is too long'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, 
      'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character'),
}).passthrough();

// Password reset schemas
export const ForgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
}).passthrough();

export const ResetPasswordSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, 
      'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character'),
}).passthrough();

// JWT payload schema
export const JwtPayloadSchema = z.object({
  sub: z.string().uuid(), // user id
  email: z.string().email(),
  name: z.string(),
  iat: z.number().optional(),
  exp: z.number().optional(),
}).strict();

// Pagination schema for common use cases
export const PaginationSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(10),
}).strict();

// Generic API response schema
export const ApiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    success: z.boolean(),
    data: dataSchema.optional(),
    message: z.string().optional(),
    error: z.string().optional(),
  });

// Auth response schema
export const AuthResponseSchema = z.object({
  access_token: z.string(),
  user: PublicUserSchema,
}).strict();

// Refresh token schema
export const RefreshTokenSchema = z.object({
  refreshToken: z.string(),
}).strict();

// Auth token response schema
export const TokenResponseSchema = z.object({
  access_token: z.string(),
  refresh_token: z.string().optional(),
  expires_in: z.number(),
  token_type: z.string().default('Bearer'),
}).strict();

// Worker Job Schemas
export const WelcomeEmailJobSchema = z.object({
  email: z.string().email('Invalid email address'),
  name: z.string().min(1, 'Name cannot be empty'),
}).strict();

export const PasswordResetEmailJobSchema = z.object({
  email: z.string().email('Invalid email address'),
  resetToken: z.string().min(1, 'Reset token is required'),
  frontendUrl: z.string().url('Invalid frontend URL'),
}).strict();

export const CustomEmailJobSchema = z.object({
  to: z.string().email('Invalid recipient email'),
  subject: z.string().min(1, 'Subject is required'),
  htmlContent: z.string().optional(),
  textContent: z.string().optional(),
  templateId: z.number().optional(),
  params: z.record(z.any()).optional(),
}).strict();

// Queue Stats Schema
export const QueueStatsSchema = z.object({
  waiting: z.number().int().nonnegative(),
  active: z.number().int().nonnegative(),
  completed: z.number().int().nonnegative(),
  failed: z.number().int().nonnegative(),
}).strict();

// User creation job schema for backend synchronization
export const CreateUserJobSchema = z.object({
  id: z.string().uuid('User ID must be a valid UUID'),
  name: z.string().min(1, 'Name cannot be empty'),
  email: z.string().email('Invalid email address'),
}).strict();

// User sync schema for backend (without password)
export const SyncUserSchema = z.object({
  id: z.string().uuid('User ID must be a valid UUID'),
  name: z.string().min(1, 'Name cannot be empty'),
  email: z.string().email('Invalid email address'),
}).strict();
