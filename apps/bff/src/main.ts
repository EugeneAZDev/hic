import { NestFactory } from "@nestjs/core";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import {
  FastifyAdapter,
  NestFastifyApplication,
} from "@nestjs/platform-fastify";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  // Set global prefix for BFF
  app.setGlobalPrefix("bff");

  // CORS configuration
  app.enableCors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  });

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle("HIC BFF API")
    .setDescription("HIC Backend for Frontend API documentation")
    .setVersion("1.0.0")
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("bff/api/docs", app, document);

  const port = process.env.BFF_PORT || 3010;
  await app.listen(port, "0.0.0.0");
  console.log(`BFF running on: http://localhost:${port}/bff`);
  console.log(`Swagger documentation: http://localhost:${port}/bff/api/docs`);
  console.log("=== BFF DEBUG INFO ===");
  console.log("FRONTEND_URL:", process.env.FRONTEND_URL);
  console.log("NODE_ENV:", process.env.NODE_ENV);
  console.log("=== END BFF DEBUG ===");
}

bootstrap();
