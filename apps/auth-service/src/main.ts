import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import {
  FastifyAdapter,
  NestFastifyApplication,
} from "@nestjs/platform-fastify";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module";
import {
  UserSchema,
  CreateUserSchema,
  UpdateUserSchema,
  LoginSchema,
  RegisterSchema,
  AuthResponseSchema,
  PaginationSchema,
  ApiResponseSchema,
} from "@hic/shared-schemas";
import { generateSchema } from "@anatine/zod-openapi";

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // CORS configuration
  const allowedOrigins = [
    process.env.FRONTEND_URL || "http://localhost:3000",
    "https://hic-staging.gtechdev.top", // staging domain
  ].filter(Boolean);

  app.enableCors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // For development, allow localhost with any port
      if (
        process.env.NODE_ENV !== "production" &&
        origin.match(/^https?:\/\/localhost:\d+$/)
      ) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"), false);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  });

  // Global prefix
  app.setGlobalPrefix("api/auth");

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle("HIC Auth Service API")
    .setDescription("Authentication and User Management API for HIC project")
    .setVersion("1.0")
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    extraModels: [
      generateSchema(UserSchema),
      generateSchema(CreateUserSchema),
      generateSchema(UpdateUserSchema),
      generateSchema(LoginSchema),
      generateSchema(RegisterSchema),
      generateSchema(AuthResponseSchema),
      generateSchema(PaginationSchema),
      generateSchema(ApiResponseSchema(UserSchema)),
    ] as any[],
  });

  SwaggerModule.setup("docs", app, document);

  const port = process.env.AUTH_PORT || 3012;
  await app.listen(port, "0.0.0.0");
  console.log(`Auth Service is running on: http://localhost:${port}`);
  console.log(`Swagger documentation: http://localhost:${port}/docs`);
}

bootstrap();
