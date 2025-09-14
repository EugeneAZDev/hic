import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
  ApiParam,
} from "@nestjs/swagger";
import { UsersService } from "./users.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { UpdateUserSchema, ChangePasswordSchema } from "@hic/shared-schemas";
import { UpdateUser, ChangePassword, PublicUser } from "@hic/shared-dto";
import { ZodValidationPipe } from "@hic/shared-security";

@ApiTags("Users")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: "Get all users" })
  @ApiResponse({
    status: 200,
    description: "List of users retrieved successfully",
    schema: {
      type: "array",
      items: { $ref: "#/components/schemas/PublicUserSchema" },
    },
  })
  @Get()
  async findAll(): Promise<PublicUser[]> {
    return this.usersService.findAll();
  }

  @ApiOperation({ summary: "Get user by ID" })
  @ApiParam({ name: "id", description: "User ID", type: "string" })
  @ApiResponse({
    status: 200,
    description: "User retrieved successfully",
    schema: { $ref: "#/components/schemas/PublicUserSchema" },
  })
  @ApiResponse({ status: 404, description: "User not found" })
  @Get(":id")
  async findOne(@Param("id") id: string): Promise<PublicUser | null> {
    return this.usersService.findById(id);
  }

  @ApiOperation({ summary: "Update user profile" })
  @ApiParam({ name: "id", description: "User ID", type: "string" })
  @ApiBody({ schema: { $ref: "#/components/schemas/UpdateUserSchema" } })
  @ApiResponse({
    status: 200,
    description: "User updated successfully",
    schema: { $ref: "#/components/schemas/PublicUserSchema" },
  })
  @ApiResponse({ status: 404, description: "User not found" })
  @Patch(":id")
  async update(
    @Param("id") id: string,
    @Body(new ZodValidationPipe(UpdateUserSchema)) updateUserDto: UpdateUser,
  ): Promise<PublicUser> {
    return this.usersService.update(id, updateUserDto);
  }

  @ApiOperation({ summary: "Change user password" })
  @ApiParam({ name: "id", description: "User ID", type: "string" })
  @ApiBody({ schema: { $ref: "#/components/schemas/ChangePasswordSchema" } })
  @ApiResponse({ status: 200, description: "Password changed successfully" })
  @ApiResponse({ status: 404, description: "User not found" })
  @ApiResponse({ status: 400, description: "Invalid current password" })
  @Patch(":id/password")
  async changePassword(
    @Param("id") id: string,
    @Body(new ZodValidationPipe(ChangePasswordSchema))
    changePasswordDto: ChangePassword,
  ): Promise<{ message: string }> {
    // TODO: Implement password change with current password verification
    // For now, just update password directly
    const bcrypt = await import("bcrypt");
    const hashedPassword = await bcrypt.hash(changePasswordDto.newPassword, 10);
    await this.usersService.updatePassword(id, hashedPassword);

    return { message: "Password changed successfully" };
  }

  @ApiOperation({ summary: "Delete user" })
  @ApiParam({ name: "id", description: "User ID", type: "string" })
  @ApiResponse({ status: 200, description: "User deleted successfully" })
  @ApiResponse({ status: 404, description: "User not found" })
  @Delete(":id")
  async remove(@Param("id") id: string): Promise<{ message: string }> {
    await this.usersService.remove(id);
    return { message: "User deleted successfully" };
  }
}
