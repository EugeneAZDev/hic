import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  NotFoundException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import * as bcrypt from "bcrypt";
import { UsersService } from "../users/users.service";
import { QueueClientService } from "../queue/queue-client.service";
import {
  Register,
  AuthResponse,
  TokenResponse,
  PublicUser,
} from "@hic/shared-dto";

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly queueClientService: QueueClientService,
  ) {
    // Log environment variables for debugging
    console.log(
      "AuthService: JWT_SECRET loaded:",
      this.configService.get<string>("JWT_SECRET") ? "YES" : "NO",
    );
    console.log(
      "AuthService: JWT_SECRET length:",
      this.configService.get<string>("JWT_SECRET")?.length || 0,
    );
  }

  async validateUser(
    email: string,
    password: string,
  ): Promise<PublicUser | null> {
    const authUser = await this.usersService.findAuthUserByEmailForLogin(email);
    if (
      authUser &&
      authUser.passwordHash &&
      (await bcrypt.compare(password, authUser.passwordHash))
    ) {
      const basic = await this.usersService.findById(authUser.id);
      if (!basic) return null;
      return basic;
    }
    return null;
  }

  async login(user: PublicUser): Promise<AuthResponse> {
    console.log(
      "AuthService: Login - Creating JWT payload for user:",
      user.email,
    );
    const payload = { email: user.email, sub: user.id, name: user.name };

    console.log("AuthService: Login - Signing JWT token...");
    const token = this.jwtService.sign(payload);
    console.log("AuthService: Login - JWT token signed successfully");

    return {
      access_token: token,
      user,
    };
  }

  async register(registerDto: Register): Promise<AuthResponse> {
    console.log("AuthService: Starting registration for:", registerDto.email);

    // Check if user already exists
    console.log("AuthService: Checking if user exists...");
    const existingUser = await this.usersService.findByEmail(registerDto.email);
    if (existingUser) {
      throw new ConflictException("User with this email already exists");
    }
    console.log("AuthService: User does not exist, proceeding...");

    // Hash password
    console.log("AuthService: Hashing password...");
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(registerDto.password, saltRounds);
    console.log("AuthService: Password hashed successfully");

    // Create user
    console.log("AuthService: Creating user in database...");
    const user = await this.usersService.create({
      ...registerDto,
      password: hashedPassword,
    });
    console.log("AuthService: User created with ID:", user.id);

    // Queue welcome email
    try {
      console.log("AuthService: Queuing welcome email...");
      await this.queueClientService.sendWelcomeEmail({
        email: user.email,
        name: user.name,
      });
      console.log("AuthService: Welcome email queued successfully");
    } catch (error) {
      // Log error but don't fail registration
      console.error("Failed to queue welcome email:", error);
    }

    // Queue create user job for backend synchronization
    try {
      console.log("AuthService: Queuing create user job...");
      await this.queueClientService.sendCreateUserJob({
        id: user.id,
        name: user.name,
        email: user.email,
      });
      console.log("AuthService: Create user job queued successfully");
    } catch (error) {
      // Log error but don't fail registration
      console.error("Failed to queue create user job:", error);
    }

    // Return login response
    console.log("AuthService: Calling login method...");
    const result = this.login(user);
    console.log("AuthService: Login method completed");
    return result;
  }

  async forgotPassword(email: string): Promise<void> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      // Don't reveal whether user exists or not
      return;
    }

    // Generate reset token (in real app, save to database with expiry)
    const resetToken = this.jwtService.sign(
      { email: user.email, type: "reset" },
      { expiresIn: "1h" },
    );

    // Queue password reset email
    try {
      const frontendUrl = this.configService.get<string>(
        "FRONTEND_URL",
        "http://localhost:3000",
      );
      await this.queueClientService.sendPasswordResetEmail({
        email: user.email,
        resetToken,
        frontendUrl,
      });
    } catch (error) {
      console.error("Failed to queue password reset email:", error);
      throw error; // In this case, we should fail the operation
    }
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    try {
      const payload = this.jwtService.verify(token);

      if (payload.type !== "reset") {
        throw new UnauthorizedException("Invalid token type");
      }

      const user = await this.usersService.findByEmail(payload.email);
      if (!user) {
        throw new NotFoundException("User not found");
      }

      // Hash new password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

      // Update user password
      await this.usersService.updatePassword(user.id!, hashedPassword);
    } catch (error) {
      throw new UnauthorizedException("Invalid or expired reset token");
    }
  }

  async refreshToken(refreshToken: string): Promise<TokenResponse> {
    try {
      const payload = this.jwtService.verify(refreshToken);
      const user = await this.usersService.findById(payload.sub);

      if (!user) {
        throw new UnauthorizedException("User not found");
      }

      const newPayload = { email: user.email, sub: user.id, name: user.name };
      const access_token = this.jwtService.sign(newPayload);

      return {
        access_token,
        expires_in: 86400, // 24 hours
        token_type: "Bearer",
      };
    } catch (error) {
      throw new UnauthorizedException("Invalid refresh token");
    }
  }
}
