import {
  Body,
  Controller,
  Post,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { LocalAuthGuard } from "./guards/local-auth.guard";
import {
  LoginSchema,
  ForgotPasswordSchema,
  ResetPasswordSchema,
} from "@hic/shared-schemas";
import {
  Login,
  ForgotPassword,
  ResetPassword,
  AuthResponse,
  TokenResponse,
} from "@hic/shared-dto";
import { ZodValidationPipe } from "@hic/shared-security";

@ApiTags("Authentication")
@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: "User login" })
  @ApiBody({ schema: { $ref: "#/components/schemas/LoginSchema" } })
  @ApiResponse({
    status: 200,
    description: "Login successful",
    schema: { $ref: "#/components/schemas/AuthResponseSchema" },
  })
  @ApiResponse({ status: 401, description: "Invalid credentials" })
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @Post("login")
  async login(
    @Body(new ZodValidationPipe(LoginSchema)) loginDto: Login,
    @Request() req: any,
  ): Promise<AuthResponse> {
    return this.authService.login(req.user);
  }

  @ApiOperation({ summary: "User registration" })
  @ApiBody({ schema: { $ref: "#/components/schemas/RegisterSchema" } })
  @ApiResponse({
    status: 201,
    description: "Registration successful",
    schema: { $ref: "#/components/schemas/AuthResponseSchema" },
  })
  @ApiResponse({
    status: 400,
    description: "Invalid data or user already exists",
  })
  @Post("register")
  async register(
    @Body() registerDto: any, // Temporarily removed ZodValidationPipe for debugging
  ): Promise<AuthResponse> {
    console.log("AuthController: Register endpoint called with:", {
      ...registerDto,
      password: "[HIDDEN]",
    });
    console.log("AuthController: Calling authService.register...");

    try {
      const result = await this.authService.register(registerDto);
      console.log("AuthController: Registration completed successfully");
      return result;
    } catch (error) {
      console.error("AuthController: Registration failed:", error);
      throw error;
    }
  }

  @ApiOperation({ summary: "Request password reset" })
  @ApiBody({ schema: { $ref: "#/components/schemas/ForgotPasswordSchema" } })
  @ApiResponse({ status: 200, description: "Password reset email sent" })
  @ApiResponse({ status: 404, description: "User not found" })
  @HttpCode(HttpStatus.OK)
  @Post("forgot-password")
  async forgotPassword(
    @Body(new ZodValidationPipe(ForgotPasswordSchema))
    forgotPasswordDto: ForgotPassword,
  ): Promise<{ message: string }> {
    await this.authService.forgotPassword(forgotPasswordDto.email);
    return { message: "Password reset email sent if user exists" };
  }

  @ApiOperation({ summary: "Reset password with token" })
  @ApiBody({ schema: { $ref: "#/components/schemas/ResetPasswordSchema" } })
  @ApiResponse({ status: 200, description: "Password reset successful" })
  @ApiResponse({ status: 400, description: "Invalid or expired token" })
  @HttpCode(HttpStatus.OK)
  @Post("reset-password")
  async resetPassword(
    @Body(new ZodValidationPipe(ResetPasswordSchema))
    resetPasswordDto: ResetPassword,
  ): Promise<{ message: string }> {
    await this.authService.resetPassword(
      resetPasswordDto.token,
      resetPasswordDto.newPassword,
    );
    return { message: "Password reset successful" };
  }

  @ApiOperation({ summary: "Refresh access token" })
  @ApiResponse({
    status: 200,
    description: "Token refreshed",
    schema: { $ref: "#/components/schemas/TokenResponseSchema" },
  })
  @ApiResponse({ status: 401, description: "Invalid refresh token" })
  @HttpCode(HttpStatus.OK)
  @Post("refresh")
  async refresh(
    @Body("refreshToken") refreshToken: string,
  ): Promise<TokenResponse> {
    return this.authService.refreshToken(refreshToken);
  }

  @ApiOperation({ summary: "User logout" })
  @ApiResponse({ status: 200, description: "Logout successful" })
  @HttpCode(HttpStatus.OK)
  @Post("logout")
  async logout(): Promise<{ message: string }> {
    // In a real implementation, you might want to invalidate the token
    // For now, just return success message
    return { message: "Logout successful" };
  }
}
