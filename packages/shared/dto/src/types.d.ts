import { z } from 'zod';
import { UserSchema, PublicUserSchema, PaginationSchema, CreateUserSchema, UpdateUserSchema, ChangePasswordSchema, LoginSchema, RegisterSchema, ForgotPasswordSchema, ResetPasswordSchema, AuthResponseSchema, RefreshTokenSchema, TokenResponseSchema, JwtPayloadSchema, WelcomeEmailJobSchema, PasswordResetEmailJobSchema, CustomEmailJobSchema, QueueStatsSchema, CreateUserJobSchema } from '@hic/shared-schemas';
export interface User {
    id: string;
    name: string;
    email: string;
}
export type UserFromSchema = z.infer<typeof UserSchema>;
export type PublicUser = z.infer<typeof PublicUserSchema>;
export type Pagination = z.infer<typeof PaginationSchema>;
export type CreateUser = z.infer<typeof CreateUserSchema>;
export type UpdateUser = z.infer<typeof UpdateUserSchema>;
export type ChangePassword = z.infer<typeof ChangePasswordSchema>;
export type Login = z.infer<typeof LoginSchema>;
export type Register = z.infer<typeof RegisterSchema>;
export type ForgotPassword = z.infer<typeof ForgotPasswordSchema>;
export type ResetPassword = z.infer<typeof ResetPasswordSchema>;
export type AuthResponse = z.infer<typeof AuthResponseSchema>;
export type RefreshToken = z.infer<typeof RefreshTokenSchema>;
export type TokenResponse = z.infer<typeof TokenResponseSchema>;
export type JwtPayload = z.infer<typeof JwtPayloadSchema>;
export type WelcomeEmailJob = z.infer<typeof WelcomeEmailJobSchema>;
export type PasswordResetEmailJob = z.infer<typeof PasswordResetEmailJobSchema>;
export type CustomEmailJob = z.infer<typeof CustomEmailJobSchema>;
export type QueueStats = z.infer<typeof QueueStatsSchema>;
export type CreateUserJob = z.infer<typeof CreateUserJobSchema>;
export type ApiResponse<T = any> = {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
};
