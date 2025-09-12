import { Controller, Get } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import {
  HealthCheckService,
  HealthCheck,
  MemoryHealthIndicator,
  DiskHealthIndicator,
} from "@nestjs/terminus";

@ApiTags("Health")
@Controller("health")
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private memory: MemoryHealthIndicator,
    private disk: DiskHealthIndicator,
  ) {}

  @ApiOperation({ summary: "Health check endpoint" })
  @ApiResponse({ status: 200, description: "Service is healthy" })
  @ApiResponse({ status: 503, description: "Service is unhealthy" })
  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.memory.checkHeap("memory_heap", 300 * 1024 * 1024), // 300MB instead of 150MB
      () => this.memory.checkRSS("memory_rss", 300 * 1024 * 1024), // 300MB instead of 150MB
      () =>
        this.disk.checkStorage("storage", {
          path: "/",
          threshold: 250 * 1024 * 1024 * 1024,
        }),
    ]);
  }

  @ApiOperation({ summary: "Simple readiness check" })
  @ApiResponse({ status: 200, description: "Service is ready" })
  @Get("ready")
  ready() {
    return { status: "ok", timestamp: new Date().toISOString() };
  }

  @ApiOperation({ summary: "Simple liveness check" })
  @ApiResponse({ status: 200, description: "Service is alive" })
  @Get("live")
  live() {
    return {
      status: "ok",
      service: "auth-service",
      timestamp: new Date().toISOString(),
    };
  }
}
