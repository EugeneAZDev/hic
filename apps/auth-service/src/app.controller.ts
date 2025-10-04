import { Controller, Get, Res } from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiExcludeEndpoint,
} from "@nestjs/swagger";
import { FastifyReply } from "fastify";

@ApiTags("Service Info")
@Controller()
export class AppController {
  @ApiOperation({ summary: "Service information" })
  @ApiResponse({
    status: 200,
    description: "Auth service information",
    schema: {
      type: "object",
      properties: {
        service: { type: "string", example: "auth-service" },
        version: { type: "string", example: "1.0.0" },
        status: { type: "string", example: "running" },
        timestamp: { type: "string", format: "date-time" },
        endpoints: {
          type: "object",
          properties: {
            docs: { type: "string", example: "/docs" },
            health: { type: "string", example: "/api/auth/health" },
            api: { type: "string", example: "/api/auth" },
          },
        },
      },
    },
  })
  @Get()
  getServiceInfo() {
    return {
      service: "auth-service",
      version: "1.0.0",
      status: "running",
      timestamp: new Date().toISOString(),
      endpoints: {
        docs: "/docs",
        health: "/api/auth/health",
        api: "/api/auth",
      },
    };
  }

  @ApiExcludeEndpoint()
  @Get("favicon.ico")
  getFavicon(@Res() res: FastifyReply) {
    // Return 204 No Content for favicon requests to prevent browser errors
    res.status(204).send();
  }
}
