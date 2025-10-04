import { NestFactory } from "@nestjs/core";
import {
  FastifyAdapter,
  NestFastifyApplication,
} from "@nestjs/platform-fastify";
import { ConfigService } from "@nestjs/config";
import { Logger, ValidationPipe } from "@nestjs/common";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { patchNestJsSwagger } from "nestjs-zod";
import { AppModule } from "./app.module";

// Patch Swagger for Zod integration
patchNestJsSwagger();

async function bootstrap() {
  const logger = new Logger("WorkerService");

  try {
    const app = await NestFactory.create<NestFastifyApplication>(
      AppModule,
      new FastifyAdapter({ logger: false }),
    );
    const configService = app.get(ConfigService);

    // Global validation pipe with Zod
    app.useGlobalPipes(new ValidationPipe({ transform: true }));

    // Swagger configuration
    const config = new DocumentBuilder()
      .setTitle("HIC Worker Service")
      .setDescription("Background job processing service for HIC platform")
      .setVersion("1.0")
      .addTag("Queue Management", "Endpoints for managing job queues")
      .addTag("Health", "Health check endpoints")
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup("api/docs", app, document);

    const port = configService.get<number>("WORKER_SERVICE_PORT", 5000);

    // Enable graceful shutdown
    app.enableShutdownHooks();

    await app.listen(port, "0.0.0.0");
    logger.log(`Worker service is running on port ${port}`);
    logger.log(
      `Swagger documentation available at http://localhost:${port}/api/docs`,
    );
  } catch (error) {
    logger.error("Failed to start worker service:", error);
    process.exit(1);
  }
}

bootstrap();
