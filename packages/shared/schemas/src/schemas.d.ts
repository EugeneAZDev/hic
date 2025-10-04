import { z } from 'zod';
export declare const UserSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    email: z.ZodString;
    password: z.ZodOptional<z.ZodString>;
    createdAt: z.ZodEffects<z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodDate]>>, Date, string | Date>;
    updatedAt: z.ZodEffects<z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodDate]>>, Date, string | Date>;
}, "strict", z.ZodTypeAny, {
    id?: string;
    name?: string;
    email?: string;
    password?: string;
    createdAt?: Date;
    updatedAt?: Date;
}, {
    id?: string;
    name?: string;
    email?: string;
    password?: string;
    createdAt?: string | Date;
    updatedAt?: string | Date;
}>;
export declare const PublicUserSchema: z.ZodObject<Omit<{
    id: z.ZodString;
    name: z.ZodString;
    email: z.ZodString;
    password: z.ZodOptional<z.ZodString>;
    createdAt: z.ZodEffects<z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodDate]>>, Date, string | Date>;
    updatedAt: z.ZodEffects<z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodDate]>>, Date, string | Date>;
}, "password">, "strict", z.ZodTypeAny, {
    id?: string;
    name?: string;
    email?: string;
    createdAt?: Date;
    updatedAt?: Date;
}, {
    id?: string;
    name?: string;
    email?: string;
    createdAt?: string | Date;
    updatedAt?: string | Date;
}>;
export declare const UsersArraySchema: z.ZodArray<z.ZodObject<Omit<{
    id: z.ZodString;
    name: z.ZodString;
    email: z.ZodString;
    password: z.ZodOptional<z.ZodString>;
    createdAt: z.ZodEffects<z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodDate]>>, Date, string | Date>;
    updatedAt: z.ZodEffects<z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodDate]>>, Date, string | Date>;
}, "password">, "strict", z.ZodTypeAny, {
    id?: string;
    name?: string;
    email?: string;
    createdAt?: Date;
    updatedAt?: Date;
}, {
    id?: string;
    name?: string;
    email?: string;
    createdAt?: string | Date;
    updatedAt?: string | Date;
}>, "many">;
export declare const CreateUserSchema: z.ZodObject<{
    id: z.ZodOptional<z.ZodString>;
    name: z.ZodString;
    email: z.ZodString;
    password: z.ZodString;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
    id: z.ZodOptional<z.ZodString>;
    name: z.ZodString;
    email: z.ZodString;
    password: z.ZodString;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
    id: z.ZodOptional<z.ZodString>;
    name: z.ZodString;
    email: z.ZodString;
    password: z.ZodString;
}, z.ZodTypeAny, "passthrough">>;
export declare const UpdateUserSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    email: z.ZodOptional<z.ZodString>;
}, "strict", z.ZodTypeAny, {
    name?: string;
    email?: string;
}, {
    name?: string;
    email?: string;
}>;
export declare const ChangePasswordSchema: z.ZodObject<{
    currentPassword: z.ZodString;
    newPassword: z.ZodString;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
    currentPassword: z.ZodString;
    newPassword: z.ZodString;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
    currentPassword: z.ZodString;
    newPassword: z.ZodString;
}, z.ZodTypeAny, "passthrough">>;
export declare const LoginSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
    email: z.ZodString;
    password: z.ZodString;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
    email: z.ZodString;
    password: z.ZodString;
}, z.ZodTypeAny, "passthrough">>;
export declare const RegisterSchema: z.ZodObject<{
    name: z.ZodString;
    email: z.ZodString;
    password: z.ZodString;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
    name: z.ZodString;
    email: z.ZodString;
    password: z.ZodString;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
    name: z.ZodString;
    email: z.ZodString;
    password: z.ZodString;
}, z.ZodTypeAny, "passthrough">>;
export declare const ForgotPasswordSchema: z.ZodObject<{
    email: z.ZodString;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
    email: z.ZodString;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
    email: z.ZodString;
}, z.ZodTypeAny, "passthrough">>;
export declare const ResetPasswordSchema: z.ZodObject<{
    token: z.ZodString;
    newPassword: z.ZodString;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
    token: z.ZodString;
    newPassword: z.ZodString;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
    token: z.ZodString;
    newPassword: z.ZodString;
}, z.ZodTypeAny, "passthrough">>;
export declare const JwtPayloadSchema: z.ZodObject<{
    sub: z.ZodString;
    email: z.ZodString;
    name: z.ZodString;
    iat: z.ZodOptional<z.ZodNumber>;
    exp: z.ZodOptional<z.ZodNumber>;
}, "strict", z.ZodTypeAny, {
    sub?: string;
    email?: string;
    name?: string;
    iat?: number;
    exp?: number;
}, {
    sub?: string;
    email?: string;
    name?: string;
    iat?: number;
    exp?: number;
}>;
export declare const PaginationSchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodNumber>;
    limit: z.ZodDefault<z.ZodNumber>;
}, "strict", z.ZodTypeAny, {
    page?: number;
    limit?: number;
}, {
    page?: number;
    limit?: number;
}>;
export declare const ApiResponseSchema: <T extends z.ZodTypeAny>(dataSchema: T) => z.ZodObject<{
    success: z.ZodBoolean;
    data: z.ZodOptional<T>;
    message: z.ZodOptional<z.ZodString>;
    error: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, { [k_1 in keyof z.objectUtil.addQuestionMarks<z.baseObjectOutputType<{
    success: z.ZodBoolean;
    data: z.ZodOptional<T>;
    message: z.ZodOptional<z.ZodString>;
    error: z.ZodOptional<z.ZodString>;
}>, undefined extends T["_output"] ? never : "data">]: z.objectUtil.addQuestionMarks<z.baseObjectOutputType<{
    success: z.ZodBoolean;
    data: z.ZodOptional<T>;
    message: z.ZodOptional<z.ZodString>;
    error: z.ZodOptional<z.ZodString>;
}>, undefined extends T["_output"] ? never : "data">[k_1]; }, { [k_2 in keyof z.baseObjectInputType<{
    success: z.ZodBoolean;
    data: z.ZodOptional<T>;
    message: z.ZodOptional<z.ZodString>;
    error: z.ZodOptional<z.ZodString>;
}>]: z.baseObjectInputType<{
    success: z.ZodBoolean;
    data: z.ZodOptional<T>;
    message: z.ZodOptional<z.ZodString>;
    error: z.ZodOptional<z.ZodString>;
}>[k_2]; }>;
export declare const AuthResponseSchema: z.ZodObject<{
    access_token: z.ZodString;
    user: z.ZodObject<Omit<{
        id: z.ZodString;
        name: z.ZodString;
        email: z.ZodString;
        password: z.ZodOptional<z.ZodString>;
        createdAt: z.ZodEffects<z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodDate]>>, Date, string | Date>;
        updatedAt: z.ZodEffects<z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodDate]>>, Date, string | Date>;
    }, "password">, "strict", z.ZodTypeAny, {
        id?: string;
        name?: string;
        email?: string;
        createdAt?: Date;
        updatedAt?: Date;
    }, {
        id?: string;
        name?: string;
        email?: string;
        createdAt?: string | Date;
        updatedAt?: string | Date;
    }>;
}, "strict", z.ZodTypeAny, {
    access_token?: string;
    user?: {
        id?: string;
        name?: string;
        email?: string;
        createdAt?: Date;
        updatedAt?: Date;
    };
}, {
    access_token?: string;
    user?: {
        id?: string;
        name?: string;
        email?: string;
        createdAt?: string | Date;
        updatedAt?: string | Date;
    };
}>;
export declare const RefreshTokenSchema: z.ZodObject<{
    refreshToken: z.ZodString;
}, "strict", z.ZodTypeAny, {
    refreshToken?: string;
}, {
    refreshToken?: string;
}>;
export declare const TokenResponseSchema: z.ZodObject<{
    access_token: z.ZodString;
    refresh_token: z.ZodOptional<z.ZodString>;
    expires_in: z.ZodNumber;
    token_type: z.ZodDefault<z.ZodString>;
}, "strict", z.ZodTypeAny, {
    access_token?: string;
    refresh_token?: string;
    expires_in?: number;
    token_type?: string;
}, {
    access_token?: string;
    refresh_token?: string;
    expires_in?: number;
    token_type?: string;
}>;
export declare const WelcomeEmailJobSchema: z.ZodObject<{
    email: z.ZodString;
    name: z.ZodString;
}, "strict", z.ZodTypeAny, {
    email?: string;
    name?: string;
}, {
    email?: string;
    name?: string;
}>;
export declare const PasswordResetEmailJobSchema: z.ZodObject<{
    email: z.ZodString;
    resetToken: z.ZodString;
    frontendUrl: z.ZodString;
}, "strict", z.ZodTypeAny, {
    email?: string;
    resetToken?: string;
    frontendUrl?: string;
}, {
    email?: string;
    resetToken?: string;
    frontendUrl?: string;
}>;
export declare const CustomEmailJobSchema: z.ZodObject<{
    to: z.ZodString;
    subject: z.ZodString;
    htmlContent: z.ZodOptional<z.ZodString>;
    textContent: z.ZodOptional<z.ZodString>;
    templateId: z.ZodOptional<z.ZodNumber>;
    params: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
}, "strict", z.ZodTypeAny, {
    to?: string;
    subject?: string;
    htmlContent?: string;
    textContent?: string;
    templateId?: number;
    params?: Record<string, any>;
}, {
    to?: string;
    subject?: string;
    htmlContent?: string;
    textContent?: string;
    templateId?: number;
    params?: Record<string, any>;
}>;
export declare const QueueStatsSchema: z.ZodObject<{
    waiting: z.ZodNumber;
    active: z.ZodNumber;
    completed: z.ZodNumber;
    failed: z.ZodNumber;
}, "strict", z.ZodTypeAny, {
    waiting?: number;
    active?: number;
    completed?: number;
    failed?: number;
}, {
    waiting?: number;
    active?: number;
    completed?: number;
    failed?: number;
}>;
export declare const CreateUserJobSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    email: z.ZodString;
}, "strict", z.ZodTypeAny, {
    id?: string;
    name?: string;
    email?: string;
}, {
    id?: string;
    name?: string;
    email?: string;
}>;
export declare const SyncUserSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    email: z.ZodString;
}, "strict", z.ZodTypeAny, {
    id?: string;
    name?: string;
    email?: string;
}, {
    id?: string;
    name?: string;
    email?: string;
}>;
