"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SyncUserSchema = exports.CreateUserJobSchema = exports.QueueStatsSchema = exports.CustomEmailJobSchema = exports.PasswordResetEmailJobSchema = exports.WelcomeEmailJobSchema = exports.TokenResponseSchema = exports.RefreshTokenSchema = exports.AuthResponseSchema = exports.ApiResponseSchema = exports.PaginationSchema = exports.JwtPayloadSchema = exports.ResetPasswordSchema = exports.ForgotPasswordSchema = exports.RegisterSchema = exports.LoginSchema = exports.ChangePasswordSchema = exports.UpdateUserSchema = exports.CreateUserSchema = exports.UsersArraySchema = exports.PublicUserSchema = exports.UserSchema = void 0;
const zod_1 = require("zod");
exports.UserSchema = zod_1.z.object({
    id: zod_1.z.string().uuid('ID must be a valid UUID'),
    name: zod_1.z.string().min(1, 'Name cannot be empty').max(100, 'Name is too long'),
    email: zod_1.z.string().email('Invalid email address'),
    password: zod_1.z.string().optional(),
    createdAt: zod_1.z.union([zod_1.z.string(), zod_1.z.date()]).optional().transform(val => {
        if (typeof val === 'string')
            return new Date(val);
        return val;
    }),
    updatedAt: zod_1.z.union([zod_1.z.string(), zod_1.z.date()]).optional().transform(val => {
        if (typeof val === 'string')
            return new Date(val);
        return val;
    }),
}).strict();
exports.PublicUserSchema = exports.UserSchema.omit({ password: true });
exports.UsersArraySchema = exports.PublicUserSchema.array();
exports.CreateUserSchema = zod_1.z.object({
    id: zod_1.z.string().uuid('ID must be a valid UUID').optional(),
    name: zod_1.z.string().min(1, 'Name cannot be empty').max(100, 'Name is too long'),
    email: zod_1.z.string().email('Invalid email address'),
    password: zod_1.z.string().min(8, 'Password must be at least 8 characters')
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, 'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character'),
}).passthrough();
exports.UpdateUserSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'Name cannot be empty').max(100, 'Name is too long').optional(),
    email: zod_1.z.string().email('Invalid email address').optional(),
}).strict();
exports.ChangePasswordSchema = zod_1.z.object({
    currentPassword: zod_1.z.string().min(1, 'Current password is required'),
    newPassword: zod_1.z.string().min(8, 'Password must be at least 8 characters')
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, 'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character'),
}).passthrough();
exports.LoginSchema = zod_1.z.object({
    email: zod_1.z.string().email('Invalid email address'),
    password: zod_1.z.string().min(1, 'Password is required'),
}).passthrough();
exports.RegisterSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'Name cannot be empty').max(100, 'Name is too long'),
    email: zod_1.z.string().email('Invalid email address'),
    password: zod_1.z.string().min(8, 'Password must be at least 8 characters')
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, 'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character'),
}).passthrough();
exports.ForgotPasswordSchema = zod_1.z.object({
    email: zod_1.z.string().email('Invalid email address'),
}).passthrough();
exports.ResetPasswordSchema = zod_1.z.object({
    token: zod_1.z.string().min(1, 'Reset token is required'),
    newPassword: zod_1.z.string().min(8, 'Password must be at least 8 characters')
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, 'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character'),
}).passthrough();
exports.JwtPayloadSchema = zod_1.z.object({
    sub: zod_1.z.string().uuid(),
    email: zod_1.z.string().email(),
    name: zod_1.z.string(),
    iat: zod_1.z.number().optional(),
    exp: zod_1.z.number().optional(),
}).strict();
exports.PaginationSchema = zod_1.z.object({
    page: zod_1.z.number().int().positive().default(1),
    limit: zod_1.z.number().int().positive().max(100).default(10),
}).strict();
const ApiResponseSchema = (dataSchema) => zod_1.z.object({
    success: zod_1.z.boolean(),
    data: dataSchema.optional(),
    message: zod_1.z.string().optional(),
    error: zod_1.z.string().optional(),
});
exports.ApiResponseSchema = ApiResponseSchema;
exports.AuthResponseSchema = zod_1.z.object({
    access_token: zod_1.z.string(),
    user: exports.PublicUserSchema,
}).strict();
exports.RefreshTokenSchema = zod_1.z.object({
    refreshToken: zod_1.z.string(),
}).strict();
exports.TokenResponseSchema = zod_1.z.object({
    access_token: zod_1.z.string(),
    refresh_token: zod_1.z.string().optional(),
    expires_in: zod_1.z.number(),
    token_type: zod_1.z.string().default('Bearer'),
}).strict();
exports.WelcomeEmailJobSchema = zod_1.z.object({
    email: zod_1.z.string().email('Invalid email address'),
    name: zod_1.z.string().min(1, 'Name cannot be empty'),
}).strict();
exports.PasswordResetEmailJobSchema = zod_1.z.object({
    email: zod_1.z.string().email('Invalid email address'),
    resetToken: zod_1.z.string().min(1, 'Reset token is required'),
    frontendUrl: zod_1.z.string().url('Invalid frontend URL'),
}).strict();
exports.CustomEmailJobSchema = zod_1.z.object({
    to: zod_1.z.string().email('Invalid recipient email'),
    subject: zod_1.z.string().min(1, 'Subject is required'),
    htmlContent: zod_1.z.string().optional(),
    textContent: zod_1.z.string().optional(),
    templateId: zod_1.z.number().optional(),
    params: zod_1.z.record(zod_1.z.any()).optional(),
}).strict();
exports.QueueStatsSchema = zod_1.z.object({
    waiting: zod_1.z.number().int().nonnegative(),
    active: zod_1.z.number().int().nonnegative(),
    completed: zod_1.z.number().int().nonnegative(),
    failed: zod_1.z.number().int().nonnegative(),
}).strict();
exports.CreateUserJobSchema = zod_1.z.object({
    id: zod_1.z.string().uuid('User ID must be a valid UUID'),
    name: zod_1.z.string().min(1, 'Name cannot be empty'),
    email: zod_1.z.string().email('Invalid email address'),
}).strict();
exports.SyncUserSchema = zod_1.z.object({
    id: zod_1.z.string().uuid('User ID must be a valid UUID'),
    name: zod_1.z.string().min(1, 'Name cannot be empty'),
    email: zod_1.z.string().email('Invalid email address'),
}).strict();
//# sourceMappingURL=schemas.js.map